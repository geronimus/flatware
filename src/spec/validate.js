import { IllegalArgument, isNull } from "@geronimus/utils";
import flatware from "../flatware";

function validateSpec( spec ) {

  const specExample = flatware.spec.new();
  specExample.settings.define( "example", "string" );

  if ( !isObject( spec ) || !hasSpecMembers( spec ) )
    badSpec( spec );
    
  function isObject( spec ) {
    return !isNull( spec ) && typeof spec === "object";  
  }

  function hasSpecMembers( spec ) {
    return quacksLike( spec, specExample ) &&
      spec.settings.list()
        .every( setting => hasSettingMembers( spec.settings.get( setting ) ) );
  }

  function hasSettingMembers( setting ) {
    return quacksLike( setting, specExample.settings.get( "example" ) );  
  }

  function quacksLike( obj, duck ) {
    return Object.keys( duck )
      .filter( key => key !== "desc" )
      .every( key => {
        return Object.keys( obj ).includes( key ) &&
          typeof obj[ key ] === typeof duck[ key ];
      });
  }
}

function badSpec( spec ) {  
  IllegalArgument(
    "spec",
    "A spec object",
    JSON.stringify( spec, null, 2 )
  );
}

export { validateSpec };

