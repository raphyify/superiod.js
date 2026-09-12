import { Superiod } from "./core.js";

export class ButtonWidget extends Superiod {
  constructor( options = {} ) {
    super( { ...options, type: "button", style: options.style || "button" } );
  }

  setLabel( value ) {
    if ( !value ) return false;
    this.$label = value;
    if ( this.$element ) this.$element.textContent = value;
    return this;
  }

  setType( value ) {
    if ( !value ) return false;
    this.$options.attributes = { ...this.$options.attributes, type: value };
    if ( this.$element ) this.$element.setAttribute( "type", value );
    return this;
  }
}
