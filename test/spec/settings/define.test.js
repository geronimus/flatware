import { assert } from "chai";
import flatware from "../../../src/flatware";

let spec;

describe( "settings", () => {

  beforeEach( () => {
    spec = flatware.newSpec();
  });

  describe( ".define( name, type )", () => {
  
    it( "requires a name and a type", () => {
    
      assert.throws( () => { spec.settings.define() }, /^Illegal argument/ );
      assert.doesNotThrow( () => { spec.settings.define( "Georges", "string" ); } );
    });

    it( "the name must be a string", () => {
    
      assert.throws( () => { spec.settings.define( undefined, "undefined" ) }, /^Illegal argument/ );
      assert.throws( () => { spec.settings.define( true, "boolean" ) }, /^Illegal argument/ );
      assert.throws( () => { spec.settings.define( 1, "number" ) }, /^Illegal argument/ );
      assert.throws( () => { spec.settings.define( {}, "object" ) }, /^Illegal argument/ );
    });

    it( "the type must be a string", () => {
    
      assert.throws( () => { spec.settings.define( "undefined", undefined ) }, /^Illegal argument/ );
      assert.throws( () => { spec.settings.define( "true", true ) }, /^Illegal argument/ );
      assert.throws( () => { spec.settings.define( "1", 1 ) }, /^Illegal argument/ );
      assert.throws( () => { spec.settings.define( "{}", {} ) }, /^Illegal argument/ );
    });

    it( `the type must be one of: [ "boolean", "number", "string", "Date" ]`, () => {
      
      [
        "bodlian",
        "int",
        "decibel",
        "text",
        "date"
      ].forEach( item => {
        assert.throws(
          () => { spec.settings.define( "my name", item ); },
          /^Illegal argument/
        );
      });

      [
        "boolean",
        "number",
        "string",
        "Date"
      ].forEach( item => {
        assert.doesNotThrow( () => { spec.settings.define( item, item ); } );
      });
    });

    it( "if you call define twice with the same name, it replaces the first setting", () => {
      
      const defOnce = spec.settings.define( "thing", "string" );
      const defTwice = spec.settings.define( "thing", "number" );

      assert.notStrictEqual( spec.settings.defs.get( "thing" ), defOnce );
      assert.strictEqual( spec.settings.defs.get( "thing" ), defTwice );

      const identicalRedef = spec.settings.define( "thing", "number" );

      assert.deepEqual( spec.settings.defs.get( "thing" ), defTwice );
      assert.notStrictEqual( spec.settings.defs.get( "thing" ), defTwice );
      assert.strictEqual( spec.settings.defs.get( "thing" ), identicalRedef );
    });
  });
});

