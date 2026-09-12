import { Superiod } from "./core.js";

export class ButtonWidget extends Superiod {
  constructor( options = {} ) {
    super( { ...options, type: "button", style: options.style } );
  }
}
