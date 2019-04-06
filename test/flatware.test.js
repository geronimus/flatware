import { assert } from "chai";
import flatware from "../src/flatware";

describe( "flatware", () => {

  describe( ".spec.new()", () => {
    
    it( "creates a spec instance", () => {
      
      const spec = flatware.spec.new();

      assert.isObject( spec );
      assert.isFrozen( spec );
    });
  });

  describe( ".conf.new()", () => {
  
    describe( "creates a conf instance", () => {
      
      const conf = flatware.conf.new();

      assert.isObject( conf );
      assert.isFrozen( conf );
    });
  });
});


