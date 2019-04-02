function copyValue( ref ) {
  if ( Array.isArray( ref ) )
    return ref.map( copyValue );
  else if ( ref instanceof Date )
    return new Date( ref.getTime() );
  else
    return ref;
}

export { copyValue };

