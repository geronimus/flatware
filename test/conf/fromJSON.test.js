import { assert } from "chai";
import flatware from "../../src/flatware";
import { exampleConfObj } from "./fromObject.test";

describe( "flatware", () => {

  describe( ".conf.fromJSON( jsonText )", () => {
  
    it( "rejects non-strings", () => {
    
      [
        undefined, null, true, 1, new Date(), {}, []
      ].forEach( badText => {
        assert.throws(
          () => { flatware.conf.fromJSON( badText ); },
          /^Illegal argument/
        );
      });
    });

    it( "rejects malformed JSON", () => {
      
      [
        "",
        "{",
        "{ noQuotes: true }",
        `{ "noComma": true "secondProp": false }`
      ].forEach( badJSON => {
        () => { flatware.conf.fromJSON( badJSON ); },
        /^Illegal argument/
      });
    });

    it( "given a valid JSON object, it creates a conf", () => {
    
      const jsonText = JSON.stringify( exampleConfObj );
      const conf = flatware.conf.fromJSON( jsonText );

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

