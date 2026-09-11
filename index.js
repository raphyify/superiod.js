import "./superiod.demo.styles.js";

// Connect this browser demo to Superiod's declarations for editor hints.
/// <reference path="./superiod/superiod.d.ts" />
// Ask VS Code to type-check this JavaScript and provide inline diagnostics.
// @ts-check

// Find the page region where the form will become visible.
const app = document.querySelector( "#app" );
// Stop early instead of failing silently if the demo mount point is missing.
if ( !app ) throw new Error( 'Superiod demo requires an element with id "app".' );

// Create the form container that receives the responsive two-column layout.
const form = document.createElement( "form" );
// Apply the layout class that controls field and action spacing in the stylesheet.
form.className = "form-grid";

// Create a full-width input with the shared field border, padding, and focus style.
const nameInput = new InputWidget( {
  attributes: {
    // Give the field a stable form name without changing its appearance.
    name: "name",
    // Show a quiet inline prompt before the user enters a name.
    placeholder: "Your name",
    // Provide an accessible spoken label without adding visible text.
    "aria-label": "Your name",
  },
} );
// Create a second shared-style input configured for email entry.
const email = new InputWidget( {
  attributes: {
    // Identify the value when the form is submitted.
    name: "email",
    // Use the browser's email behavior while keeping the same visual treatment.
    type: "email",
    // Show the expected email format inside the field.
    placeholder: "you@example.com",
    // Keep the control understandable to assistive technology.
    "aria-label": "Email address",
  },
} );

// Create a taller multiline field that inherits the same input styling.
const message = new TextareaWidget( {
  attributes: {
    // Identify the message value for form submission.
    name: "message",
    // Give the empty textarea a conversational prompt.
    placeholder: "Tell us what you are building...",
    // Supply a non-visual accessible name for the textarea.
    "aria-label": "Message",
  },
} );
// Create the primary teal action button shown at the bottom of the form.
const send = new ButtonWidget( { label: "Send message", style: "button" } );
// Create a crimson reset button that visually signals a destructive action.
const clear = new ButtonWidget( {
  label: "Clear",
  style: "danger",
  // Make the browser reset the form when this button is activated.
  // attributes: { type: "reset" },
} );
clear.setType( "reset" );

// Create a neutral control used to demonstrate removing a widget event.
const disableSend = new ButtonWidget( {
  label: "Disable send",
  // Prevent this demonstration control from submitting the form.
  attributes: { type: "button" },
} );

/**
 * Adds a labeled Superiod widget to the demo form, creating the visible
 * caption-and-control arrangement used by every field.
 *
 * @param {string} label The visible field label.
 * @param {import("./superiod/superiod").Superiod} widget The widget to render.
 * @param {string} [className=""] An optional layout class.
 */
const addField = ( label, widget, className = "" ) => {
  // Use a label wrapper so the caption and control behave as one visual field.
  const wrapper = document.createElement( "label" );
  // Apply the field typography and any requested responsive layout variation.
  wrapper.className = `field ${ className }`;
  // Place the human-readable caption above the widget.
  wrapper.innerHTML = `<span>${ label }</span>`;
  // Render the styled input or textarea beneath its caption.
  wrapper.appendChild( widget.render() );
  // Add the completed field to the form's visible grid.
  form.appendChild( wrapper );
};

// Add the compact name field to the first grid column.
addField( "Name", nameInput );
// Add the compact email field beside the name field.
addField( "Email", email );
// Add the message field across the full grid width.
addField( "Message", message, "wide" );

// Create the action row that visually separates controls from form fields.
const actions = document.createElement( "div" );
// Stretch the action row across both grid columns.
actions.className = "actions wide";
// Render the primary button so its teal style and label are visible.
const sendElement = send.render();
// Render the event-demo button so its neutral button style is visible.
const disableSendElement = disableSend.render();
// Place the primary, destructive, and event-demo actions in one row.
actions.append( sendElement, clear.render(), disableSendElement );
// Add the action row to the visible form.
form.appendChild( actions );

/**
 * Handles the send button through Superiod's widget event API and replaces
 * its original label with visible success feedback.
 *
 * @param {Event} event The button click event.
 */
const handleSend = ( event ) => {
  // Keep the demo on the same page instead of navigating after submission.
  event.preventDefault();
  // Keep the widget's state aligned with the new visible button label.
  send.$label = "Message queued";
  // Show the queued state directly on the rendered button.
  sendElement.textContent = send.$label;
};

// Attach the queued-state behavior to the rendered send button.
send.on( "click", handleSend );
// Attach a control that demonstrates removing the send behavior at runtime.
disableSend.on( "click", () => {
  // Stop future clicks from changing the primary button label.
  send.off( "click", handleSend );
  // Make the removal action visible to the user.
  disableSendElement.textContent = "Send disabled";
  // Dim and deactivate the demonstration control through native button state.
  disableSendElement.setAttribute( "disabled", "" );
} );
// Mount the completed form so the styled demo appears on the page.
app.appendChild( form );
