import { allowedConstraints, allowedTypes, isValidName, setting } from "./spec/setting.js";
import { IllegalArgument, IllegalOperation, isNull } from "@geronimus/utils";

function specFromJSON( jsonObj ) {
  
  if ( typeof jsonObj !== "string" )
    IllegalArgument( "jsonObj", "A string", jsonObj );
  
  let obj;

  try { obj = rehydrateDates( JSON.parse( jsonObj ) ); }
  catch( error ) {
    IllegalArgument(
      "jsonObj",
      "A parseable JSON string",
      `${ jsonObj } which throws ${ error.message }`
    );
  }

  return specFromObject( obj );

  function rehydrateDates( obj ) {
    
    Object.keys( obj ).forEach( setting => {
      if ( obj[ setting ][ "type" ] === "Date" )
        Object.keys( obj[ setting ] )
          .filter( item => [ "upperBound", "lowerBound", "optionsList" ].includes( item ) )
          .forEach( item => {
            if ( item === "optionsList" && Array.isArray( obj[ setting ][ item ] ) )
              obj[ setting ][ item ] = obj[ setting ][ item ].map( isoString => getDateVal( isoString ) );
            else
              obj[ setting ][ item ] = getDateVal( obj[ setting ][ item ] );
          });
    });

    return obj;

    function getDateVal( isoString ) {
      const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

      if (
        typeof isoString === "string" &&
          isoDatePattern.test( isoString )
      )
        return new Date( isoString );
      else
        return isoString;
    }
  }
}

function specFromObject( obj ) {

  validateObj( obj );

  Object.keys( obj ).forEach( name => {
    validateSettingProps( name, obj[ name ] );
  });

  const spec = newSpec();

  Object.keys( obj ).forEach( name => {
    const setting = spec.settings.define( name, obj[ name ].type );
    setting.desc = obj[ name ].desc;
    
    Object.keys( obj[ name ] )
      .filter( prop => ![ "type", "desc" ].includes( prop ) )
      .forEach( constraint => {
        setting.setConstraint( constraint, obj[ name ][ constraint ] );  
      });
  });

  return spec;

  function validateObj( obj ) {
    if ( isNull( obj ) || Array.isArray( obj ) || typeof obj !== "object" )
      IllegalArgument( "obj", "An object defining a spec", obj );
  }

  function validateSettingProps( name, defObj ) {

    validateName( name );
    validateAllowedType( name, defObj );
    validateTypeConstraints( name, defObj );

    function validateName( name ) {
      if ( !isValidName( name ) )
        IllegalArgument(
          "setting name",
          "A string with at least one non-space character and no new lines",
          defObj
        );
    }

    function validateAllowedType( name, defObj ) {
      if (
        !Object.keys( defObj ).includes( "type" ) ||
          !allowedTypes.includes( defObj[ "type" ] )
      )
        IllegalArgument(
          name,
          `One of: \n- ${ allowedTypes.join( "\n- " ) }`,
          defObj[ "type" ]
        );
    }

    function validateTypeConstraints( name, defObj ) {
      Object.keys( defObj )
        .filter( key => [ "type", "desc" ].includes[ key ] )
        .forEach( key => {
          if ( !allowedConstraints[ defObj[ "type" ] ].includes( key ) )
            IllegalArgument(
              name,
              "An object defining only the constraints:\n- " +
                `${ allowedConstraints[ defObj[ "type" ] ].join( "\n- " ) }`,
              key
            );
        });
    }
  }
}

function newSpec() {

  const defs = {};

  return Object.freeze({
    asObject,
    settings: Object.freeze({
      define: defineSetting,
      fromObject,
      get: getDef,
      list: listDefs,
      remove: removeDef
    })
  });

  function asObject() {
    return Object.keys( defs ).reduce( addValidSettingProps, {} );

    function addValidSettingProps( obj, settingName ) {
      const setting = defs[ settingName ];
      const settingRep = { type: setting.type };

      addDesc( setting, settingRep );
      addConstraints( setting, settingRep );

      obj[ settingName ] = settingRep;
      return obj;

      function addDesc( setting, rep ) {
        if ( !isNull( setting.desc ) )
          rep.desc = setting.desc;
      }

      function addConstraints( setting, rep ) {
        allowedConstraints[ setting.type ]
          .filter( constraint => !isNull( setting.getConstraint( constraint ) ) )
          .forEach( constraint => {
            rep[ constraint ] = setting.getConstraint( constraint );
          });
      }
    }
  }

  function defineSetting( name, type ) {
  
    const newDef = setting.create( name, type, processMessage );

    defs[ newDef.name ] = newDef;
    return newDef;
  }

  function getDef( settingName ) {
  
    validateType( settingName, "string", "getDef" );
    validateSettingExists( settingName, "get" );
    return defs[ settingName ];
  }

  function listDefs() {
    return Object.keys( defs ).sort();
  }

  function removeDef( settingName ) {

    validateType( settingName, "string", "removeDef" );
    validateSettingExists( settingName, "remove" );
    delete defs[ settingName ];
  }

  function fromObject( name, obj ) {
    
    validateObj( obj );

    const result = defineSetting( name, obj.type );
    result.desc = obj.desc;

    allowedConstraints[ obj.type ].forEach( constraint => {
      result.setConstraint( constraint, obj[ constraint ] ); 
    });

    return result;

    function validateObj( obj ) {
      if (
        isNull( obj ) ||
          typeof obj !== "object" ||
          !Object.keys( obj ).includes( "type" ) ||
          !allowedTypes.includes( obj.type )
      )
        IllegalArgument(
          "obj",
          "An object that includes the property \"type\"",
          obj
        );
    }
  }

  function processMessage( message ) {
  
    if ( isRename( message ) ) {
      const renamedDef = defs[ message.oldName ];
      removeDef( message.oldName );
      defs[ message.newName ] = renamedDef;
    }

    function isRename( message ) {
      return typeof message === "object" &&
        [ "event", "oldName", "newName"  ].every(
          key => Object.keys( message ).includes( key ) &&
            typeof message[ key ] === "string"
        ) &&
        message.event === "rename" &&
        listDefs().includes( ( message.oldName ) );
    }
  }

  function validateType( value, type, method ) {
  
    if ( typeof value !== type )
      IllegalArgument(
        `settings.${ method }( ${ value } )`,
        `A value of type "${ type }"`,
        value
      );
  }

  function validateSettingExists( settingName, method ) {  
    if ( !listDefs().includes( settingName ) )
      IllegalOperation(
        `settings.defs.${ method }( ${ settingName } )`,
        `${ settingName } must be a defined setting`,
        `${ settingName } is not an existing setting definition`
      );
  }
}

export {
  newSpec,
  specFromJSON,
  specFromObject
};

