import { IllegalArgument, IllegalOperation } from "@geronimus/utils";
import { copyValue } from "../value";
import { isValidName } from "../spec/setting.js";

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
    return copyValue( vals[ name ] );
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
        result[ item ] = copyValue( vals[ item ] );
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
}

export default newConf;

