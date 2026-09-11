/**!
 * v1.0
 * Superiod.js -- A composable styling model for utilities and widgets.
 *
 * @author Raphael Nwakaji <raphyify@gmail.com>
 */

/**
 * The main class
 *
 * @class Superiod
 */
/**
 * Stores named style definitions and their optional parent style names.
 *
 * @type {Map<string, {definition: object, extends: string|null}>}
 */
const superiodRegistry = new Map();

/**
 * Creates a recursive copy of an array or plain object.
 *
 * @param {*} value The value to copy.
 * @returns {*} A copy of the supplied value.
 */
const clone = (value) => {
  if (Array.isArray(value)) return value.map(clone);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, clone(item)]),
    );
  }
  return value;
};

/**
 * Recursively merges style declarations, allowing child styles to override
 * only the properties they need to change.
 *
 * @param {object} base The inherited style values.
 * @param {object} addition The overriding style values.
 * @returns {object} The merged style object.
 */
const merge = (base, addition) => {
  const result = clone(base || {});
  Object.entries(addition || {}).forEach(([key, value]) => {
    result[key] =
      value && typeof value === "object" && !Array.isArray(value)
        ? merge(result[key], value)
        : clone(value);
  });
  return result;
};

/** Converts a JavaScript style property into kebab-case CSS. */
const cssName = (name) =>
  name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/** Converts a style name into a safe CSS class suffix. */
const safeName = (name) =>
  String(name)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-");

/**
 * Resolves a style and all of its inherited declarations.
 *
 * @param {string} name The registered style name.
 * @param {string[]} trail Style names already visited during resolution.
 * @returns {object} The fully resolved style definition.
 * @throws {Error} If the style is missing or inheritance is circular.
 */
function resolveStyle(name, trail = []) {
  const style = superiodRegistry.get(name);
  if (!style) throw new Error(`Superiod style "${name}" is not registered.`);
  if (trail.includes(name))
    throw new Error(
      `Circular Superiod style inheritance: ${trail.join(" -> ")} -> ${name}`,
    );
  return style.extends
    ? merge(resolveStyle(style.extends, [...trail, name]), style.definition)
    : clone(style.definition);
}

/**
 * Serializes a declaration object into a CSS rule string.
 *
 * @param {string} selector The CSS selector for the rule.
 * @param {object} declarations CSS property/value pairs.
 * @returns {string} A CSS rule string.
 */
function addRule(selector, declarations) {
  return `${selector}{${Object.entries(declarations || {})
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([property, value]) => `${cssName(property)}:${value};`)
    .join("")}}`;
}

/**
 * Finds or creates the stylesheet used by Superiod in a browser document.
 *
 * @returns {HTMLStyleElement|null} The generated stylesheet or null on a
 * server-like runtime without a document.
 */
function ensureStyleSheet() {
  if (typeof document === "undefined") return null;
  let sheet = document.getElementById("superiod-styles");
  if (!sheet) {
    sheet = document.createElement("style");
    sheet.id = "superiod-styles";
    document.head.appendChild(sheet);
  }
  return sheet;
}

class Superiod {
  /**
   * Creates a generic Superiod widget.
   *
   * @param {object} $options Widget configuration.
   * @param {string} [$options.label] Text content for the rendered element.
   * @param {string} [$options.type="div"] HTML element name.
   * @param {string|string[]} [$options.style] Style name or names to apply.
   * @param {object} [$options.attributes] HTML attributes for the element.
   */
  constructor($options = {}) {
    this.$label = $options.label || "";
    this.$type = $options.type || "div";
    this.$style = $options.style || this.$type;
    this.$options = $options;
    /** @type {HTMLElement|null} The most recently rendered element. */
    this.$element = null;
    /** @type {Map<string, Set<{listener: EventListenerOrEventListenerObject, options?: boolean|AddEventListenerOptions}>>} */
    this.$events = new Map();
  }

