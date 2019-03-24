import { assert } from "chai";
import flatware from "../../../../src/flatware";

let spec;

describe( "spec.settings.setting", () => {
  
  describe( ".asObject()", () => {

    beforeEach( () => {
      spec = flatware.newSpec();  
    });
    
    it( "for a newly-initialized setting spec, it returns only the type", () => {
      let boolSetting = spec.settings.define( "boolenSetting", "boolean" );
      assert.deepEqual( boolSetting.asObject(), { type: "boolean" } );

      let numSetting = spec.settings.define( "numberSetting", "number" );
      assert.deepEqual( numSetting.asObject(), { type: "number" } );
    });

    it( "if you specify a description or constraints, only specified properties are included", () => {
      let descSetting = spec.settings.define( "storageAdapter", "string" );
      descSetting.desc = "Identifies the storage mechanism";
      assert.deepEqual( descSetting.asObject(), { type: "string", desc: "Identifies the storage mechanism" } );

      let numSetting = spec.settings.define( "kevlin henney's singleton", "number" )
        .setConstraint( "lowerBound", 1 )
        .setConstraint( "upperBound", 1 )
        .setConstraint( "optionsList", [ 1 ] );
      numSetting.desc = "there can be only one";
      assert.deepEqual(
        numSetting.asObject(),
        {
          "type": "number",
          "desc": "there can be only one",
          "lowerBound": 1,
          "optionsList": [ 1 ],
          "upperBound": 1
        }
      );

      numSetting.setConstraint( "lowerBound", undefined )
        .setConstraint( "optionsList", undefined );
      assert.deepEqual(
        numSetting.asObject(),
        { type: "number", desc: "there can be only one", upperBound: 1 }
      );
    });
  });
});

