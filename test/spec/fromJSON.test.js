import { assert } from "chai";
import flatware from "../../src/flatware";
import { specObjExample } from "./fromObject.test";

describe( "specFromJSON( jsonObj )", () => {

  it( "if you provide a non-JSON Object, it throws an illegal argument", () => {
  
    [ undefined, null, true, 1, "thingy", {}, [], new Date() ].forEach( arg => {
      assert.throws( () => { flatware.specFromJSON( arg ) }, /^Illegal argument/ );
    });
  });

  it( "if you provide a malformed JSON object, it throws an illegal argument", () => {
    
    [
      `{`,
      `[]`,
      `{ unquoted: true }`,
      `{ "missingComma": true "realProperty": false }`
    ].forEach( badObj => {
      assert.throws( () => { flatware.specFromJSON( badObj ); }, /^Illegal argument/ );  
    });
  });

  it( "if you provide a JSON object that does not specify settings, it throws an illegal argument", () => {
  
    [
      `{ "napkin": "yellow", "placemat": "provençal", "cutlery": { "sets": 4, "style": "french" } }`,
      `{ "storageAdapter": { "type": "writer", "lowerBound": "a", "upperBound": "Z", "ding!": "return" } }`
    ].forEach( badObj => {
      assert.throws( () => { flatware.specFromJSON( badObj ); }, /^Illegal argument/ );  
    });
  });

  it( "if you provide a well-formed JSON object, it returns the corresponding spec", () => {
    
    const jsonObj = JSON.stringify( specObjExample );
    const spec = flatware.specFromJSON( jsonObj );

    Object.keys( specObjExample )
      .forEach( settingName => {
        let setting = spec.settings.get( settingName );
        assert.strictEqual( setting.type, specObjExample[ settingName ][ "type" ] );
        assert.strictEqual( setting.desc, specObjExample[ settingName ][ "desc" ] );

        Object.keys( specObjExample[ settingName ] )
          .filter( key => ![ "type", "desc" ].includes( key ) )
          .forEach( constraintName => {
            assert.deepEqual(
              setting.getConstraint( constraintName ),
              specObjExample[ settingName ][ constraintName ]
            );
          });
      });
  });
});

