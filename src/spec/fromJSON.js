import { IllegalArgument } from "@geronimus/utils";
import specFromObject from "./fromObject";

function specFromJSON( jsonObj ) {
  
  if ( typeof jsonObj !== "string" )
    IllegalArgument( "jsonObj", "A string", jsonObj );
  
  let obj;

  try { obj = JSON.parse( jsonObj, reviveDates ); }
  catch( error ) {
    IllegalArgument(
      "jsonObj",
      "A parseable JSON string",
      `${ jsonObj } which throws ${ error.message }`
    );
  }

  return specFromObject( obj );

  function reviveDates( key, val ) {
    const isoDatePattern =
      /^([+-]\d{2})?\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}Z$/;

    if ( typeof val === "string" && isoDatePattern.test( val ) )
      return new Date( val );
    else
      return val;
  }
}

export default specFromJSON;

