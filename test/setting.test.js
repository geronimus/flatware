import { assert } from "chai";
import flatware from "../src/flatware";

let conf;

describe( "setting", () => {

  beforeEach( () => {
    conf = flatware.newConfig();
  });

  describe( ".create( name, type )", () => {
  
    it( "requires a name and a type", () => {
    
      assert.throws( () => { conf.settings.create() }, /^Illegal argument/ );
      assert.doesNotThrow( () => { conf.settings.create( "Georges", "brune typée" ); } );
    });

    it( "the name must be unique", () => {
      
      assert.throws(
        () => {
          conf.settings.create( "Georges", "brune typée" );  
          conf.settings.create( "Georges", "mendiante rousse" );  
        },
        /^Illegal operation/
      );
    });
  });
});

