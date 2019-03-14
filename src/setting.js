import { IllegalArgument, isNull } from "@geronimus/utils";

function create( name, type ) {

  validateArgs( [ ...arguments ] );

  return Object.freeze({ name, type });

  function validateArgs( args ) {
  
    if ( isNull( args[ 0 ] ) )
      IllegalArgument( "name", "A setting requires a name", args[ 0 ] );
    else if ( isNull( args[ 1 ] ) )
      IllegalArgument( "type", "A setting requires a data type", args[ 1 ] );
  }
}

export default Object.freeze({
  create
});

