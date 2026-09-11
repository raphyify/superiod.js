// Connect this browser demo to Superiod's declarations for editor hints.
/// <reference path="./superiod/superiod.d.ts" />
// Ask VS Code to type-check this JavaScript and provide inline diagnostics.
// @ts-check

const $app = document.querySelector("#app");
if (!$app) throw new Error('Superiod demo requires an element with id "app".');

const button = new ButtonWidget({
  label: "Click me!",
  style: "button",
});

const buttonRendered = button.render();

button.on("click", () => {
  buttonRendered.textContent = "You have clicked me!";

  button.off("click");
});

$app.appendChild(buttonRendered);
