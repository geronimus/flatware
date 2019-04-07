import { assert } from "chai";
import flatware from "../../src/flatware";
import { specObject } from "../example/spec";

describe( "spec.fromJSON( jsonObj )", () => {

  it( "if you provide a non-JSON Object, it throws an illegal argument", () => {
  
    [ undefined, null, true, 1, "thingy", {}, [], new Date() ].forEach( arg => {
      assert.throws( () => { flatware.spec.fromJSON( arg ) }, /^Illegal argument/ );
    });
  });

  it( "if you provide a malformed JSON object, it throws an illegal argument", () => {
    
    [
      `{`,
      `[]`,
      `{ unquoted: true }`,
      `{ "missingComma": true "realProperty": false }`
    ].forEach( badObj => {
      assert.throws( () => { flatware.spec.fromJSON( badObj ); }, /^Illegal argument/ );  
    });
  });

  it( "if you provide a JSON object that does not specify settings, it throws an illegal argument", () => {
  
    [
      `{ "napkin": "yellow", "placemat": "provençal", "cutlery": { "sets": 4, "style": "french" } }`,
      `{ "storageAdapter": { "type": "writer", "lowerBound": "a", "upperBound": "Z", "ding!": "return" } }`
    ].forEach( badObj => {
      assert.throws( () => { flatware.spec.fromJSON( badObj ); }, /^Illegal argument/ );  
    });
  });

  it( "if you provide a well-formed JSON object, it returns the corresponding spec", () => {
    
    const jsonObj = JSON.stringify( specObject );
    const spec = flatware.spec.fromJSON( jsonObj );

    Object.keys( specObject )
      .forEach( settingName => {
        let setting = spec.settings.get( settingName );
        assert.strictEqual( setting.type, specObject[ settingName ][ "type" ] );
        assert.strictEqual( setting.desc, specObject[ settingName ][ "desc" ] );

        Object.keys( specObject[ settingName ] )
          .filter( key => ![ "type", "desc" ].includes( key ) )
          .forEach( constraintName => {
            assert.deepEqual(
              setting.getConstraint( constraintName ),
              specObject[ settingName ][ constraintName ]
            );
          });
      });
  });
});