  /**
   * Registers a named style and optionally inherits another style.
   *
   * @param {string} name The new style name.
   * @param {object} [definition={}] Base and state declarations.
   * @param {object} [options={}] Registration options.
   * @param {string} [options.extends] Parent style name.
   * @returns {typeof Superiod} The class, enabling chained registrations.
   */
  static define(name, definition = {}, options = {}) {
    superiodRegistry.set(name, {
      definition: clone(definition),
      extends: options.extends || null,
    });
    Superiod.inject(name);
    return Superiod;
  }

  /**
   * Adds or overrides declarations in an existing registered style.
   *
   * @param {string} name The registered style name.
   * @param {object} definition Additional declarations.
   * @returns {typeof Superiod} The class, enabling chained extensions.
   * @throws {Error} If the style has not been registered.
   */
  static extend(name, definition = {}) {
    const existing = superiodRegistry.get(name);
    if (!existing)
      throw new Error(`Superiod style "${name}" is not registered.`);
    existing.definition = merge(existing.definition, definition);
    Superiod.inject(name);
    return Superiod;
  }

  /**
   * Returns a style after resolving all inherited declarations.
   *
   * @param {string} name The registered style name.
   * @returns {object} The resolved style definition.
   */
  static style(name) {
    return resolveStyle(name);
  }

  /**
   * Writes a registered style and its pseudo-state rules into the document.
   *
   * @param {string} name The registered style name.
   * @returns {void}
   */
  static inject(name) {
    const sheet = ensureStyleSheet();
    if (!sheet) return;
    const style = resolveStyle(name);
    const selector = `.superiod-${safeName(name)}`;
    const rules = [addRule(selector, style.base || style)];
    Object.entries(style).forEach(([state, declarations]) => {
      if (state === "base" || typeof declarations !== "object") return;
      const pseudo = state.startsWith(":") ? state : `:${state}`;
      rules.push(addRule(`${selector}${pseudo}`, declarations));
    });
    // Remove older rules so redefining a style cannot leave stale CSS behind.
    for (let index = sheet.sheet.cssRules.length - 1; index >= 0; index -= 1) {
      const rule = sheet.sheet.cssRules[index];
      if (rule.selectorText === selector || rule.selectorText?.startsWith(`${selector}:`)) {
        sheet.sheet.deleteRule(index);
      }
    }
    rules.forEach((rule) =>
      sheet.sheet.insertRule(rule, sheet.sheet.cssRules.length),
    );
  }

  /**
   * Injects this widget's styles and returns its generated CSS class names.
   *
   * @returns {string} Space-separated Superiod CSS classes.
   */
  classes() {
    const styles = Array.isArray(this.$style) ? this.$style : [this.$style];
    styles.forEach((name) => Superiod.inject(name));
    return styles.map((name) => `superiod-${safeName(name)}`).join(" ");
  }

  /**
   * Registers an event listener for this widget.
   *
   * The listener is attached immediately when the widget has been rendered,
   * or automatically when the widget is rendered later.
   *
   * @param {string} type The DOM event name, such as click or input.
   * @param {EventListenerOrEventListenerObject} listener The event callback.
   * @param {boolean|AddEventListenerOptions} [options] Native listener options.
   * @returns {Superiod} This widget for method chaining.
   */
  on(type, listener, options) {
    const entries = this.$events.get(type) || new Set();
    const entry = { listener, options };
    entries.add(entry);
    this.$events.set(type, entries);
    if (this.$element) this.$element.addEventListener(type, listener, options);
    return this;
  }

