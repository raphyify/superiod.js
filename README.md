# Superiod.js
Superiod is a lightweight, composable UI library for vanilla JavaScript. It provides reusable widgets, style registration, dynamic script loading, event handling, and simple API utilities without requiring a framework. [Visit the Wiki](https://github.com/raphyify/superiod.js/wiki) for a clear and precise tutorial.

## Features

- Built-in Reusable `ButtonWidget`, `InputWidget`, and `TextareaWidget` components
- Centralized style definitions with inheritance and extension
- Automatic style injection
- Browser-native ES module support
- Dynamic script loading with `Superiod.importScript()`
- Script lifecycle handling with `Superiod.afterScriptLoad()`
- Simple event management through `.on()` and `.off()`
- Lightweight API client utilities
- TypeScript declarations included
- No build step required

## Example

```html
<script type="module" src="./superiod/superiod.js"></script>
```

```js
const button = new ButtonWidget( {
  label: "Click me",
  style: "button",
} );

button.on( "click", () => {
  button.setLabel( "Clicked!" );
} );

document.querySelector( "#app" ).appendChild( button.render() );
```

## Dynamic Script Loading

```js
Superiod.importScript( "./sample.js" )
  .then( () => {
    console.log( "The script has finished loading." );
  } )
  .catch( ( error ) => {
    console.error( error );
  } );
```

## Styling

```js
Superiod.define( "primary-button", {
  base: {
    backgroundColor: "teal",
    color: "white",
    padding: "0.75rem 1rem",
  },
} );
```
