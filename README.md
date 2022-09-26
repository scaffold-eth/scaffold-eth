# 🏗 eth.dev

> a gamified experience that takes a developer through learning how to build on Ethereum

![image](https://user-images.githubusercontent.com/2653167/169709929-97eafba7-db88-48ac-9041-1cca4b088d0b.png)

## Installing

```bash
git clone https://github.com/scaffold-eth/scaffold-eth -b eth-dev eth-dev
cd eth-dev
yarn install
```

## Start the game

```bash
# 1. Terminal
# start local chain
$ yarn
$ yarn chain

# 2. Terminal
# start eth.dev app
$ yarn start
```

## Create a new level

The different game levels are located at `packages/eth-dev-src/components/levels/`.

To add a new level duplicate one of the level folders.

Then do a find+replace using the folder name of the level you copied and replace all occurances with your new level name.
It is important that you respect upper and lower cases!

📽 [Watch Soren demonstrate level building](https://www.youtube.com/watch?v=31jb97uxEQ8&t=99s)

Check out the ExempleLevel(http://localhost:3000/examplelevel) for a quickstart on the basic eth.dev functionality!

## Build & surge

After creating a `build` you need to do a small hack to get `react-router` routes to work.
Take a look the instructions [here](https://barcelonacodeschool.com/how-to-make-react-router-work-on-surge).
Simply make a copy of the `index.html` file in the build folder and name the copy `200.html`.