  /**
   * Removes an event listener from this widget.
   *
   * When no listener is provided, all listeners for the event are removed.
   * When no event type is provided, every registered listener is removed.
   *
   * @param {string} [type] The DOM event name to clear.
   * @param {EventListenerOrEventListenerObject} [listener] One callback to remove.
   * @returns {Superiod} This widget for method chaining.
   */
  off(type, listener) {
    const types = type ? [type] : [...this.$events.keys()];
    types.forEach((eventType) => {
      const entries = this.$events.get(eventType);
      if (!entries) return;
      const selected = listener
        ? [...entries].filter((entry) => entry.listener === listener)
        : [...entries];
      selected.forEach((entry) => {
        if (this.$element) {
          this.$element.removeEventListener(
            eventType,
            entry.listener,
            entry.options,
          );
        }
        entries.delete(entry);
      });
      if (!entries.size) this.$events.delete(eventType);
    });
    return this;
  }

  /**
   * Creates the widget's HTML element and optionally appends it to a target.
   *
   * @param {HTMLElement} [target] Parent element for the rendered widget.
   * @returns {HTMLElement} The newly created element.
   * @throws {Error} If called without a browser document.
   */
  render(target) {
    if (typeof document === "undefined")
      throw new Error("Superiod widgets require a browser document to render.");
    const element = document.createElement(this.$type);
    element.className = this.classes();
    if (this.$label) element.textContent = this.$label;
    Object.entries(this.$options.attributes || {}).forEach(([key, value]) =>
      element.setAttribute(key, value),
    );
    this.$events.forEach((entries, type) => {
      entries.forEach(({ listener, options }) =>
        element.addEventListener(type, listener, options),
      );
    });
    this.$element = element;
    if (target) target.appendChild(element);
    return element;
  }
}

class ButtonWidget extends Superiod {
  /** Creates a button widget using the button style by default. */
  constructor(options = {}) {
    super({ ...options, type: "button", style: options.style || "button" });
  }
}

class InputWidget extends Superiod {
  /** Creates a single-line input widget using the input style by default. */
  constructor(options = {}) {
    super({ ...options, type: "input", style: options.style || "input" });
  }
}

class TextareaWidget extends Superiod {
  /** Creates a multiline textarea using the textarea style by default. */
  constructor(options = {}) {
    super({ ...options, type: "textarea", style: options.style || "textarea" });
  }
}

// The utility style contains declarations shared by every built-in widget.
Superiod.define("utility", {
  base: { boxSizing: "border-box", fontFamily: "inherit" },
});
// Buttons inherit the shared utility declarations and define interaction states.
Superiod.define(
  "button",
  {
    base: {
      appearance: "none",
      border: "0",
      borderRadius: "10px",
      cursor: "pointer",
      padding: "0.75rem 1rem",
      background: "#155e75",
      color: "#fff",
      font: "600 0.95rem inherit",
      transition: "transform .15s ease, background .15s ease",
    },
    hover: { background: "#0e7490", transform: "translateY(-1px)" },
    focus: { outline: "3px solid #a5f3fc", outlineOffset: "2px" },
    disabled: { cursor: "not-allowed", opacity: "0.55" },
  },
  { extends: "utility" },
);
// Fields provide the common visual language for inputs and textareas.
Superiod.define(
  "field",
  {
    base: {
      border: "1px solid #94a3b8",
      borderRadius: "8px",
      padding: "0.75rem",
      background: "#fff",
      color: "#0f172a",
      font: "inherit",
      width: "100%",
      transition: "border-color .15s ease, box-shadow .15s ease",
    },
    focus: {
      borderColor: "#0891b2",
      boxShadow: "0 0 0 3px #cffafe",
      outline: "0",
    },
  },
  { extends: "utility" },
);
// Inputs inherit the complete field style without adding new declarations.
Superiod.define("input", {}, { extends: "field" });

// Textareas inherit fields and add multiline-specific sizing behavior.
Superiod.define(
  "textarea",
  { base: { minHeight: "120px", resize: "vertical" } },
  { extends: "field" },
);

// Expose the main class globally when the library is loaded by a browser script.
if (typeof window !== "undefined") window.Superiod = Superiod;

// Expose the constructors when the library is loaded through CommonJS.
if (typeof module !== "undefined")
  module.exports = { Superiod, ButtonWidget, InputWidget, TextareaWidget };
