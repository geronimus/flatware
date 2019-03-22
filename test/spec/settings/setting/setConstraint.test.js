import { assert } from "chai";
import flatware from "../../../../src/flatware";
import { allowedConstraints } from "../../../../src/spec/setting";

let spec;

describe( "spec.settings.setting", () => {
  
  describe( ".setConstraint( constraint, value )", () => {
    
    beforeEach( () => {
      spec = flatware.newSpec();
    });

    it( "throws an illegal argument exception when the property argument is invalid", () => {
    
      const settingDef = spec.settings.define( "storageAdapter", "string" );

      assert.throws( () => { settingDef.setConstraint(); }, /^Illegal argument/ );

      [
        "foo", "bar", "baz", null, true, 1, new Date()
      ].forEach( item => {
        assert.throws( () => { settingDef.setConstraint( item, undefined ); }, /^Illegal argument/ );  
      });
    });

    it( "allows any valid property to be set to undefined, after which it is undefined", () => {
    
      const types = Object.keys( allowedConstraints );

      types.forEach( type => {
        const settingDef = spec.settings.define( "typeExample", type );

        allowedConstraints[ type ].forEach( allowedProperty => {
          assert.doesNotThrow( () => { settingDef.setConstraint( allowedProperty, undefined ); } );  
          assert.strictEqual( settingDef.getConstraint( allowedProperty ), undefined );
        });  
      });
    });

    it( "for number settings, upperBound and lowerBound can only be set to numbers, where upperBound is larger than lowerBound", () => {

      const lowBoundNumber = spec.settings.define( "lowBoundDef", "number" );
      testBadValueTypes( lowBoundNumber, "lowerBound" );

      const upperBoundNumber = spec.settings.define( "upperBoundDef", "number" );
      testBadValueTypes( upperBoundNumber, "upperBound" );

      lowBoundNumber.setConstraint( "lowerBound", 0 );
      [ 0, 1, 3.141592654, Number.MAX_SAFE_INTEGER ].forEach( goodUpperVal => {
        assert.doesNotThrow( () => { lowBoundNumber.setConstraint( "upperBound", goodUpperVal ); } );
      });
      [ -1, -3.141592654, Number.MIN_SAFE_INTEGER ].forEach( badUpperVal => {
        assert.throws( () => { lowBoundNumber.setConstraint( "upperBound", badUpperVal ); }, /^Illegal operation/ );
      });

      upperBoundNumber.setConstraint( "upperBound", 0 );
      [ 0, -1, -3.141592654, Number.MIN_SAFE_INTEGER ].forEach( goodLowerVal => {
        assert.doesNotThrow( () => { upperBoundNumber.setConstraint( "lowerBound", goodLowerVal ); } );
      });
      [ 1, 3.141592654, Number.MAX_SAFE_INTEGER ].forEach( badLowerVal => {
        assert.throws( () => { upperBoundNumber.setConstraint( "lowerBound", badLowerVal ); }, /^Illegal operation/ );
      });

      function testBadValueTypes( numberConstraint, property ) {
        [ true, "1", new Date( "1970-01-01T00:00:01Z" ) ].forEach( val => {
          assert.throws( () => { numberConstraint.setConstraint( property, val ); }, /^Illegal argument/ );
        });
      }
    });

    it( "for Date settings, upperBound and lowerBound can only be set to Dates, where upperBound is larger than lowerBound", () => {

      const lowBoundDate = spec.settings.define( "lowBoundDef", "Date" );
      testBadValueTypes( lowBoundDate, "lowerBound" );

      const upperBoundDate = spec.settings.define( "upperBoundDef", "Date" );
      testBadValueTypes( upperBoundDate, "upperBound" );

      lowBoundDate.setConstraint( "lowerBound", new Date() );
      assert.doesNotThrow( () => { lowBoundDate.setConstraint( "upperBound", new Date( "9999-12-31T23:59:59.999Z" ) ); } );
      assert.throws( () => { lowBoundDate.setConstraint( "upperBound", new Date( "1970-01-01T00:00:00.0Z" ) ); }, /^Illegal operation/ );

      upperBoundDate.setConstraint( "upperBound", new Date() );
      assert.doesNotThrow( () => { upperBoundDate.setConstraint( "lowerBound", new Date( "1970-01-01T00:00:00.0Z" ) ); } );
      assert.throws( () => { upperBoundDate.setConstraint( "lowerBound", new Date( "9999-12-31T23:59:59.999Z" ) ); }, /^Illegal operation/ );

      function testBadValueTypes( dateConstraint, property ) {
        [ true, "1", 1 ].forEach( val => {
          assert.throws( () => { dateConstraint.setConstraint( property, val ); }, /^Illegal argument/ );
        });
      }
    });

    it( "options lists must conform to previously-defined bounds", () => {

      const lowBoundNumber = spec.settings.define( "lowFirst", "number" ).setConstraint( "lowerBound", 1 );
      const highBoundNumber = spec.settings.define( "highFirst", "number" ).setConstraint( "upperBound", 5 );
      const doubleBoundNumber = spec.settings.define( "both", "number" )
        .setConstraint( "lowerBound", 1 )
        .setConstraint( "upperBound", 5 );

      assert.throws( () => { lowBoundNumber.setConstraint( "optionsList", [ 0, 1, 2, 3, 4 ] ); }, /^Illegal operation/ );
      assert.doesNotThrow( () => { lowBoundNumber.setConstraint( "optionsList", [ 1, 2, 3, 4, 5 ] ); } );

      assert.throws( () => { highBoundNumber.setConstraint( "optionsList", [ 2, 3, 4, 5, 6 ] ); }, /^Illegal operation/ );
      assert.doesNotThrow( () => { highBoundNumber.setConstraint( "optionsList", [ 1, 2, 3, 4, 5 ] ); } );

      assert.throws( () => { doubleBoundNumber.setConstraint( "optionsList", [ 0, 1, 2, 3, 4, 5, 6 ] ); }, /^Illegal operation/ );
      assert.doesNotThrow( () => { doubleBoundNumber.setConstraint( "optionsList", [ 1, 2, 3, 4, 5 ] ); } );
      
      const lowBoundDate = spec.settings.define( "lowDateFirst", "Date" )
        .setConstraint( "lowerBound", new Date( "1962-10-05T00:00:00.0Z" ) );
      const highBoundDate = spec.settings.define( "highDateFirst", "Date" )
        .setConstraint( "upperBound", new Date( "1971-12-30T00:00:00.0Z" ) );
      const doubleBoundDate = spec.settings.define( "bothDates", "Date" )
        .setConstraint( "lowerBound", new Date( "1962-10-05T00:00:00.0Z" ) )
        .setConstraint( "upperBound", new Date( "1971-12-30T00:00:00.0Z" ) );

      assert.throws( () => { lowBoundDate.setConstraint(
        "optionsList",
        [ new Date( "1954-10-21" ), new Date( "1962-10-05" ), new Date( "1971-12-30" ) ]
      ); }, /^Illegal operation/ );
      assert.doesNotThrow( () => { lowBoundDate.setConstraint(
        "optionsList",
        [ new Date( "1962-10-05" ), new Date( "1967-06-13" ), new Date( "1971-12-30" ) ]
      ); } );

      assert.throws( () => { highBoundDate.setConstraint(
        "optionsList",
        [ new Date( "1967-06-13" ), new Date( "1971-12-30" ), new Date( "1973-07-06" ) ]
      ); }, /^Illegal operation/ );
      assert.doesNotThrow( () => { highBoundDate.setConstraint(
        "optionsList",
        [ new Date( "1962-10-05" ), new Date( "1967-06-13" ), new Date( "1971-12-30" ) ]
      ); } );

      assert.throws( () => { doubleBoundDate.setConstraint(
        "optionsList",
        [ new Date( "1954-10-21" ), new Date( "1967-06-13" ), new Date( "1971-12-30" ), new Date( "1973-07-06" ) ]
      ); }, /^Illegal operation/ );
      assert.doesNotThrow( () => { doubleBoundDate.setConstraint(
        "optionsList",
        [ new Date( "1962-10-05" ), new Date( "1967-06-13" ), new Date( "1971-12-30" ) ]
      ); } );
    });

    it( "you can only set a pattern to a RegExp value", () => {
      
      const stringSetting = spec.settings.define( "pattern-constrained", "string" );

      [ true, 1, "simple-string", new Date() ].forEach( item => {
        assert.throws( () => { stringSetting.setConstraint( "pattern", item ); }, /^Illegal argument/ );
      });

      [ /^[ -~]+$/, new RegExp( "\\w+" ) ].forEach( item => {
        assert.doesNotThrow( () => { stringSetting.setConstraint( "pattern", item ); } );
      });
    });
  });
});

