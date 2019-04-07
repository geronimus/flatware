import { assert } from "chai";
import flatware from "../../src/flatware";
import { specObject } from "../example/spec";

describe( ".spec.fromObject( obj )", () => {

  it( "throws an illegal argument for non-object values", () => {
    [ undefined, null, true, 1, "val", [] ].forEach( val => {
      assert.throws( () => { flatware.spec.fromObject( val ); }, /^Illegal argument/ );
    });
  });

  it( "throws an illegal argument for non-conformant objects", () => {
    const reallyNonConformant = {
      foo: "bar",
      baz: {
        qux: true
      }
    };
    assert.throws(
      () => { flatware.spec.fromObject( reallyNonConformant ); },
      /^Illegal argument/
    );

    const minimallyNonConformant = {
      "rock 'n' roll": { desc: "don't try to encapsulate me!" },
      "cores": { optionsList: [ 1, 2, 3, 4, 5, 6 ] }
    };
    assert.throws(
      () => { flatware.spec.fromObject( minimallyNonConformant ); },
      /^Illegal argument/
    );
  });

  it( "returns a complete spec for a conformant object", () => {

    const obj = specObject;
    const spec = flatware.spec.fromObject( obj );

    Object.keys( obj )
      .forEach( settingName => {
        let setting = spec.settings.get( settingName );
        assert.strictEqual( setting.type, obj[ settingName ][ "type" ] );
        assert.strictEqual( setting.desc, obj[ settingName ][ "desc" ] );

        Object.keys( obj[ settingName ] )
          .filter( key => ![ "type", "desc" ].includes( key ) )
          .forEach( constraintName => {
            assert.strictEqual(
              setting.getConstraint( constraintName ),
              obj[ settingName ][ constraintName ]
            );
          });
      });
  });
});

