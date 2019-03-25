import { assert } from "chai";
import flatware from "../../src/flatware";

let spec;

describe( "spec", () => {

  beforeEach( () => {
    spec = flatware.newSpec();  
  });

  describe( ".asObject()", () => {
  
    it( "when the spec has no setting, it returns an empty object", () => {
      assert.deepEqual( spec.asObject(), {} );
    });

    it( "returns a representation including each defined setting", () => {
      const specRepresentation = {
        "are these the droids you're looking for": { type: "boolean" },
        nodeTarget: {
          type: "number",
          desc: "the number of nodes that should be running concurrently",
          lowerBound: 1,
          upperBound: 6,
          optionsList: [ 1, 2, 3, 4, 5, 6 ]
        },
        storageAdaptor: {
          type: "string",
          desc: "the name of the storage class to use at runtime",
          optionsList: [ "memoryStorage", "fsStorage", "postgreSQLStorage" ]
        },
        conventionalEndOfTime: {
          type: "Date",
          desc: "the value to use to represent an unset date",
          optionsList: [
            // Paul McGann end of time
            new Date( "1999-12-31T23:59:59.999-800" ),
            // Unix 32-bit end of time
            new Date( 2147483647999 ),
            // Lazy standard end of time
            new Date( "9999-12-31T23:59:59.999" )
          ]
        }
      };

      Object.keys( specRepresentation ).forEach( setting => {
        let def = spec.settings.define(
          setting,
          specRepresentation[ setting ][ "type" ]
        );
        def.desc = specRepresentation[ setting ][ "desc" ];

        Object.keys( specRepresentation[ setting ] )
          .filter( prop => ( prop !== "type" ) && ( prop !== "desc" ) )
          .forEach( prop => {
            def.setConstraint( prop, specRepresentation[ setting ][ prop ] );
          });
      });

      assert.deepEqual( spec.asObject(), specRepresentation );
    });
  });
});

