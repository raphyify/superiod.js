import { Superiod } from "./core.js";

export class InputWidget extends Superiod {
  constructor( options = {} ) {
    super( { ...options, type: "input", style: options.style, attributes: { ...options.attributes, value: options.value || "" } } );
    this.$useInstead = "setValue";
  }
}
