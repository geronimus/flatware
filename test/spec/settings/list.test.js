import { assert } from "chai";
import flatware from "../../../src/flatware";

let spec;

describe( "spec.settings", () => {

  describe( ".list()", () => {
    
    beforeEach( () => {
      spec = flatware.spec.new();
    });

    it( "returns the empty list, if there are no settings defined", () => {
      assert.deepEqual( spec.settings.list(), [] );
    });

    it( "if there are settings, it returns their names in alphabetical order", () => {
      
      spec.settings.define( "zarzuela", "string" );
      spec.settings.define( "aardvark", "string" );

      assert.deepEqual( spec.settings.list(), [ "aardvark", "zarzuela" ] );
    });
  });
});

