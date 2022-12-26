import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  Restart,
  Register,
  Move,
  CollectedTokens,
  CollectedHealth,
  NewDrop,
} from "../generated/Game/Game";
import { WorldMatrix, Player } from "../generated/schema";

export function handleRestart(event: Restart): void {
  for (let i=0; i<event.params.width; i++) {
    for (let j=0; j<event.params.height; j++) {
      const fieldId = i.toString() + "-" + j.toString();
      let field = WorldMatrix.load(fieldId);
      if (field === null) {
        field = new WorldMatrix(fieldId);
        field.x = i;
        field.y = j;
        field.player1 = null;
        field.player2 = null;
        field.tokenAmountToCollect = BigInt.fromI32(0);
        field.healthAmountToCollect = BigInt.fromI32(0);
      } else {
        // clean player data
        field.player1 = null;
        field.player2 = null;
        field.tokenAmountToCollect = BigInt.fromI32(0);
        field.healthAmountToCollect = BigInt.fromI32(0);
      }
      field.save();
    }
  }
}

export function handleRegister(event: Register): void {
  let playerString = event.params.nftId.toHexString();

  let player = Player.load(playerString);

  if (player === null) {
    player = new Player(playerString);
    player.address = event.params.txOrigin;
  }

  player.nftId = event.params.nftId;
  player.x = event.params.x;
  player.y = event.params.y;
  player.coins = BigInt.fromI32(0);
  player.createdAt = event.block.timestamp;
  player.lastSeenAt = event.block.timestamp;
  player.transactionHash = event.transaction.hash.toHex();
  player.save();

  const fieldId = event.params.x.toString() + "-" + event.params.y.toString();
  let field = WorldMatrix.load(fieldId);
  if (field !== null) {
    if (field.player1 === null) {
      field.player1 = playerString;
    } else {
      field.player2 = playerString;
    }
    field.save();
  }
}

export function handleMove(event: Move): void {
  let playerString = event.params.nftId.toHexString();

  let player = Player.load(playerString);

  if (player !== null) {
    const oldX = player.x;
    const oldY = player.y;

    const oldFieldId = oldX.toString() + "-" + oldY.toString();
    let oldField = WorldMatrix.load(oldFieldId);
    if (oldField !== null) {
      if (oldField.player1 == playerString) {
        oldField.player1 = null;
      } else {
        oldField.player2 = null;
      }
      oldField.save();
    }

    player.x = event.params.x;
    player.y = event.params.y;
    player.save();

    const fieldId = event.params.x.toString() + "-" + event.params.y.toString();
    let field = WorldMatrix.load(fieldId);
    if (field !== null) {
      if (field.player1 === null) {
        field.player1 = playerString;
      } else {
        field.player2 = playerString;
      }
      field.save();
    }
  }
}

export function handleCollectedTokens(event: CollectedTokens): void {
  let playerString = event.params.nftId.toHexString();

  let player = Player.load(playerString);
  if (player !== null) {

    const fieldId = player.x.toString() + "-" + player.y.toString();
    let field = WorldMatrix.load(fieldId);
    if (field !== null) {
      field.tokenAmountToCollect = BigInt.fromI32(0);
      field.save();
    }
  }
}

export function handleCollectedHealth(event: CollectedHealth): void {
  let playerString = event.params.nftId.toHexString();

  let player = Player.load(playerString);
  if (player !== null) {

    const fieldId = player.x.toString() + "-" + player.y.toString();
    let field = WorldMatrix.load(fieldId);
    if (field !== null) {
      field.healthAmountToCollect = BigInt.fromI32(0);
      field.save();
    }
  }
}

export function handleNewDrop(event: NewDrop): void {
  const fieldId = event.params.x.toString() + "-" + event.params.y.toString();
  let field = WorldMatrix.load(fieldId);
  if (field !== null) {
    if (event.params.isHealth) {
      field.healthAmountToCollect = field.healthAmountToCollect.plus(event.params.amount);
    } else {
      field.tokenAmountToCollect = field.tokenAmountToCollect.plus(event.params.amount);
    }
    field.save();
  }
}



