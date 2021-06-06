# Level Template

## How to create a new level

1) Duplicate this folder and give it the name of your new level
2) Inside the new level folder search for `__templateLevel__` and replace all occurrences with the name of the new level (eg. `__templateLevel__` -> `myNewLevel`)
3) Export the level in `App/views/levels/index.js`

### NOTE

For development one should set the initial level to the level one is currently working on:

* in `src/views/App/containers/level/controller/redux.js` update `const initialLevel = LEVELS.__templateLevel__`
