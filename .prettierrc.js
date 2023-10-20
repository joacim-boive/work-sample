/*
Using a .prettierrc.js file instead of .prettierrc so that we can place comments in the file.

The same settings also exists in .eslintrc.json. It was the only way I could get the quotes to work like below, otherwise settings was ignored.

This file still needs to exist because other tools, like VSCode, use it to determine the settings.

With the prettier plugin installed and Prettier set as default formatter it should format the code on save.
https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

*/

module.exports = {
  // Note: Duplicate settings exist in .eslintrc.json that ESLint uses instead.
  singleQuote: true,
  jsxSingleQuote: false,
};
