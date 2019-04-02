import { IllegalArgument } from "@geronimus/utils";
import specFromObject from "./fromObject";

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

export default specFromJSON;

