import settingDef from "./spec/setting/def.js";
import { IllegalArgument, IllegalOperation } from "@geronimus/utils";

function newSpec() {

  const defs = {};

  function defineSetting( name, type ) {
  
    const newDef = settingDef.create( name, type );

    defs[ newDef.name ] = newDef;
    return newDef;
  }

  function getDef( settingName ) {
  
    validateSettingName( settingName );
    validateSettingExists( settingName, "get" );

    return defs[ settingName ];
  }

  function listDefs() {
    return Object.keys( defs ).sort();
  }

  function removeDef( settingName ) {

    validateSettingName( settingName );
    validateSettingExists( settingName, "remove" );

    delete defs[ settingName ];
  }

  function validateSettingName( settingName ) {  
    if ( typeof settingName !== "string" )
      IllegalArgument( "settingName", "A string naming a previously-defined setting", settingName );
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

