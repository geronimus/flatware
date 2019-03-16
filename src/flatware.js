import setting from "./setting.js";
import { IllegalArgument, IllegalOperation } from "@geronimus/utils";

function newConfig() {

  const defs = {};

  function defineSetting( name, type ) {
  
    const newSetting = setting.define( name, type );

    if ( Object.keys( defs ).includes( newSetting.name ) )
      IllegalOperation(
        "settings.define( name, type )",
        "The name of each setting must be unique",
        `Added ${ newSetting.name } when ${ newSetting.name } is already defined`
      );
    else {
      defs[ newSetting.name ] = newSetting;
      return newSetting;
    }
  }

  function getDef( settingName ) {
  
    if ( typeof settingName !== "string" )
      IllegalArgument( "settingName", "A string naming a previously-defined setting", settingName );
    else if ( !listDefs().includes( settingName ) )
      IllegalOperation(
        `settings.defs.get( ${ settingName } )`,
        `${ settingName } must be a defined setting`,
        `${ settingName } is not an existing settings definition`
      );
    else
      return defs[ settingName ];
  }

  function listDefs() {
    return Object.keys( defs ).sort();
  }

  return Object.freeze({

    settings: Object.freeze({
      define: defineSetting,

      defs: Object.freeze({
        get: getDef,
        list: listDefs
      })
    })
  });
}

export default Object.freeze({
  newConfig
});

