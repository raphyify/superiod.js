import "./superiod.demo.styles.js";

// Connect this browser demo to Superiod's declarations for editor hints.
/// <reference path="./superiod/superiod.d.ts" />
// Ask VS Code to type-check this JavaScript and provide inline diagnostics.
// @ts-check

Superiod.importScript( "./sample.js" );
Superiod.afterScriptLoad( "simple-demo", () => {
  const $app = document.querySelector( "#app" );
  if ( !$app )
    throw new Error( 'Superiod demo requires an element with id "app".' );

  const button = new ButtonWidget( {
    label: "Click me!",
    style: "button",
  } );
  button.$suppressUsageWarning = true;
  button.setValue( "I'm a button!" ).setLabel( "I'm a button!" );

  const input = new InputWidget( {
    // value: "Input",
    // label: "Input",
    type: "text",
  } );
  // input.$suppressUsageWarning = true;
  input.setLabel( 'Type in your mind here...' ).setValue( 'Type in your mind here...' );
  input.setType( "text" );

  button.on( "click", () => {
    button.setLabel( "You have clicked me!" );
    button.off( "click" );
  } );

  const buttonRendered = button.render();
  $app.append( buttonRendered, input.render() );
} ).catch( ( err ) => {
  console.error( "An error occurred:" + err );
} );
