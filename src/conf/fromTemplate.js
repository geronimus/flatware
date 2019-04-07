import { IllegalArgument, isNull } from "@geronimus/utils";
import confFromObject from "./fromObject";
import { reviveJSONDates } from "../util/value";
import { isValidName } from "../spec/setting";
import { types } from "../spec/structure";

function confFromTemplate( template ) {

  if ( typeof template !== "string" )
    badJSON( template);
    
  const templateObj = validateJSON( template );
  validateConfInterface ( templateObj );

  return makeConf( templateObj );

  function validateJSON( text ) {
    let result;

    try { result = JSON.parse( text, reviveJSONDates ); }
    catch( ignore ) { badJSON( text ); }

    return result;
  }

  function validateConfInterface( obj ) {
  
    Object.keys( obj ).forEach( setting => {
      if ( !isValidName( setting ) )
        badName( setting );
      else if ( !types.includes( obj[ setting ].type ) )
        badType( setting, obj[ setting ].type );
      else if ( !satisfiesType( obj[ setting ].value, obj[ setting ].type ) )
        badValue( setting, obj[ setting ].type, obj[ setting ].value );
    });

    function satisfiesType( value, type ) {
      if ( isNull( value ) )
        return true;
      else if ( type === "Date" )
        return value instanceof Date;
      else
        return typeof value === type;
    }

    function badName( name ) {
      IllegalArgument(
        `template.${ name }`,
        "A setting name not containing new lines, nor entirely composed of whitespace",
        name
      );
    }

    function badType( name, type ) {
      IllegalArgument(
        `template.${ name }.type`,
        `One of:\n- ${ types.join( "\n- " ) }`,
        type
      );  
    }

    function badValue( name, type, value ) {
      IllegalArgument(
        `template.${ name }.value`,
        `A value of type ${ type }`,
        value
      );  
    }
  }

  function badJSON( text ) {
    IllegalArgument(
      "template",
      "A well-formed JSON string",
      text
    );  
  }

  function makeConf( templateObj ) {
  
    const confObj = Object.keys( templateObj )
      .reduce(
        ( obj, setting ) => {
          obj[ setting ] = replaceNull( templateObj[ setting ].value );
          return obj;
        },
        {}
      );

    return confFromObject( confObj );

    function replaceNull( value ) {
      if ( value === null )
        return undefined;
      else
        return value;
    }
  }
}

export default confFromTemplate;

