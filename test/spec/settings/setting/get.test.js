import { assert } from "chai";
import flatware from "../../../../src/flatware";
import { allowedConstraints } from "../../../../src/spec/setting";

let spec;

describe( "spec.settings.setting", () => {

  describe( ".getConstraint( constraint )", () => {
    
    beforeEach( () => {
      spec = flatware.newSpec();
    });

    it( "throws an illegal argument exception when the property argument is invalid", () => {
    
      const settingDef = spec.settings.define( "storageAdapter", "string" );

      assert.throws( () => { settingDef.getConstraint(); }, /^Illegal argument/ );

      [
        "foo", "bar", "baz", null, true, 1, new Date()
      ].forEach( item => {
        assert.throws( () => { settingDef.getConstraint( item ); }, /^Illegal argument/ );  
      });
    });

    it( "returns undefined when the property is valid, but has not yet been defined", () => {
    
      const types = Object.keys( allowedConstraints );

      types.forEach( type => {
        const settingDef = spec.settings.define( "typeExample", type );

        allowedConstraints[ type ].forEach( allowedProperty => {
          assert.strictEqual( settingDef.getConstraint( allowedProperty ), undefined );  
        });  
      });
    });

    it( "returns the value to which it was previously set", () => {
    
      const typeSetting = spec.settings.define( "nameNodes", "number" )
        .setConstraint( "lowerBound", 1 )
        .setConstraint( "upperBound", 6 )
        .setConstraint( "optionsList", [ 1, 2, 3, 4, 5, 6 ] )
      

      assert.strictEqual( typeSetting.getConstraint( "lowerBound" ), 1 );
      assert.strictEqual( typeSetting.getConstraint( "upperBound" ), 6 );
      assert.deepEqual( typeSetting.getConstraint( "optionsList" ), [ 1, 2, 3, 4, 5, 6 ] );
    });
  });
});

