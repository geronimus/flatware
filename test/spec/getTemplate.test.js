import { assert } from "chai";
import flatware from "../../src/flatware";
import { specObject } from "../example/spec";

describe( "spec", () => {
  
  describe( ".getTemplate()", () => {
    
    it( "given an empty spec, you get an empty JSON object string", () => {
    
      const spec = flatware.spec.new();
      assert.strictEqual( spec.getTemplate(), "{}" );
    });

    it( "given a fulsome spec, it produces JSON string containing the name, " +
      "mapped to an object containing the type and desc, " +
      "and a placeholder for the value", () => {
    
      const spec = flatware.spec.fromObject( specObject );
      const templateObj = {};

      Object.keys( specObject ).forEach( key => {
        const itemTemplate = specObject[ key ];
        itemTemplate.value = null;
        templateObj[ key ] = itemTemplate;
      });

      const templateJSON = JSON.stringify( templateObj, null, 2 );

      assert.strictEqual( spec.getTemplate(), templateJSON );
    });
  });
});

