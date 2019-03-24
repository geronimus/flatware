import { assert } from "chai";
import flatware from "../../../src/flatware";

let spec;

describe( "spec.settings", () => {

  describe( ".fromObject( name, obj )", () => {
  
    beforeEach( () => {
      spec = flatware.newSpec();  
    });

    it( "does not allow invalid names", () => {
      [
        undefined, null, true, 1, {}, [],
        "", " ", "   ", "\n", "name\nwith\r\nline\nbreaks"
      ].forEach( badName => {
        assert.throws(
          () => { spec.settings.fromObject( badName, { type: "string" } ); },
          /^Illegal argument/
        );
      });
    });

    it( "does not allow objects without the required properties", () => {
      [
        undefined, null, true, 1, [],
        { foo: "bar", baz: "qux" },
        { level1: { level2: { level3: { "type": "string" } } } }
      ].forEach( badInit => {
        assert.throws(
          () => { spec.settings.fromObject( "it's bad, innit?", badInit ); },
          /^Illegal argument/
        );  
      });  
    });

    it( "constructs a well-formed setting, when you give it the required and valid properties", () => {
      const simpleSettingInit = { type: "boolean" };
      const simpleSetting = spec.settings.fromObject( "simples!", simpleSettingInit );
      assert.strictEqual( simpleSetting.name, "simples!" );
      assert.strictEqual( simpleSetting.type, "boolean" );
      
      const fulsomeSettingInit = {
        type: "number",
        desc: "can only be set to 1",
        lowerBound: 1,
        upperBound: 1,
        optionsList: [ 1 ]
      };
      const fulsomeSetting = spec.settings.fromObject( "kevlin henney's singleton", fulsomeSettingInit );
      assert.strictEqual( fulsomeSetting.name, "kevlin henney's singleton" );
      assert.strictEqual( fulsomeSetting.type, "number" );
      assert.strictEqual( fulsomeSetting.desc, "can only be set to 1" );

      Object.keys( fulsomeSettingInit )
        .filter( item => ( item !== "type" ) && ( item !== "desc" ) )
        .forEach( constraint => {
          assert.strictEqual(
            fulsomeSetting.getConstraint( constraint ),
            fulsomeSettingInit[ constraint ] );
        });

      const degenerateInit = Object.keys( fulsomeSettingInit )
        .filter( item => ( item === "type" ) || ( item === "upperBound" ) )
        .reduce(
          ( acc, cur ) => {
            acc[ cur ] = fulsomeSettingInit[ cur ];
            return acc;
          },
          {}
        );
      const degenerateSetting = spec.settings.fromObject( "dimensions of thinking", degenerateInit );
      assert.deepEqual( degenerateSetting.asObject(), degenerateInit );
    });
  });
});

