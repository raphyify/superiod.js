import { Superiod } from "./core.js";

export class TextareaWidget extends Superiod {
  constructor( options = {} ) {
    super( { ...options, type: "textarea", style: options.style || "textarea" } );
  }
}
