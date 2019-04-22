import { compareValue, copyValue } from "../util/value";

function confReport( conf, spec ) {

  const reportWithExtras = reportOnExtras(
    { result: undefined, missing: [], extra: {}, illegal: {}, okay: {} }
  );

  const nonExtras = Object.keys( conf.values.list() )
    .filter( val => !Object.keys( reportWithExtras.extra ).includes( val ) );

  return nonExtras.reduce(
    ( result, setting ) => {
      const settingVal = [ setting, copyValue( conf.values.get( setting ) ) ];

      if ( isIllegal( settingVal[ 0 ], settingVal[ 1 ] ) )
        result.illegal[ settingVal[ 0 ] ] = settingVal[ 1 ];
      else
        result.okay[ settingVal[ 0 ] ] = settingVal[ 1 ];

      return result;
    },
    reportOnMissing( reportWithExtras )
  );

  function reportOnExtras( report ) {
    return Object.keys( conf.values.list() )
      .filter( setting => !spec.settings.list().includes( setting ) )
      .reduce(
        ( rep, setting ) => {
          rep.extra[ setting ] = conf.values.get( setting );
          return rep;
        },
        report
      );
  }

  function reportOnMissing( report ) {
    return spec.settings.list()
      .filter( setting => !Object.keys( conf.values.list() ).includes( setting ) )
      .reduce(
        ( rep, setting ) => {
          rep.missing.push( setting );
          return rep;
        },
        report
      );
  }

  function isIllegal( setting, val ) {
    return illegalType( setting, val ) ||
      illegalValue( setting, val );

    function illegalType( setting, val ) {
      if ( spec.settings.get( setting ).type === "Date" )
        return !( val instanceof Date );
      else
        return typeof val !== spec.settings.get( setting ).type;
    }

    function illegalValue( setting, val ) {
      const constraints = spec.settings.get( setting ).listConstraints();

      return Object.keys( constraints ).some(
        constr => testConstraint( constr, val )
      );

      function testConstraint( constr, val ) {
        switch ( constr ) {
          case "upperBound":
            return val > constraints[ constr ];
          case "lowerBound":
            return val < constraints[ constr ];
          case "optionsList":
            return !constraints[ constr ]
              .some( item => compareValue( item, val ) );
          case "pattern":
            return !constraints[ constr ].test( val );
        }
      }
    }
  }
}

export { confReport };

