import { assert } from "chai";
import flatware from "../../../src/flatware";

let conf;

describe( "conf.values", () => {

  beforeEach( () => { conf = flatware.conf.new(); });

  describe( ".get( name )", () => {
  
    it( "rejects invalid names", () => {
    
      [
        undefined, null, true, 1, {}, [], new Date()
      ].forEach( badName => {
        assert.throws(
          () => { conf.values.get( badName ); },
          /^Illegal argument/
        );  
      });
    });

    it( "you cannot get a value that you haven't previously set", () => {
      
      assert.strictEqual( conf.values.get( "foo" ), undefined );
    });

    it( "you can get back a value that you have previously set", () => {
      
      const settingName = "storageAdaptor";
      const settingVal = "memoryStorage";
      conf.values.set( settingName, settingVal );

      assert.strictEqual( conf.values.get( settingName ), settingVal );
    });
  });
});

