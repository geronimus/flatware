import { assert } from "chai";
import flatware from "../../src/flatware";
import { reviveJSONDates } from "../../src/util/value";
import { constraintsByType } from "../../src/spec/structure";
import { specObject } from "../example/spec";

describe( "spec", () => {

  describe( "fromTemplate( template )", () => {
  
    it( "rejects non-string arguments", () => {
      
      [
        undefined, null, true, 1, {}, [], new Date()
      ].forEach( badTemplate => {
        assert.throws(
          () => { flatware.spec.fromTemplate( badTemplate ); },
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
          () => { flatware.spec.fromTemplate( badJSON ); },
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
          () => { flatware.spec.fromTemplate( badTemplate ); },
          /^Illegal argument/
        );  
      });
    });

    it( "creates a valid spec, given a valid template", () => {
      
      const templateObj = JSON.parse(
        flatware.spec.fromObject( specObject ).getTemplate(),
        reviveJSONDates
      );
      const templateJSON = JSON.stringify( templateObj, null, 2 );
      const spec = flatware.spec.fromTemplate( templateJSON );
      const expectedSettings = Object.keys( templateObj );
      expectedSettings.sort();

      assert.deepEqual( spec.settings.list(), expectedSettings );

      expectedSettings.forEach( setting => {
        assert.strictEqual(
          spec.settings.get( setting ).type,
          templateObj[ setting ].type
        );

        assert.strictEqual(
          spec.settings.get( setting ).desc,
          templateObj[ setting ].desc
        );

        Object.keys( templateObj[ setting ] )
          .filter(
            property => constraintsByType[ templateObj[ setting ].type ]
              .includes( property )
          )
          .forEach( constraint => {
            deepStrictEqual(
              spec.settings.get( setting ).getConstraint( constraint ),
              templateObj[ setting ][ constraint ]
            );
          });

        function deepStrictEqual( actual, expected ) {
          if ( Array.isArray( expected ) )
            Object.keys( expected ).forEach( index => {
              valueEqual( actual[ index ], expected[ index ] );  
            });
          else
            valueEqual( actual, expected );

          function valueEqual( actual, expected ) {
            if ( expected instanceof Date )
              assert.strictEqual( actual.toISOString(), expected.toISOString() );
            else
              assert.strictEqual( actual, expected );
          }
        } 
      });
    });
  });
});

