import { extendStyle, registerStyle, resolveStyle } from "./registry.js";
import { injectStyle, safeName } from "./styles.js";
import { afterScriptLoad, importScript } from "./script-loader.js";
import { createApi } from "./api.js";

let anonymousStyleId = 0;

export class Superiod {
  constructor( $options = {} ) {
    this.$label = $options.label || "";
    this.$type = $options.type || "div";
    this.$style = $options.style || this.$type;
    this.$options = $options;
    this.$element = null;
    this.$events = new Map();
  }

  static define( name, definition = {}, options = {} ) {
    registerStyle( name, definition, options );
    Superiod.inject( name );
    return Superiod;
  }

  static extend( name, definition = {} ) {
    extendStyle( name, definition );
    Superiod.inject( name );
    return Superiod;
  }

  static style( name ) {
    return resolveStyle( name );
  }

  static inject( name ) {
    injectStyle( name );
  }

  static afterScriptLoad( modules, callback ) {
    return afterScriptLoad( modules, callback );
  }

  static importScript( script ) {
    return importScript( script );
  }

  static Api( urlOrOptions, rules, options ) {
    return createApi( urlOrOptions, rules, options );
  }

  classes() {
    const styles = Array.isArray( this.$style ) ? this.$style : [ this.$style ];
    styles.forEach( ( name ) => Superiod.inject( name ) );
    return styles.map( ( name ) => `superiod-${ safeName( name ) }` ).join( " " );
  }

  on( type, listener, options ) {
    const entries = this.$events.get( type ) || new Set();
    const entry = { listener, options };
    entries.add( entry );
    this.$events.set( type, entries );
    if ( this.$element ) this.$element.addEventListener( type, listener, options );
    return this;
  }

  off( type, listener ) {
    const types = type ? [ type ] : [ ...this.$events.keys() ];
    types.forEach( ( eventType ) => {
      const entries = this.$events.get( eventType );
      if ( !entries ) return;
      const selected = listener
        ? [ ...entries ].filter( ( entry ) => entry.listener === listener )
        : [ ...entries ];
      selected.forEach( ( entry ) => {
        if ( this.$element ) {
          this.$element.removeEventListener(
            eventType,
            entry.listener,
            entry.options,
          );
        }
        entries.delete( entry );
      } );
      if ( !entries.size ) this.$events.delete( eventType );
    } );
    return this;
  }

  setStyle( style ) {
    let styleName;
    if ( typeof style === "string" ) {
      resolveStyle( style );
      styleName = style;
    } else if ( style && typeof style === "object" && !Array.isArray( style ) ) {
      styleName = `anonymous-${ ++anonymousStyleId }`;
      Superiod.define( styleName, style );
    } else {
      return false;
    }

    this.$style = styleName;
    if ( this.$element ) this.$element.className = this.classes();
    return this;
  }

  render( target ) {
    if ( typeof document === "undefined" )
      throw new Error( "Superiod widgets require a browser document to render." );
    const element = document.createElement( this.$type );
    element.className = this.classes();
    if ( this.$label ) element.textContent = this.$label;
    Object.entries( this.$options.attributes || {} ).forEach( ( [ key, value ] ) =>
      element.setAttribute( key, value.toString() ),
    );
    this.$events.forEach( ( entries, type ) => {
      entries.forEach( ( { listener, options } ) =>
        element.addEventListener( type, listener, options ),
      );
    } );
    this.$element = element;
    if ( target ) target.appendChild( element );
    return element;
  }
}
