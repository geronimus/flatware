import { IllegalArgument, isNull } from "@geronimus/utils";
import newSpec from "./new";
import { isValidName } from "./setting.js";
import {
  types as allowedTypes,
  constraintsByType as allowedConstraints
} from "./structure";

function specFromObject( obj ) {

  validateObj( obj );

  Object.keys( obj ).forEach( name => {
    validateSettingProps( name, obj[ name ] );
  });

  const spec = newSpec();

  Object.keys( obj ).forEach(
    name => buildSetting( name, obj[ name ], spec )
  );

  return spec;

  function validateObj( obj ) {
    if ( isNull( obj ) || Array.isArray( obj ) || typeof obj !== "object" )
      IllegalArgument( "obj", "An object defining a spec", obj );
  }

  function validateSettingProps( name, defObj ) {

    validateName( name );
    validateAllowedType( name, defObj );
    validateTypeConstraints( name, defObj );

    function validateName( name ) {
      if ( !isValidName( name ) )
        IllegalArgument(
          "setting name",
          "A string with at least one non-space character and no new lines",
          defObj
        );
    }

    function validateAllowedType( name, defObj ) {
      if (
        !Object.keys( defObj ).includes( "type" ) ||
          !allowedTypes.includes( defObj[ "type" ] )
      )
        IllegalArgument(
          name,
          `One of: \n- ${ allowedTypes.join( "\n- " ) }`,
          defObj[ "type" ]
        );
    }

    function validateTypeConstraints( name, defObj ) {
      Object.keys( defObj )
        .filter( key => [ "type", "desc" ].includes[ key ] )
        .forEach( key => {
          if ( !allowedConstraints[ defObj[ "type" ] ].includes( key ) )
            IllegalArgument(
              name,
              "An object defining only the constraints:\n- " +
                `${ allowedConstraints[ defObj[ "type" ] ].join( "\n- " ) }`,
              key
            );
        });
    }
  }

  function buildSetting( name, defObj, spec ) {
  
    const setting = spec.settings.define( name, defObj.type );
    setting.desc = defObj.desc;
    
    Object.keys( defObj )
      .filter( prop => allowedConstraints[ setting.type ].includes( prop ) )
      .forEach( constraint => {
        setting.setConstraint( constraint, defObj[ constraint ] );  
      });
  }
}

export default specFromObject;

