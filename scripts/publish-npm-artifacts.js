const path = require( "path" );
const fs = require( "fs" );

// References
const licence = getSourcePath( "LICENCE" );
const readme = getSourcePath( "README.md" );
const srcPackage = getSourcePath( "package.json" );
const dist = getSourcePath( "dist" );
const publishedPackage = path.resolve( dist, "package.json" );

// Procedure
fs.copyFile(
  licence,
  dist,
  ( err ) => { reportResult( "copy", licence, dist, err ); }
);

fs.copyFile(
  readme,
  dist,
  ( err ) => { reportResult( "copy", readme, dist, err ); }
);

fs.readFile(
  srcPackage,
  ( err, data ) => {
    if ( err !== undefined )
      reportResult( "publish", srcPackage, publishedPackage, err );
    else
      publishPackage( makePublishedPackage( JSON.parse( data ) ) );
  }
);

// Supporting Functions
function getSourcePath( sourceRelativeName ) {
  return path.resolve( __dirname, sourceRelativeName );
}

function reportResult( op, source, destination, err ) {
  if ( err !== undefined ) {
    console.log( `Could not ${ op } ${ source } to ${ destination }\n` );
    colsole.log( `Error:\n${ err }` );
  } else
    console.log( `Success:\n${ op } ${ source } to ${ destination }` );
}

function publishPackage( publishedPackageObj ) {
  fs.writeFile(
    publishedPackage,
    JSON.stringify( publishedPackageObj ),
    ( err ) => {
      reportResult( "publish", "package.json", publishedPackage, err );
    }
  );
}

function makePublishedPackage( srcObj ) {
  return publishedPacakageObj = Object.keys( srcObj )
    .filter( prop => prop !== "devDependencies" && prop !== "scripts" )
    .reduce(
      ( publicationObj, key ) => {
        publicationObj[ key ] = srcObj[ key ];
        return publicationObj;
      },
      {}
    );
}

