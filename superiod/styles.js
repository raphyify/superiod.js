import { resolveStyle } from "./registry.js";

export const cssName = ( name ) =>
  name.replace( /[A-Z]/g, ( letter ) => `-${ letter.toLowerCase() }` );

export const safeName = ( name ) =>
  String( name )
    .toLowerCase()
    .replace( /[^a-z0-9_-]/g, "-" );

export function addRule( selector, declarations ) {
  return `${ selector }{${ Object.entries( declarations || {} )
    .filter( ( [ , value ] ) => value !== undefined && value !== null )
    .map( ( [ property, value ] ) => `${ cssName( property ) }:${ value };` )
    .join( "" ) }}`;
}

export function ensureStyleSheet() {
  if ( typeof document === "undefined" ) return null;
  let sheet = document.getElementById( "superiod-styles" );
  if ( !sheet ) {
    sheet = document.createElement( "style" );
    sheet.id = "superiod-styles";
    document.head.appendChild( sheet );
  }
  return sheet;
}

export function injectStyle( name ) {
  const sheet = ensureStyleSheet();
  if ( !sheet ) return;
  const style = resolveStyle( name );
  const selector = `.superiod-${ safeName( name ) }`;
  const rules = [ addRule( selector, style.base || style ) ];
  Object.entries( style ).forEach( ( [ state, declarations ] ) => {
    if ( state === "base" || typeof declarations !== "object" ) return;
    const pseudo = state.startsWith( ":" ) ? state : `:${ state }`;
    rules.push( addRule( `${ selector }${ pseudo }`, declarations ) );
  } );
  for ( let index = sheet.sheet.cssRules.length - 1; index >= 0; index -= 1 ) {
    const rule = sheet.sheet.cssRules[ index ];
    if (
      rule.selectorText === selector ||
      rule.selectorText?.startsWith( `${ selector }:` )
    ) {
      sheet.sheet.deleteRule( index );
    }
  }
  rules.forEach( ( rule ) =>
    sheet.sheet.insertRule( rule, sheet.sheet.cssRules.length ),
  );
}
