import { assert } from "chai";
import flatware from "../src/flatware";

let conf;

describe( "settings", () => {

  describe( ".defs", () => {

    describe( ".list()", () => {
      
      beforeEach( () => {
        conf = flatware.newConfig();
      });

      it( "returns the empty list, if there are no settings defined", () => {
        assert.deepEqual( conf.settings.defs.list(), [] );
      });

      it( "if there are settings, it returns their names in alphabetical order", () => {
        
        conf.settings.define( "zarzuela", "string" );
        conf.settings.define( "aardvark", "string" );

        assert.deepEqual( conf.settings.defs.list(), [ "aardvark", "zarzuela" ] );
      });
    });

    describe( ".get( settingName )", () => {
    
      beforeEach( () => {
        conf = flatware.newConfig();  
      });

      it( "throws an illegal argument exception when you provide invalid arguments", () => {
      
        assert.throws( () => { conf.settings.defs.get(); }, /^Illegal argument/ );

        [
          undefined, null, true, 1, {}, [], new Date()
        ].forEach( arg => {
          assert.throws( () => { conf.settings.defs.get( arg ); }, /^Illegal argument/ );
        });
      });

      it( "throws an illegal operation exception when you attempt to get a setting that is not defined", () => {
      
        assert.throws( () => { conf.settings.defs.get( "Harry Lime" ); }, /^Illegal operation/ );
      });

      it( "when called with the name of a previously-defined setting, it returns a reference to that setting", () => {
      
        const memorySetting = conf.settings.define( "memoryLimit", "number" );

        assert.strictEqual( conf.settings.defs.get( "memoryLimit" ), memorySetting );
      });
    });
  });
});

