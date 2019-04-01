import { assert } from "chai";
import flatware from "../../../src/flatware";

let conf;

describe( "conf.values", () => {

  describe( ".set( name, value )", () => {
    
    beforeEach( () => {
      conf = flatware.newConf();  
    });

    it( "rejects illegal names", () => {
    
      [
        undefined, null, true, 1, {}, [], " ", "   ", "name\nwith\r\nline\nbreaks"
      ].forEach( badName => {
        assert.throws(
          () => { conf.values.set( badName, undefined ); },
          /^Illegal argument/
        );
      });
    });

    it( "rejects illegal values", () => {
    
      [
        {}, [], /pattern/, new SyntaxError(), Math
      ].forEach( badValue => {
        assert.throws(
          () => { conf.values.set( "bad value", badValue ); },
          /^Illegal argument/
        );
      });
    });

    it( "accepts legal values", () => {
    
      [
        undefined, false, 0, "I am text", new Date()
      ].forEach( goodValue => {
        assert.doesNotThrow( () => { conf.values.set( "good value", goodValue ); } );
      });
    });

    it( "setting a value to undefined is the same thing as removing it", () => {
    
      conf.values.set( "vanishingValue", true );
      assert.deepEqual( conf.values.list(), { vanishingValue: true } );

      conf.values.set( "vanishingValue", undefined );
      assert.deepEqual( conf.values.list(), {} );
    });
  });
});

