/**
 * A CSS value accepted by a Superiod declaration.
 */
export type CSSValue = string | number;

/**
 * A collection of CSS properties written with JavaScript property names.
 */
export type StyleDeclarations = Record<string, CSSValue>;

/**
 * A named style definition, including its base declarations and states such
 * as hover, focus, or disabled.
 */
export interface StyleDefinition {
  /** Declarations applied to the generated Superiod class. */
  base?: StyleDeclarations;
  /** Additional pseudo-state declarations keyed by state name. */
  [state: string]: StyleDeclarations | undefined;
}

/**
 * Options used when a style is registered with Superiod.
 */
export interface StyleOptions {
  /** The registered style inherited by this style. */
  extends?: string;
}

/**
 * HTML attributes copied to a rendered widget element.
 */
export type WidgetAttributes = Record<string, string | number | boolean>;

/** Native options accepted when registering a widget event listener. */
export type WidgetEventOptions = boolean | AddEventListenerOptions;

/** A callback accepted by the DOM event listener API. */
export type WidgetEventListener = EventListenerOrEventListenerObject;

/**
 * Options shared by the base class and all built-in widgets.
 */
export interface WidgetOptions {
  /** Text content assigned to the rendered element. */
  label?: string;
  /** HTML element name used by a generic Superiod widget. */
  type?: string;
  /** One style name or several composable style names. */
  style?: string | string[];
  /** Attributes assigned to the rendered element. */
  attributes?: WidgetAttributes;
}

/**
 * The main Superiod widget and style registry class.
 */
export class Superiod {
  /** Text content used by the widget. */
  $label: string;
  /** HTML element name used by the widget. */
  $type: string;
  /** Style name or names applied by the widget. */
  $style: string | string[];
  /** Original options supplied to the constructor. */
  $options: WidgetOptions;

  /** Creates a generic Superiod widget. */
  constructor(options?: WidgetOptions);

  /** Registers a named style and optionally gives it a parent style. */
  static define(
    name: string,
    definition?: StyleDefinition,
    options?: StyleOptions,
  ): typeof Superiod;

  /** Adds or overrides declarations in an existing registered style. */
  static extend(name: string, definition?: StyleDefinition): typeof Superiod;

  /** Resolves a style together with all inherited declarations. */
  static style(name: string): StyleDefinition;

  /** Injects a style and its pseudo-state rules into the document. */
  static inject(name: string): void;

  /** Returns the generated CSS class names for this widget. */
  classes(): string;

  /** Registers an event listener and returns this widget for chaining. */
  on(
    type: string,
    listener: WidgetEventListener,
    options?: WidgetEventOptions,
  ): this;

  /** Removes one listener, all listeners for an event, or every listener. */
  off(type?: string, listener?: WidgetEventListener): this;

  /** Creates the widget element and optionally appends it to a target. */
  render(target?: HTMLElement): HTMLElement;
}

/**
 * A button widget using the registered button style by default.
 */
export class ButtonWidget extends Superiod {
  /** Creates a button widget. */
  constructor(options?: Omit<WidgetOptions, "type">);
}

/**
 * A single-line input widget using the registered input style by default.
 */
export class InputWidget extends Superiod {
  /** Creates an input widget. */
  constructor(options?: Omit<WidgetOptions, "type">);
}

/**
 * A multiline textarea widget using the registered textarea style by default.
 */
export class TextareaWidget extends Superiod {
  /** Creates a textarea widget. */
  constructor(options?: Omit<WidgetOptions, "type">);
}

declare global {
  /** The Superiod class exposed by the browser script. */
  var Superiod: typeof import("./superiod").Superiod;

  /** The button widget constructor exposed by the browser script. */
  var ButtonWidget: typeof import("./superiod").ButtonWidget;

  /** The input widget constructor exposed by the browser script. */
  var InputWidget: typeof import("./superiod").InputWidget;

  /** The textarea widget constructor exposed by the browser script. */
  var TextareaWidget: typeof import("./superiod").TextareaWidget;

  interface Window {
    /** The Superiod class exposed by the browser build. */
    Superiod: typeof Superiod;
  }
}
