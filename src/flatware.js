import setting from "./setting.js";
import { IllegalOperation } from "@geronimus/utils";

function newConfig() {

  const defs = {};

  function defineSetting( name, type ) {
  
    const newSetting = setting.create( name, type );

    if ( Object.keys( defs ).includes( newSetting.name ) )
      IllegalOperation(
        "settings.create( name, type )",
        "The name of each setting must be unique",
        `Added ${ newSetting.name } when ${ newSetting.name } is already defined`
      );
    else {
      defs[ newSetting.name ] = newSetting;  
    }
  }

  return Object.freeze({
    settings: Object.freeze({
      create: defineSetting
    })
  });
}

export default Object.freeze({
  newConfig
});

