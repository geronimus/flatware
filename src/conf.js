import { isValidName } from "./spec/setting.js";
import { IllegalArgument, IllegalOperation } from "@geronimus/utils";

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

export { newConf };

