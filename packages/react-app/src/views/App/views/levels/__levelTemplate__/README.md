# Level Template

## How to implement a new level

1) Duplicate this folder and give it the name of your new level
2) Search for `__templateLevel__` and replace all occurrences with the name of the new level
3) Add the level name to `src/views/App/containers/level/model/levels.js`
4) Import new level reducer into the rootReducer at `react-app/src/redux/rootReducer`
5) Import new level into `src/views/App/containers/level/views/levelContents/index.js`
6) Import new level into `src/views/App/Terminal/views/DialogContainer/index.jsx` (2 changes necessary)
7) Import new level into `src/views/App/Terminal/views/DialogContainer/levelContents/index.jsx`
8) Import the level dialog into `src/views/App/containers/dialogs/model/dialogMap.js`

9) For development one should set the initial level to the level one is currently working on:
   -> in `src/views/App/containers/level/controller/redux.js` update path of `import initialDialog from '../../../views/levels/underflow/model/dialog'`
