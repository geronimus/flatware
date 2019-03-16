import { assert } from "chai";
import flatware from "../../src/flatware";

let conf;

describe( "settings", () => {

  beforeEach( () => {
    conf = flatware.newConfig();
  });

  describe( ".define( name, type )", () => {
  
    it( "requires a name and a type", () => {
    
      assert.throws( () => { conf.settings.define() }, /^Illegal argument/ );
      assert.doesNotThrow( () => { conf.settings.define( "Georges", "string" ); } );
    });

    it( "the name must be a string", () => {
    
      assert.throws( () => { conf.settings.define( undefined, "undefined" ) }, /^Illegal argument/ );
      assert.throws( () => { conf.settings.define( true, "boolean" ) }, /^Illegal argument/ );
      assert.throws( () => { conf.settings.define( 1, "number" ) }, /^Illegal argument/ );
      assert.throws( () => { conf.settings.define( {}, "object" ) }, /^Illegal argument/ );
    });

    it( "the name must be unique", () => {
      
      assert.throws(
        () => {
          conf.settings.define( "Georges", "boolean" );  
          conf.settings.define( "Georges", "number" );  
        },
        /^Illegal operation/
      );
    });

    it( "the type must be a string", () => {
    
      assert.throws( () => { conf.settings.define( "undefined", undefined ) }, /^Illegal argument/ );
      assert.throws( () => { conf.settings.define( "true", true ) }, /^Illegal argument/ );
      assert.throws( () => { conf.settings.define( "1", 1 ) }, /^Illegal argument/ );
      assert.throws( () => { conf.settings.define( "{}", {} ) }, /^Illegal argument/ );
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
          () => { conf.settings.define( "my name", item ); },
          /^Illegal argument/
        );
      });

      [
        "boolean",
        "number",
        "string",
        "Date"
      ].forEach( item => {
        assert.doesNotThrow( () => { conf.settings.define( item, item ); } );
      });
    });
  });
});

