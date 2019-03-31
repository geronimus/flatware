import { assert } from "chai";
import flatware from "../../../src/flatware";

let conf;

describe( "conf.values", () => {
  
  describe( ".remove( name )", () => {
  
    beforeEach( () => { conf = flatware.newConf(); } );

    it( "rejects invalid names", () => {
      
      [
        undefined, null, true, 1, new Date(), " ", "   ", "name\nwith\r\nline\nbreaks"
      ].forEach( badName => {
        assert.throws(
          () => { conf.values.remove( badName ); },
          /^Illegal argument/
        );
      });
    });

    it( "you can't remove a value that isn't there", () => {

      assert.throws(
        () => { conf.values.remove( "foo" ); },
        /^Illegal operation/
      );
    });

    it( "when you remove a value, it is gone", () => {
      
      conf.values.set( "foo", "bar" );
      conf.values.remove( "foo" );

      assert.deepEqual( conf.values.list(), {} );
    });
  });
});

