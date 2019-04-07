import { assert } from "chai";
import flatware from "../../src/flatware";

const exampleConfObj = {
  storageAdaptor: "rdbmsStorage",
  hasServer: true,
  serverNodes: 6,
  beginningOfTime: new Date( "1970-01-01T00:00:00.0Z" )
};

describe( "flatware", () => {

  describe( ".conf.fromObject( obj )", () => {
  
    it( "rejects non-objects", () => {
      
      [
        undefined, null, true, 1, "thingy", new Date(), []
      ].forEach( badObj => {
        assert.throws(
          () => { flatware.conf.fromObject( badObj ); },
          /^Illegal argument/
        );
      });
    });

    it( "rejects object with illegal values", () => {
      
      [
        { "array": [] },
        { "embeddedObject": {} }
      ].forEach( badObj => {
        assert.throws(
          () => { flatware.conf.fromObject( badObj ); },
          /^Illegal argument/
        );
      });
    });

    it( "null values are allowed, but they don't appear as conf values", () => {
      
      assert.deepEqual(
        flatware.conf.fromObject({
          hasServerInstance: undefined,
          storageAdaptor: null,
          processTarget: undefined,
          dateMax: null
        }).values.list(),
        {}
      );
      
      assert.deepEqual(
        flatware.conf.fromObject({
          hasServerInstance: true,
          storageAdaptor: undefined,
          processTarget: 6,
          dateMax: null
        }).values.list(),
        { hasServerInstance: true, processTarget: 6 }
      );
    });

    it( "can create a conf from an object literal", () => {
    
      const conf = flatware.conf.fromObject( exampleConfObj );

      Object.keys( exampleConfObj ).forEach( key => {
        if ( exampleConfObj[ key ] instanceof Date )
          assert.strictEqual(
            conf.values.get( key ).toISOString(),
            exampleConfObj[ key ].toISOString()
          );
        else
          assert.strictEqual( conf.values.get( key ), exampleConfObj[ key ] );  
      });
    });
  });
});

export { exampleConfObj };

