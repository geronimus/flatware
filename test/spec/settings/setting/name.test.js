import { assert } from "chai";
import flatware from "../../../../src/flatware";

let spec;

describe( "spec.settings.setting", () => {

  describe( ".name", () => {

    beforeEach( () => {
      spec = flatware.spec.new();
    });
  
    it( "acts like a property", () => {
    
      const myName = "Kevlin Henney's Singleton";
      const namedSetting = spec.settings.define( myName, "string" );

      assert.strictEqual( namedSetting.name, myName );
    });
  });

  describe( ".rename( newName )", () => {
    
    const originalName = "Coca Cola";
    const newName = "Coke Classic";
    let renamedSetting;

    beforeEach( () => {
      spec = flatware.spec.new();
      renamedSetting = spec.settings.define( originalName, "string" );
    });
  
    it( "a spec setting can be renamed", () => {

      assert.strictEqual( renamedSetting.name, originalName );

      renamedSetting.rename( newName );
      assert.strictEqual( renamedSetting.name, newName );
    });

    it( "informs its spec of its new name", () => {
    
      assert.strictEqual( spec.settings.get( originalName ),  renamedSetting );

      renamedSetting.rename( newName );
      assert.strictEqual( spec.settings.get( newName ), renamedSetting );
      assert.throws( () => { spec.settings.get( originalName ) }, /^Illegal operation/ );
    });

    it( "rejects invalid new names", () => {
    
      [ "", " ", "   ", "name\nwith\n\nline\r\nbreaks" ].forEach( badName => {
        assert.throws( () => { renamedSetting.rename( badName ); }, /^Illegal argument/ );  
      });
    });
  });
});

