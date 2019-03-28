import { IllegalArgument, IllegalOperation, isNull } from "@geronimus/utils";

const allowedConstraints = Object.freeze({
  "boolean": [
  ],
  "number": [
    "lowerBound",
    "optionsList",
    "upperBound"
  ],
  "string": [
    "optionsList",
    "pattern"
  ],
  "Date": [
    "lowerBound",
    "optionsList",
    "upperBound"
  ]
});

const allowedTypes = Object.freeze( Object.keys( allowedConstraints ) );

function create( name, type, sendToParent ) {

  validateName( name );
  validateType( type );

  let myName = name;
  let myType = type;
  let myDesc = undefined;
  let constraints = initializeConstraints( allowedConstraints, myType );

  const publicInterface = Object.freeze({
    get name() { return myName; },
    get type() { return myType; },
    get desc() { return myDesc; },
    set desc( text ) {
      validateDesc( text );
      myDesc = text;
    },
    getConstraint,
    setConstraint,
    rename,
    redefineType,
    asObject
  });

  return publicInterface;

  function getConstraint( constraint ) {
    
    validateConstraintName( constraint, myType );
    return constraints[ constraint ];
  }

  function setConstraint( constraint, value ) {
    
    validateConstraintName( constraint, myType );
    validateConstraintVal( constraint, value, myType );

    constraints[ constraint ] = value;

    return publicInterface;
  }

  function rename( newName ) {

    validateName( newName );
    sendToParent(
      Object.freeze({
        event: "rename",
        oldName: myName,
        newName
      })
    );
    myName = newName;
    return publicInterface;
  }

  function redefineType( newType ) {
  
    validateType( newType );
    myType = newType;
    constraints = initializeConstraints( allowedConstraints, newType );
    return publicInterface;
  }

  function asObject() {
    const result = appendValid( {}, "type", myType );
    appendValid( result, "desc", myDesc );

    Object.keys( constraints ).sort().forEach( item => {
      appendValid( result, item, constraints[ item ] );
    });

    return result;

    function appendValid( obj, key, val ) {
      const result = obj || {};
      if ( typeof key === "string" && !isNull( val ) )
        result[ key ] = val;

      return result;
    }
  }

  function validateName( name ) {
  
    if (
      isNull( name ) ||
        typeof name !== "string" ||
        !isValidName( name )
    )
      IllegalArgument( "name", "A string with at least one character, and no line breaks", name );
  }

  function validateType( type ) {
    
    if (
      isNull( type ) ||
        typeof type !== "string" ||
        !allowedTypes.includes( type )
    )
      IllegalArgument( "type", `The data type must be one of: ${ allowedTypes }`, type );
  }

  function validateDesc( text ) {
  
    if ( text !== undefined && !isValidName( text ) )
      IllegalArgument(
        "description",
        "A string consisting of at least one character, or undefined",
        text
      );
  }
  
  function initializeConstraints( allowedConstraints, type ) {
  
    return allowedConstraints[ type ].reduce(
      ( obj, member ) => {
        obj[ member ] = undefined;
        return obj;
      },
      {}
    );
  }

  function validateConstraintName( constraint, type ) {

    if ( !( allowedConstraints[ type ].includes( constraint ) ) )
      IllegalArgument(
        "constraint",
        `One of the allowed constraints for settings of type ${ type }:\n` +
          `${ allowedConstraints[ type ].map( item => "  - " + item ).join( "\n" ) }`,
        constraint
      );
  }

  function validateConstraintVal( constraint, value, type ) {

    if ( value === undefined )
      // Exit early. We will always accept undefined to remove a constraint's value.
      return;
    else if ( constraint === "optionsList" )
      validateOptionsList( constraint, value, type );
    else if ( constraint === "pattern" )
      validatePattern( value );
    else
      validateType( constraint, value, type );

    if ( [ "number", "Date" ].includes( type ) )
      validateBounds( constraint, value );

    function validateType( constraint, value, type ) {
      if ( value instanceof Date && type === "Date" )
        return;
      if ( typeof value !== type )
        IllegalArgument( `setConstraint( ${ constraint }, ${ value } )`, `A ${ type } value`, value );
    }

    function validateOptionsList( constraint, value, type ) {

      if ( Array.isArray( value ) )
        value.forEach( item => validateType( constraint, item, type ) );
      else
        IllegalArgument( `setConstraint( "optionsList", ${ value } )`, "An array", value );
    }

    function validatePattern( value ) {
      
      if ( !( value instanceof RegExp ) )
        IllegalArgument( `setConstraint( "pattern", ${ value } )`, "A RegExp object", value );
    }

    function validateBounds( constraintName, constraintValue ) {

      const report = {};

      // Each "check" subroutine adds to the report if there is any failure.
      if ( constraintName === "lowerBound" ) {
        checkUpper( constraintValue );
        checkList( constraintValue );
      }
      else if ( constraintName === "upperBound" ) {
        checkLower( constraintValue );
        checkList( constraintValue );
      }
      else if ( constraintName === "optionsList" ) {
        checkLower( Math.min( ...constraintValue ) );
        checkUpper( Math.max( ...constraintValue ) );
      }

      // If the report is not empty, then we have a violation and must report an error.
      if ( Object.keys( report ).length > 0  ) {
        const violations = Object.keys( report )
          .map( item => `  - ${ item } = ${ JSON.stringify( report[ item ] ) }` )
          .join( "\n" );
        
        IllegalOperation(
          `setConstraint( ${ constraintName }, ${ constraintValue } )`,
          `Set ${ constraintName } to a value outside the previously defined constraints:` +
            `\n${ violations }`,
          "A setting's constraints must adhere to previously-defined constraints"
        );
      }

      function checkLower( val ) {
        if ( constraints[ "lowerBound" ] !== undefined && val < constraints[ "lowerBound" ] )
          report[ "lowerBound" ] = constraints[ "lowerBound" ];
      }

      function checkUpper( val ) {
        if ( constraints[ "upperBound" ] !== undefined && val > constraints[ "upperBound" ] )
          report[ "upperBound" ] = constraints[ "upperBound" ];
      }

      function checkList( val ) {
        if (
          constraints[ "optionsList" ] !== undefined && (
            val < Math.min( constraints[ "optionsList" ] ) ||
              val > Math.max( constraints[ "optionsList" ] )
          )
        )
          report[ "optionsList" ] = constraints[ "optionsList" ];
      }
    }
  }
}

function isValidName( name ) {
  return typeof name === "string" &&
    name.length > 0 &&
    // Not exclusive composed of whitespace
    !/^\s+$/.test( name ) &&
    // Does not contain newlines
    !/\n/.test( name ) &&
    // Does not contain carriage returns
    !/\r/.test( name );
}

const setting = Object.freeze({
  create  
});

export default setting;

export {
  allowedConstraints,
  allowedTypes,
  isValidName,
  setting
};

