import { Superiod } from "./core.js";
import { ButtonWidget } from "./button.js";
import { InputWidget } from "./input.js";
import { TextareaWidget } from "./textarea.js";

if ( typeof window !== "undefined" ) {
  window.Superiod = Superiod;
  window.ButtonWidget = ButtonWidget;
  window.InputWidget = InputWidget;
  window.TextareaWidget = TextareaWidget;
}

export { Superiod, ButtonWidget, InputWidget, TextareaWidget };
