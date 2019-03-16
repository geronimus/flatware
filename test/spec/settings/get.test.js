import { assert } from "chai";
import flatware from "../../../src/flatware";

let spec;

describe( "spec.settings", () => {

  describe( ".get( settingName )", () => {
  
    beforeEach( () => {
      spec = flatware.newSpec();  
    });

    it( "throws an illegal argument exception when you provide an invalid settingName", () => {
    
      assert.throws( () => { spec.settings.get(); }, /^Illegal argument/ );

      [
        undefined, null, true, 1, {}, [], new Date()
      ].forEach( arg => {
        assert.throws( () => { spec.settings.get( arg ); }, /^Illegal argument/ );
      });
    });

    it( "throws an illegal operation exception when you attempt to get a setting that is not defined", () => {
    
      assert.throws( () => { spec.settings.get( "Harry Lime" ); }, /^Illegal operation/ );
    });

    it( "when called with the name of a previously-defined setting, it returns a reference to that setting", () => {
    
      const memorySetting = spec.settings.define( "memoryLimit", "number" );

      assert.strictEqual( spec.settings.get( "memoryLimit" ), memorySetting );
    });
  });
});

