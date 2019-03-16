import { IllegalArgument, isNull } from "@geronimus/utils";

function create( name, type ) {

  validateArgs( [ ...arguments ] );

  return Object.freeze({ name, type });

  function validateArgs( args ) {

    const allowedTypes = [
      "boolean",
      "number",
      "string",
      "Date"
    ];
  
    if (
      isNull( args[ 0 ] ) ||
        typeof args[ 0 ] !== "string"
    )
      IllegalArgument( "name", "A setting requires a name", args[ 0 ] );
    else if (
      isNull( args[ 1 ] ) ||
        typeof args[ 1 ] !== "string" ||
        !allowedTypes.includes( args[ 1 ] )
    )
      IllegalArgument( "type", `The data type must be one of: ${ allowedTypes }`, args[ 1 ] );
  }
}

export default Object.freeze({
  create
});

