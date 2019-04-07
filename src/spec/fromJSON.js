import { IllegalArgument } from "@geronimus/utils";
import { reviveJSONDates } from "../util/value";
import specFromObject from "./fromObject";

function specFromJSON( jsonObj ) {
  
  if ( typeof jsonObj !== "string" )
    IllegalArgument( "jsonObj", "A string", jsonObj );
  
  let obj;

  try { obj = JSON.parse( jsonObj, reviveJSONDates ); }
  catch( error ) {
    IllegalArgument(
      "jsonObj",
      "A parseable JSON string",
      `${ jsonObj } which throws ${ error.message }`
    );
  }

  return specFromObject( obj );
}

export default specFromJSON;

