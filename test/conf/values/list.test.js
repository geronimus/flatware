import { assert } from "chai";
import flatware from "../../../src/flatware";
import { exampleConfObj } from "../fromObject.test";

let conf;

describe( "conf.values", () => {

  describe( ".list()", () => {
    
    beforeEach( () => { conf = flatware.conf.new(); } );

    it( "if no values are set, it returns an empty map (object)", () => {
      assert.deepEqual( conf.values.list(), {} );
    });

    it( "returns a sorted list of values you have previously set", () => {
    
      const vals = exampleConfObj;
      const sortedKeys = Object.keys( vals ).sort();

      Object.keys( vals )
        .forEach( item => {
          conf.values.set( item, vals[ item ] );
        });

      assert.deepEqual( Object.keys( conf.values.list() ), sortedKeys );
      assert.deepEqual( conf.values.list(), vals );
    });

    it( "does not return its private state", () => {
    
      conf.values.set( "hasServer", true );
      const settingMap = conf.values.list();
      settingMap[ "hasServer" ] = false;

      assert.strictEqual( conf.values.get( "hasServer" ), true );
    });
  });
});

