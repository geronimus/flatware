function copyValue( ref ) {
  if ( Array.isArray( ref ) )
    return ref.map( copyValue );
  else if ( ref instanceof Date )
    return new Date( ref.getTime() );
  else
    return ref;
}

function jsonIsValid( jsonText ) {
  
  if ( typeof jsonText !== "string" )
    return false;
  else {
    try { JSON.parse( jsonText ); }
    catch( ignore ) { return false; }
  }
  return true;
}

function reviveJSONDates( key, val ) {
  const isoDatePattern =
    /^([+-]\d{2})?\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}Z$/;

  if ( typeof val === "string" && isoDatePattern.test( val ) )
    return new Date( val );
  else
    return val;
}

export { copyValue, jsonIsValid, reviveJSONDates };

