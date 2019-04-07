import { copyValue } from "../util/value";
import { propertiesByType, constraintsByType } from "./structure";

function objectify( defs ) {

  return Object.keys( defs ).reduce( addSetting, {} );

  function addSetting( obj, settingName ) {
    obj[ settingName ] = buildSettingStruct( defs[ settingName ] );
    return obj;

    function buildSettingStruct( setting ) {
      return propertiesByType[ setting.type ]
        .reduce( addDefinedProperty, {} );

      function addDefinedProperty( obj, propName ) {
        if (
          constraintsByType[ setting.type ].includes( propName ) &&
            setting.getConstraint( propName ) !== undefined
        )
          obj[ propName ] = copyValue( setting.getConstraint( propName ) );
        else if ( setting[ propName ] !== undefined )
          obj[ propName ] = copyValue( setting[ propName ] );
        return obj;
      }
    }
  }
}

function makeTemplate( defs ) {
  
  const obj = objectify( defs );
  Object.keys( obj ).forEach( setting => {
    obj[ setting ][ "value" ] = null;  
  });

  return JSON.stringify( obj, null, 2 );
}

export {
  objectify,
  makeTemplate
};

