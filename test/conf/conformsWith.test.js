import { assert } from "chai";
import flatware from "../../src/flatware";
import { confObject } from "../example/conf";
import { specObject } from "../example/spec";

let conf;
let spec;

function reloadConf() {  
  conf = flatware.conf.fromObject( confObject );
}

function reloadSpec() {
  spec = flatware.spec.fromObject( specObject );  
}

describe( "conf.conformsWith( spec )", () => {

  beforeEach( () => { reloadConf(); });
  
  it( "rejects non-objects", () => {

    [
      undefined, null, true, 1, "object"
    ].forEach( badObj => {
      assert.throws(
        () => { conf.conformsWith( badObj ); },
        /^Illegal argument.*A spec object/s
      );  
    });
  });

  it( "rejects non-spec objects", () => {
    
    [
      {}, [], new Date(),
      {
        storageAdaptor: {
          type: "string",
          optionsList: [ "memoryStorage", "fileSystemStorage" ]
        }
      }
    ].forEach( badObj => {
      assert.throws(
        () => { conf.conformsWith( badObj ); },
        /^Illegal argument.*A spec object/s
      );  
    });
  });

  it( "reports true if a setting is missing", () => {

    reloadSpec();

    [ "storageAdaptor", "processTarget", "clientOnly", "dateMax" ].forEach(
      prop => {

        reloadConf();
        conf.values.remove( prop );

        assert.deepEqual(
          conf.conformsWith( spec ),
          {
            result: true,
            missing: [ prop ],
            extra: {},
            illegal: {},
            okay: conf.values.list()
          }
        );
      }
    );
  });

  it( "reports false if any setting is of the wrong type", () => {

    [ "storageAdaptor", "processTarget", "clientOnly", "dateMax" ].forEach( prop => {
      let obj = Object.assign( {}, confObject);
      obj[ prop ] = illegalType( prop );
      let badConf = flatware.conf.fromObject( obj );

      assert.deepEqual(
        badConf.conformsWith( spec ),
        {
          result: false,
          missing: [],
          extra: {},
          illegal: theseConfValues( [ prop ], badConf ),
          okay: theseConfValues(
            Object.keys( badConf.values.list() )
              .filter( item => item !== prop ),
            badConf
          )
        }
      );
    });

    function illegalType( prop ) {
      switch( prop ) {
        case "storageAdaptor":
          return true;
        case "processTarget":
          return "6";
        case "clientOnly":
          return "true";
        case "dateMax":
          return new Date( "2038-02-19T03:14:07.999Z" ).getTime();
      }
    }
  });

  it( "reports false if any setting violates a constraint", () => {

    [ "storageAdaptor", "processTarget", "dateMax" ].forEach( prop => {
      reloadConf();
      conf.values.set( prop, illegalVal( prop ) );

      assert.deepEqual(
        conf.conformsWith( spec ),
        {
          result: false,
          missing: [],
          extra: {},
          illegal: theseConfValues( [ prop ], conf ),
          okay: theseConfValues(
            Object.keys( conf.values.list() ).filter( item => item !== prop ),
            conf
          )
        }
      );
    });

    function illegalVal( val ) {
      switch ( val ) {
        case "storageAdaptor":
          return "selfStorage";
        case "processTarget":
          return Number.MAX_SAFE_INTEGER;
        case "dateMax":
          return new Date( "1969-12-31T23:59:59.999Z" );
      }  
    }
  });

  it( "reports true if there are extra values", () => {
    
    const extraSetting = "authAdaptor";
    const extraVal = "sharepointAuthentication";
    const extraValue = {};
    extraValue[ extraSetting ] =  extraVal;

    conf.values.set( extraSetting, extraVal );

    assert.deepEqual(
      conf.conformsWith( spec ),
      {
        result: true,
        missing: [],
        extra: extraValue,
        illegal: {},
        okay: theseConfValues(
          Object.keys( conf.values.list() )
            .filter( setting => setting !== extraSetting ),
          conf
        )
      }
    );
  });

  it( "reports true for an exactly adherent value", () => {
  
    assert.deepEqual(
      conf.conformsWith( spec ),
      {
        result: true,
        missing: [],
        extra: {},
        illegal: {},
        okay: conf.values.list()
      }
    );
  });
});

function theseConfValues( keyArray, conf ) {
  return keyArray.reduce(
    ( obj, key ) => {
      obj[ key ] = conf.values.get( key );
      return obj;
    },
    {}
  );
}

