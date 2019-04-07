import specFromObject from "./fromObject";
import { validateJSON, validateSpecInterface } from "../template/validate";

function specFromTemplate( template ) {
    
  const templateObj = validateJSON( template );
  validateSpecInterface( templateObj );

  return makeSpec( templateObj );

  function makeSpec( templateObj ) {
    
    Object.keys( templateObj ).forEach( setting => {
      delete templateObj[ setting ].value;
    });

    return specFromObject( templateObj );
  }
}

export default specFromTemplate;

