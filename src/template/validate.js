import { IllegalArgument, isNull } from "@geronimus/utils";
import { jsonIsValid, reviveJSONDates } from "../util/value";
import { isValidName } from "../spec/setting";
import { types } from "../spec/structure";

// Most functions named validate... simply throw an error when the argument
// doesn't meet the criteria, but this one returns the validated JSON as
// an object if it does.
function validateJSON( text ) {

  if ( !jsonIsValid( text ) )
    badJSON( text );
  
  return JSON.parse( text, reviveJSONDates );
}

function badJSON( text ) {
  IllegalArgument(
    "template",
    "A well-formed JSON string",
    text
  );  
}

function validateSpecInterface( obj ) {

  Object.keys( obj ).forEach( setting => {
    if ( !isValidName( setting ) )
      badName( setting );
    else if ( !types.includes( obj[ setting ].type ) )
      badType( setting, obj[ setting ].type );
  });
}

function validateConfInterface( obj ) {

  validateSpecInterface( obj );

  Object.keys( obj ).forEach( setting => {
    if ( !satisfiesType( obj[ setting ].value, obj[ setting ].type ) )
      badValue( setting, obj[ setting ].type, obj[ setting ].value );
  });
}

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

export {
  validateSpecInterface,
  validateConfInterface,
  validateJSON
};

