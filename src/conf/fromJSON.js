import { IllegalArgument } from "@geronimus/utils";
import confFromObject from "../conf/fromObject";

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

export default confFromJSON;

