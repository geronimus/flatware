import { assert } from "chai";
import flatware from "../../src/flatware";

describe( ".specFromObject( obj )", () => {

  it( "throws an illegal argument for non-object values", () => {
    [ undefined, null, true, 1, "val", [] ].forEach( val => {
      assert.throws( () => { flatware.specFromObject( val ); }, /^Illegal argument/ );
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
      () => { flatware.specFromObject( reallyNonConformant ); },
      /^Illegal argument/
    );

    const minimallyNonConformant = {
      "rock 'n' roll": { desc: "don't try to encapsulate me!" },
      "cores": { optionsList: [ 1, 2, 3, 4, 5, 6 ] }
    };
    assert.throws(
      () => { flatware.specFromObject( minimallyNonConformant ); },
      /^Illegal argument/
    );
  });

  it( "returns a complete spec for a conformant object", () => {
    const obj = {
      storageAdaptor: {
        type: "string",
        desc: "The name of the class to use for data storage",
        optionsList: [ "memoryStorage", "fileSystemStorage" ]
      },
      processTarget: {
        type: "number",
        desc: "The target number of processes for the system to maintain under auto-scaling",
        lowerBound: 1,
        upperBound: 6,
        optionsList: [ 1, 2, 3, 4, 5, 6 ]
      },
      clientOnly: {
        type: "boolean",
        desc: "Indicates whether this is a detached client instance"
      },
      dateMax: {
        type: "Date",
        //desc: "The date value used to represent an as-yet-unknown date in the future",
        optionsList: [ new Date( 2147483647000 ), new Date( "9999-12-31T23:59:59.999" ) ]
      }
    }

    const spec = flatware.specFromObject( obj );

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

