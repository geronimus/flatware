import { IllegalArgument, IllegalOperation, isNull } from "@geronimus/utils";
import { objectify, makeTemplate } from "./representation";
import { setting } from "./setting.js";
import {
  types as allowedTypes,
  constraintsByType as allowedConstraints
} from "./structure";

function newSpec() {

  const defs = {};

  return Object.freeze({
    asObject: () => { return objectify( defs ); },
    getTemplate: () => { return makeTemplate( defs ); },
    settings: Object.freeze({
      define: defineSetting,
      fromObject,
      get: getDef,
      list: listDefs,
      remove: removeDef
    })
  });

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

export default newSpec;

