const path = require( "path" );
const fs = require( "fs" );

// References
const licence = getSourcePath( "LICENCE" );
const readme = getSourcePath( "README.md" );
const srcPackage = getSourcePath( "package.json" );
const publishedLicence = getSourcePath( "./dist/LICENCE" );
const publishedReadme = getSourcePath( "./dist/README.md" );
const publishedPackage = getSourcePath( "./dist/package.json" );

// Procedure
fs.copyFile(
  licence,
  publishedLicence,
  ( err ) => { reportResult( "copy", licence, publishedLicence, err ); }
);

fs.copyFile(
  readme,
  publishedReadme,
  ( err ) => { reportResult( "copy", readme, publishedReadme, err ); }
);

fs.readFile(
  srcPackage,
  ( err, data ) => {
    if ( err !== undefined && err !== null )
      reportResult( "publish", srcPackage, publishedPackage, err );
    else
      publishPackage( makePublishedPackage( JSON.parse( data ) ) );
  }
);

// Supporting Functions
function getSourcePath( sourceRelativeName ) {
  return path.resolve( __dirname, "../", sourceRelativeName );
}

function reportResult( op, source, destination, err ) {
  if ( err !== undefined && err !== null  ) {
    console.log( `Could not ${ op } ${ source } to ${ destination }` );
    console.log( `Error:\n${ err }\n` );
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

