import setting from "./spec/setting.js";
import { IllegalArgument, IllegalOperation } from "@geronimus/utils";

function newSpec() {

  const defs = {};

  function defineSetting( name, type ) {
  
    const newDef = setting.create( name, type, processMessage );

    defs[ newDef.name ] = newDef;
    return newDef;
  }

  function getDef( settingName ) {
  
    validateType( settingName, "string", "getDef" );
    validateSettingExists( settingName, "get" );
    return defs[ settingName ];
  }

  function listDefs() {
    return Object.keys( defs ).sort();
  }

  function removeDef( settingName ) {

    validateType( settingName, "string", "removeDef" );
    validateSettingExists( settingName, "remove" );
    delete defs[ settingName ];
  }

  function processMessage( message ) {
  
    if ( isRename( message ) ) {
      const renamedDef = defs[ message.oldName ];
      removeDef( message.oldName );
      defs[ message.newName ] = renamedDef;
    }

    function isRename( message ) {
      return typeof message === "object" &&
        [ "event", "oldName", "newName"  ].every(
          key => Object.keys( message ).includes( key ) &&
            typeof message[ key ] === "string"
        ) &&
        message.event === "rename" &&
        listDefs().includes( ( message.oldName ) );
    }
  }

  function validateType( value, type, method ) {
  
    if ( typeof value !== type )
      IllegalArgument(
        `settings.defs.${ method }( ${ value } )`,
        `A value of type "${ type }"`,
        value
      );
  }

  function validateSettingExists( settingName, method ) {  
    if ( !listDefs().includes( settingName ) )
      IllegalOperation(
        `settings.defs.${ method }( ${ settingName } )`,
        `${ settingName } must be a defined setting`,
        `${ settingName } is not an existing setting definition`
      );
  }

  return Object.freeze({

    settings: Object.freeze({
      define: defineSetting,
      get: getDef,
      list: listDefs,
      remove: removeDef
    })
  });
}

export {
  newSpec
};

