# Brainstorming on how to code chapters

## The plan

- we put state of which windows are open open in top app controller
- we have a window component
- we create folders for different chapters with their own redux state

- boxed off state inside chapter folders for each chapter
- one global app state for shared game state and some actions that all chapters need
  - `activeChapter<chapterId>`
  - `visibleWindows[chapterId][windowId]`

- we create views and controllers for different window contents
- we have some global actions that allow us to controll overall attributes of the game (e.g setting the game background, starting a chapter, actions that trigger the next game step of a chapter)
- we can set checks that need to return true or otherwise the nextStep() action fails

- we call `openWindow` from within chapter components

## What we need

```javascript
  openWindow()
  closeWindow()

  changeDialog() or appendDialog()
  nextStepInDialog()
  gotToSpecificStepInDialog()

  setBackground()
  triggerAnimation()
```

### openWindow + closeWindow

```javascript
  const visibleWindows = []
  visibleWindows.add('DialogWindow')
  visibleWindows.add('CodeTokenContract')
  visibleWindows.remove('Intro')
```

```javascript

```
