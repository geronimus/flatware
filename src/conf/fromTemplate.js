import confFromObject from "./fromObject";
import { validateJSON, validateConfInterface } from "../template/validate";

function confFromTemplate( template ) {
    
  const templateObj = validateJSON( template );
  validateConfInterface( templateObj );

  return makeConf( templateObj );

  function makeConf( templateObj ) {
  
    const confObj = Object.keys( templateObj )
      .reduce(
        ( obj, setting ) => {
          obj[ setting ] = replaceNull( templateObj[ setting ].value );
          return obj;
        },
        {}
      );

    return confFromObject( confObj );

    function replaceNull( value ) {
      if ( value === null )
        return undefined;
      else
        return value;
    }
  }
}

export default confFromTemplate;

