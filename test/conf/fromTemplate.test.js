import { assert } from "chai";
import flatware from "../../src/flatware";

describe( "conf", () => {
  
  describe( ".fromTemplate( template )", () => {
    
    it( "rejects non-string arguments", () => {
      
      [
        undefined, null, true, 1, {}, [], new Date()
      ].forEach( badTemplate => {
        assert.throws(
          () => { flatware.conf.fromTemplate( badTemplate ); },
          /^Illegal argument/
        );
      });
    });
  });
});

