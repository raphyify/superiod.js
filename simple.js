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

  button.on( "click", () => {
    button.setLabel( "You have clicked me!" );
    button.off( "click" );
  } );

  const buttonRendered = button.render();
  $app.appendChild( buttonRendered );
} ).catch( ( err ) => {
  console.error( "An error occurred:" + err );
} );
