import { IllegalArgument } from "@geronimus/utils";
import { reviveJSONDates } from "../util/value";
import confFromObject from "./fromObject";

function confFromJSON( jsonText ) {

  if ( typeof jsonText !== "string" )
    IllegalArgument( "jsonText", "A string", jsonText );

  let obj;

  try { obj = JSON.parse( jsonText, reviveJSONDates ); }
  catch( error ) {
    IllegalArgument(
      "jsonText",
      "A valid JSON string",
      `${ jsonText }\n\nwhich throws:\n\n${ error.message }`
    );
  }

  return confFromObject( obj );
}

export default confFromJSON;

