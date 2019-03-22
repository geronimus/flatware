import { assert } from "chai";
import flatware from "../../../../src/flatware";
import { allowedTypes } from "../../../../src/spec/setting";

let spec;
let typeSetting;

describe( "spec.settings.setting", () => {

  describe( ".type", () => {
  
    beforeEach( () => {
      spec = flatware.newSpec();
    });

    it( "you can get the type, as if it were a property", () => {
      
      allowedTypes.forEach( typeVal => {
        typeSetting = spec.settings.define( typeVal + "Setting", typeVal );
        assert.strictEqual( typeSetting.type, typeVal );
      });
    });
  });

  describe( ".redefineType( newType )", () => {
    
    beforeEach( () => {
      spec = flatware.newSpec();
    });

    it( "rejects invalid types", () => {
    
      typeSetting = spec.settings.define( "moveable feast", "string" );
      assert.throws( () => { typeSetting.redefineType(); }, /^Illegal argument/ );

      [ undefined, null, true, 1, {}, [], "bodlian", "decibel", "text" ].forEach( item => {
        assert.throws( () => { typeSetting.redefineType( item ); }, /^Illegal argument/ );  
      });
    });

    it( "allows a change to another allowed type", () => {
      
      let otherTypes;

      allowedTypes.forEach( typeVal => {
        typeSetting = spec.settings.define( typeVal + "Setting", typeVal );
        otherTypes = allowedTypes.filter( val => val !== typeVal );
        
        otherTypes.forEach( other => {
          typeSetting.redefineType( other );
          assert.strictEqual( typeSetting.type, other );
        });
      });
    });

    it( "allows a change to the same type", () => {
    
      allowedTypes.forEach( typeVal => {
        typeSetting = spec.settings.define( typeVal + "Setting", typeVal );
        assert.doesNotThrow( () => { typeSetting.redefineType( typeVal ); } );
      });
    });

    it( "resets its constraints when you change its type", () => {
      
      typeSetting = spec.settings.define( "nameNodes", "number" )
        .setConstraint( "lowerBound", 1 )
        .setConstraint( "upperBound", 6 )
        .setConstraint( "optionsList", [ 1, 2, 3, 4, 5, 6 ] )
        .redefineType( "number" );

      [ "lowerBound", "upperBound", "optionsList" ].forEach( constraint => {
        assert.isUndefined( typeSetting.getConstraint( constraint ) );  
      });

      typeSetting.setConstraint( "lowerBound", 1 )
        .setConstraint( "upperBound", 6 )
        .setConstraint( "optionsList", [ 1, 2, 3, 4, 5, 6 ] )
        .redefineType( "string" );

      [ "lowerBound", "upperBound" ].forEach( constraint => {
        assert.throws( () => { typeSetting.getConstraint( constraint ); }, /^Illegal argument/ );  
      });

      [ "optionsList", "pattern" ].forEach( constraint => {
        assert.isUndefined( typeSetting.getConstraint( constraint ) );  
      });
    });
  });
});

