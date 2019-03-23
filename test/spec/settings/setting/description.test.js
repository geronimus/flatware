import { assert } from "chai";
import flatware from "../../../../src/flatware";

let spec;
let describedSetting;

describe( "spec.settings.setting", () => {

  describe( ".description", () => {
    
    beforeEach( () => {
      spec = flatware.newSpec();  
      describedSetting = spec.settings.define( "json length", "number" );
    });

    it( "if you try to get it before it is set, it is undefined", () => {
      assert.isUndefined( describedSetting.description );
    });

    it( "you can't set it to a non-string value", () => {
      [ null, true, 1, {}, [ "there is a string in here" ] ].forEach( val => {
        assert.throws( () => { describedSetting.description = val; }, /^Illegal argument/ );
      });
    });

    it( "...but you can set it to undefined (not a value)", () => {
      assert.doesNotThrow( () => { describedSetting.description = undefined; } );  
      describedSetting.description = undefined;
      assert.isUndefined( describedSetting.description );
    });

    it( "you can set it to a string value, and get that value back", () => {
      let desc = "The maximum length for the raw JSON document length";
      describedSetting.description = desc;

      assert.strictEqual( describedSetting.description, desc );
    });

    it( "you can't set it to the zero-length string", () => {
      assert.throws( () => { describedSetting.description = ""; }, /^Illegal argument/ );
    });
  });
});

