import { assert } from "chai";
import flatware from "../../../../src/flatware";

let spec;
let describedSetting;

describe( "spec.settings.setting", () => {

  describe( ".desc", () => {
    
    beforeEach( () => {
      spec = flatware.spec.new();  
      describedSetting = spec.settings.define( "json length", "number" );
    });

    it( "if you try to get it before it is set, it is undefined", () => {
      assert.isUndefined( describedSetting.desc );
    });

    it( "you can't set it to a non-string value", () => {
      [ null, true, 1, {}, [ "there is a string in here" ] ].forEach( val => {
        assert.throws( () => { describedSetting.desc = val; }, /^Illegal argument/ );
      });
    });

    it( "...but you can set it to undefined (not a value)", () => {
      assert.doesNotThrow( () => { describedSetting.desc = undefined; } );  
      describedSetting.desc = undefined;
      assert.isUndefined( describedSetting.desc );
    });

    it( "you can set it to a string value, and get that value back", () => {
      let desc = "The maximum length for the raw JSON document length";
      describedSetting.desc = desc;

      assert.strictEqual( describedSetting.desc, desc );
    });

    it( "you can't set it to the zero-length string", () => {
      assert.throws( () => { describedSetting.desc = ""; }, /^Illegal argument/ );
    });
  });
});

