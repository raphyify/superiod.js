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
}

export class Superiod {
    $label: string;
    $type: string;
    $style: string | string[];
    $options: WidgetOptions;

    constructor(options?: WidgetOptions);

    static define(
        name: string,
        definition?: StyleDefinition,
        options?: StyleOptions,
    ): typeof Superiod;

    static extend(name: string, definition?: StyleDefinition): typeof Superiod;

    static style(name: string): StyleDefinition;

    static inject(name: string): void;

    static afterScriptLoad(
        modules: string | string[],
        callback: () => void,
    ): Promise<void>;

    static importScript(script: string): Promise<void>;

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
}

export class ButtonWidget extends Superiod {
    constructor(options?: Omit<WidgetOptions, "type">);

    setLabel(value: string): ButtonWidget;

    setType(value: string): ButtonWidget;
}

export class InputWidget extends Superiod {
    constructor(options?: Omit<WidgetOptions, "type">);
}

export class TextareaWidget extends Superiod {
    constructor(options?: Omit<WidgetOptions, "type">);
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
