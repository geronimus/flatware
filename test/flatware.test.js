import { assert } from "chai";
import flatware from "../src/flatware";

describe( "flatware", () => {

  describe( ".newSpec()", () => {
    
    it( "creates a spec instance", () => {
      
      const spec = flatware.newSpec();

      assert.isObject( spec );
      assert.isFrozen( spec );
    });
  });

  describe( ".newConf", () => {
  
    describe( "creates a conf instance", () => {
      
      const conf = flatware.newConf();

      assert.isObject( conf );
      assert.isFrozen( conf );
    });
  });
});


