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

export {
  newSpec
};

