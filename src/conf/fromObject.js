import { IllegalArgument, isNull } from "@geronimus/utils";
import newConf from "../conf/new";
import { isValidName } from "../spec/setting";

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

export default confFromObject;

