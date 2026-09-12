export type CSSValue = string | number;
export type StyleDeclarations = Record<string, CSSValue>;
export type InlineStyle = StyleDeclarations;

export interface StyleDefinition {
  base?: StyleDeclarations;

  [state: string]: StyleDeclarations | undefined;
}

export interface StyleOptions {
  extends?: string;
}

export type WidgetAttributes = Record<string, string | number | boolean>;
export type WidgetEventOptions = boolean | AddEventListenerOptions;
export type WidgetEventListener = EventListenerOrEventListenerObject;

export type ApiRule =
    | string
    | {
  action?: string;
  method?: string;
  headers?: Record<string, string>;
};
export type ApiRules = Record<string, ApiRule>;

export interface ApiOptions {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  mode?: RequestMode;
}

export interface ApiClient {
  url: string;
  rules: ApiRules;

  request(
      rule: string,
      data?: Record<string, unknown> | unknown,
      options?: RequestInit,
  ): Promise<unknown>;

  [rule: string]: unknown;
}

export interface WidgetOptions {
  label?: string;
  type?: string;
  style?: string | string[];
  attributes?: WidgetAttributes;
  value?: string;
}

export class Superiod {
  $type: string;
  $style: string | string[];
  $options: WidgetOptions;

  // When set to true, it suppresses and runs set of methods not made for an element
  // Else renders a warning message in the console and stops the execution of that method.
  $suppressUsageWarning?: boolean;

  constructor(options?: WidgetOptions);

  // Define CSS styling rules for a specified style-key-name.
  static define(
      name: string,
      definition?: StyleDefinition,
      options?: StyleOptions,
  ): typeof Superiod;

  static extend(name: string, definition?: StyleDefinition): typeof Superiod;

  static style(name: string): StyleDefinition;

  static inject(name: string): void;

  // Script lifecycle handling. Executes the callback function when a script is
  // fully loaded onto the page.
  static afterScriptLoad(
      modules: string | string[],
      callback: () => void,
  ): Promise<void>;

  static importScript(script: string): Promise<void> | void;

  // Easily connect a backend script to JavaScript
  static Api(url: string, rules: ApiRules, options?: ApiOptions): ApiClient;
  static Api(
      options: ApiOptions & { url: string; rules?: ApiRules },
  ): ApiClient;

  classes(): string;

  setStyle(style: string | InlineStyle): this;

  on(
      type: string,
      listener: WidgetEventListener,
      options?: WidgetEventOptions,
  ): this;

  off(type?: string, listener?: WidgetEventListener): this;

  render(target?: HTMLElement): HTMLElement;

  setLabel(value: string): Superiod;

  setType(value: string): Superiod;

  setValue(value: string): Superiod;
}

export class ButtonWidget extends Superiod {
  $label: string;

  constructor(options?: Omit<WidgetOptions, "value">);
}

export class InputWidget extends Superiod {
  constructor(options?: Omit<WidgetOptions, "label">);

  setValue(value: string): InputWidget;
}

export class TextareaWidget extends Superiod {
  constructor(options?: Omit<WidgetOptions, "label">);
}

declare global {
  var Superiod: typeof import("./superiod").Superiod;
  var ButtonWidget: typeof import("./superiod").ButtonWidget;
  var InputWidget: typeof import("./superiod").InputWidget;
  var TextareaWidget: typeof import("./superiod").TextareaWidget;

  interface Window {
    Superiod: typeof Superiod;
    ButtonWidget: typeof ButtonWidget;
    InputWidget: typeof InputWidget;
    TextareaWidget: typeof TextareaWidget;
  }
}
