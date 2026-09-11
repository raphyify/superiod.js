// The utility style contains declarations shared by every built-in widget.
Superiod.define( "utility", {
  base: { boxSizing: "border-box", fontFamily: "inherit" },
} );
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
Superiod.define( "input", {}, { extends: "field" } );

// Textareas inherit fields and add multiline-specific sizing behavior.
Superiod.define(
  "textarea",
  { base: { minHeight: "120px", resize: "vertical" } },
  { extends: "field" },
);


// Create a crimson button variant while preserving the shared button shape,
// spacing, typography, focus ring, and hover movement.
Superiod.define(
  "danger",
  {
    base: { background: "#be123c" },
    hover: { background: "#9f1239" },
  },
  { extends: "button" },
);
