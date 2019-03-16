import { assert } from "chai";
import flatware from "../../../src/flatware";

let spec;

describe( "spec.settings", () => {

  describe( ".remove( settingName )", () => {
  
    beforeEach( () => {
      spec = flatware.newSpec();  
    });

    it( "throws an illegal argument exception when you provide an invalid settingName", () => {
      
      assert.throws( () => { spec.settings.remove(); }, /^Illegal argument/ );

      [
        undefined, null, true, 1, {}, [], new Date()
      ].forEach( arg => {
        assert.throws( () => { spec.settings.remove( arg ); }, /^Illegal argument/ );
      });
    });

    it( "throws an illegal operation exception when you attempt to remove a setting that is not defined", () => {
      
      assert.throws( () => { spec.settings.remove( "Harry Lime" ); }, /^Illegal operation/ );
    });

    it( "when called with the name of a previously-defined setting, it removes that setting", () => {
    
      const memorySetting = spec.settings.define( "memoryLimit", "number" );
      spec.settings.remove( "memoryLimit" );

      assert.throws( () => { spec.settings.get( "memoryLimit" ); }, /^Illegal operation/ );
    });
  });
});

