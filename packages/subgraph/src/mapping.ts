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
        field.player = null;
        field.tokenAmountToCollect = BigInt.fromI32(0);
        field.healthAmountToCollect = BigInt.fromI32(0);
      } else {
        // clean player data
        field.player = null;
        field.tokenAmountToCollect = BigInt.fromI32(0);
        field.healthAmountToCollect = BigInt.fromI32(0);
      }
      field.save();
    }
  }
}

export function handleRegister(event: Register): void {
  let playerString = event.params.txOrigin.toHexString();

  let player = Player.load(playerString);

  if (player === null) {
    player = new Player(playerString);
    player.address = event.params.txOrigin;
  }

  player.fancyLoogieId = event.params.loogieId;
  player.health = BigInt.fromI32(500);
  player.token = BigInt.fromI32(0);
  player.x = event.params.x;
  player.y = event.params.y;
  player.createdAt = event.block.timestamp;
  player.transactionHash = event.transaction.hash.toHex();
  player.save();

  const fieldId = event.params.x.toString() + "-" + event.params.y.toString();
  let field = WorldMatrix.load(fieldId);
  if (field !== null) {
    field.player = playerString;
    field.save();
  }
}

export function handleMove(event: Move): void {
  let playerString = event.params.txOrigin.toHexString();

  let player = Player.load(playerString);

  if (player !== null) {
    const oldX = player.x;
    const oldY = player.y;

    const oldFieldId = oldX.toString() + "-" + oldY.toString();
    let oldField = WorldMatrix.load(oldFieldId);
    if (oldField !== null) {
      oldField.player = null;
      oldField.save();
    }

    player.health = event.params.health;
    player.x = event.params.x;
    player.y = event.params.y;
    player.save();

    const fieldId = event.params.x.toString() + "-" + event.params.y.toString();
    let field = WorldMatrix.load(fieldId);
    if (field !== null) {
      field.player = playerString;
      field.save();
    }
  }
}

export function handleCollectedTokens(event: CollectedTokens): void {
  let playerString = event.params.player.toHexString();

  let player = Player.load(playerString);
  if (player !== null) {
    player.token = player.token.plus(event.params.amount);
    player.save();

    const fieldId = player.x.toString() + "-" + player.y.toString();
    let field = WorldMatrix.load(fieldId);
    if (field !== null) {
      field.tokenAmountToCollect = BigInt.fromI32(0);
      field.save();
    }
  }
}

export function handleCollectedHealth(event: CollectedHealth): void {
  let playerString = event.params.player.toHexString();

  let player = Player.load(playerString);
  if (player !== null) {
    player.health = player.health.plus(event.params.amount);
    player.save();

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



