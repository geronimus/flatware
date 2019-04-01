import { isValidName } from "./spec/setting.js";
import { IllegalArgument, IllegalOperation, isNull } from "@geronimus/utils";


function confFromJSON( jsonText ) {

  if ( typeof jsonText !== "string" )
    IllegalArgument( "jsonText", "A string", jsonText );

  let obj;

  try { obj = JSON.parse( jsonText ); }
  catch( error ) {
    IllegalArgument(
      "jsonText",
      "A valid JSON string",
      `${ jsonText }\n\nwhich throws:\n\n${ error.message }`
    );
  }

  return confFromObject( rehydrateDates( obj ) );

  function rehydrateDates( obj ) {

    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    Object.keys( obj ).forEach( key => {
      if (
        typeof obj[ key ] === "string" &&
          isoDatePattern.test( obj[ key ] )
      )
        obj[ key ] = new Date( obj[ key ] );
    });

    return obj;
  }
}

function confFromObject( obj ) {

  validateObj( obj );

  const conf = newConf();

  Object.keys( obj ).forEach( key => {
    conf.values.set( key, obj[ key ] );
  });

  return conf;

  function validateObj( obj ) {
  
    if ( !isObject( obj ) )
      IllegalArgument( "obj", "An object value", obj );

    const illegalNames = findIllegalNames( obj );
    if ( illegalNames.length > 0 )
      IllegalArgument(
        "obj",
        "A simple value map containing legal value names",
        `Illegal names:\n- ${ illegalNames.join( "\n- " ) }\n\nin:\n\n${ obj }`
      );

    const illegalValues = findIllegalValues( obj );
    if ( illegalValues.length > 0 )
      IllegalArgument(
        "obj",
        "A simple value map containing values of type boolean, number, string, or Date",
        `Illegal values:\n- ${ illegalValues.join( "\n -" ) }\n\nin:\n\n${ obj }`
      );

    function isObject( obj ) {
      return !isNull( obj ) &&
        typeof obj === "object" &&
        !Array.isArray( obj ) &&
        !( obj instanceof Date );
    }

    function findIllegalNames( obj ) {
      return Object.keys( obj ).filter( key => !isValidName( key ) ); 
    }

    function findIllegalValues( obj ) {
      return Object.keys( obj ).filter( key => {
        return !( obj[ key ] instanceof Date ) &&
          ![ "boolean", "number", "string" ].includes( typeof obj[ key ] );
      });
    }
  }
}

function newConf() {

  const vals = {};

  const publicInterface = Object.freeze({
    values: Object.freeze({
      set: defineValue,
      get: getValue,
      remove: removeValue,
      list: listValues
    })
  });

  return publicInterface;

  function defineValue( name, value ) {

    validateName( name );
    validateValue( value );

    if ( value === undefined && Object.keys( vals ).includes( name ) )
      removeValue( name );
    else if ( value !== undefined )
      vals[ name ] = value;

    return publicInterface;

    function validateValue( value ) {  
      if (
        !( value instanceof Date ) &&
          ![ "undefined", "boolean", "number", "string" ].includes( typeof value )
      )
        IllegalArgument(
          "value",
          "A value of one of these types:\n- " +
            `${ [ "undefined", "boolean", "number", "string", "Date" ].join( "\n- " ) }`,
          value
        );
    }
  }

  function getValue( name ) {

    validateName( name );
    return getValueCopy( name );
  }

  function removeValue( name ) {
    
    validateName( name );
    if ( !Object.keys( vals ).includes( name ) )
      IllegalOperation(
        `remove( ${ name } )`,
        "You cannot remove a value that has not been set",
        `The value ${ name } does not exist in this conf`
      );

    delete vals[ name ];

    return publicInterface;
  }

  function listValues() {

    const result = {};

    Object.keys( vals )
      .sort()
      .forEach( item => {
        result[ item ] = getValueCopy( item );
      });

    return result;
  }

  function validateName( name ) {  
    if ( !isValidName( name ) )
      IllegalArgument(
        "name",
        "A string not containing line breaks, nor exclusively composed of spaces",
        name
      );
  }

  function getValueCopy( name ) {
    if ( vals[ name ] instanceof Date )
      return new Date( vals[ name ].getTime() );
    else
      return vals[ name ];
  }
}

export {
  newConf,
  confFromObject,
  confFromJSON
};

