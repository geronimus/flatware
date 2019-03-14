import { assert } from "chai";
import flatware from "../src/flatware";

describe( "flatware", () => {

  describe( ".newConfig()", () => {
    
    it( "creates a config instance", () => {
      
      const conf = flatware.newConfig();

      assert.isObject( conf );
      assert.isFrozen( conf );
    });
  });
});


