const superiodRegistry = new Map();

export const clone = ( value ) => {
  if ( Array.isArray( value ) ) return value.map( clone );
  if ( value && typeof value === "object" ) {
    return Object.fromEntries(
      Object.entries( value ).map( ( [ key, item ] ) => [ key, clone( item ) ] ),
    );
  }
  return value;
};

export const merge = ( base, addition ) => {
  const result = clone( base || {} );
  Object.entries( addition || {} ).forEach( ( [ key, value ] ) => {
    result[ key ] =
      value && typeof value === "object" && !Array.isArray( value )
        ? merge( result[ key ], value )
        : clone( value );
  } );
  return result;
};

export function resolveStyle( name, trail = [] ) {
  const style = superiodRegistry.get( name );
  if ( !style ) throw new Error( `Superiod style "${ name }" is not registered.` );
  if ( trail.includes( name ) )
    throw new Error(
      `Circular Superiod style inheritance: ${ trail.join( " -> " ) } -> ${ name }`,
    );
  return style.extends
    ? merge( resolveStyle( style.extends, [ ...trail, name ] ), style.definition )
    : clone( style.definition );
}

export function registerStyle( name, definition = {}, options = {} ) {
  superiodRegistry.set( name, {
    definition: clone( definition ),
    extends: options.extends || null,
  } );
}

export function extendStyle( name, definition = {} ) {
  const existing = superiodRegistry.get( name );
  if ( !existing ) throw new Error( `Superiod style "${ name }" is not registered.` );
  existing.definition = merge( existing.definition, definition );
}
