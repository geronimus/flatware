import { assert } from "chai";
import flatware from "../../../src/flatware";

let spec;

describe( "settings", () => {

  describe( ".defs", () => {

    describe( ".list()", () => {
      
      beforeEach( () => {
        spec = flatware.newSpec();
      });

      it( "returns the empty list, if there are no settings defined", () => {
        assert.deepEqual( spec.settings.defs.list(), [] );
      });

      it( "if there are settings, it returns their names in alphabetical order", () => {
        
        spec.settings.define( "zarzuela", "string" );
        spec.settings.define( "aardvark", "string" );

        assert.deepEqual( spec.settings.defs.list(), [ "aardvark", "zarzuela" ] );
      });
    });

    describe( ".get( settingName )", () => {
    
      beforeEach( () => {
        spec = flatware.newSpec();  
      });

      it( "throws an illegal argument exception when you provide invalid arguments", () => {
      
        assert.throws( () => { spec.settings.defs.get(); }, /^Illegal argument/ );

        [
          undefined, null, true, 1, {}, [], new Date()
        ].forEach( arg => {
          assert.throws( () => { spec.settings.defs.get( arg ); }, /^Illegal argument/ );
        });
      });

      it( "throws an illegal operation exception when you attempt to get a setting that is not defined", () => {
      
        assert.throws( () => { spec.settings.defs.get( "Harry Lime" ); }, /^Illegal operation/ );
      });

      it( "when called with the name of a previously-defined setting, it returns a reference to that setting", () => {
      
        const memorySetting = spec.settings.define( "memoryLimit", "number" );

        assert.strictEqual( spec.settings.defs.get( "memoryLimit" ), memorySetting );
      });
    });
  });
});

