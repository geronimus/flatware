import { assert } from "chai";
import flatware from "../../src/flatware";
import { specObject } from "../example/spec";

describe( "conf", () => {
  
  describe( ".fromTemplate( template )", () => {
    
    it( "rejects non-string arguments", () => {
      
      [
        undefined, null, true, 1, {}, [], new Date()
      ].forEach( badTemplate => {
        assert.throws(
          () => { flatware.conf.fromTemplate( badTemplate ); },
          /^Illegal argument.*A well-formed JSON string/s
        );
      });
    });

    it( "rejects malformed JSON", () => {
    
      [
        "",
        "bad JSON",
        `{ error: "non-quoted name" }`,
        `{ "error": "no comma" "side of fries?": "no thanks" }`
      ].forEach( badJSON => {
        assert.throws(
          () => { flatware.conf.fromTemplate( badJSON ); },
          /^Illegal argument.*A well-formed JSON string/s
        );  
      });
    });

    it( "rejects well-formed JSON that does not have the form of a spec template", () => {
    
      [
        `{ "any ol' object": true }`,
        `{ "almost there": { "value": "missing a type" } }`,
        `{ "no cigar": { "type": "missing a value - and invalid type" } }`,
        `{ "works except for invalid type": { "type": "tinyint", "value": 1 } }`
      ].forEach( badTemplate => {
        assert.throws(
          () => { flatware.conf.fromTemplate( badTemplate ); },
          /^Illegal argument/
        );  
      });
    });

    it( "converts any values left null to undefined (eg, non-existent) values", () => {
      
      const template = flatware.spec.fromObject( specObject )
        .getTemplate();
      const nothingSet = flatware.conf.fromTemplate( template );
      assert.deepEqual( nothingSet.values.list(), {} );
    });
  });
});

