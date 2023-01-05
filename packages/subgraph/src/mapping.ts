import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  Register,
  Move,
  CollectedTokens,
  CollectedHealth,
  NewDrop,
} from "../generated/EmotilonBoardGame/EmotilonBoardGame";
import { Player, Token, Health } from "../generated/schema";

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
  player.fighterStats = event.params.fighterStats;
  player.opponentStats = event.params.opponentStats;
  player.createdAt = event.block.timestamp;
  player.lastSeenAt = event.block.timestamp;
  player.transactionHash = event.transaction.hash.toHex();
  player.save();
}

export function handleMove(event: Move): void {
  let playerString = event.params.nftId.toHexString();

  let player = Player.load(playerString);

  if (player !== null) {
    player.x = event.params.x;
    player.y = event.params.y;
    player.save();
  }
}

export function handleCollectedTokens(event: CollectedTokens): void {
  const fieldId = event.params.x.toString() + "-" + event.params.y.toString();

  let token = Token.load(fieldId);
  if (token !== null) {
    // TODO: unset
    token.amount = BigInt.fromI32(0);
    token.save();
  }
}

export function handleCollectedHealth(event: CollectedHealth): void {
  const fieldId = event.params.x.toString() + "-" + event.params.y.toString();

  let health = Health.load(fieldId);
  if (health !== null) {
    // TODO: unset
    health.amount = BigInt.fromI32(0);
    health.save();
  }
}

export function handleNewDrop(event: NewDrop): void {
  const fieldId = event.params.x.toString() + "-" + event.params.y.toString();
  if (event.params.isHealth) {
    let field = Health.load(fieldId);
    if (!field) {
      field = new Health(fieldId);
      field.x = event.params.x;
      field.y = event.params.y;
      field.amount = BigInt.fromI32(0);
    }
    field.amount = field.amount.plus(event.params.amount);
    field.save();
  } else {
    let field = Token.load(fieldId);
    if (!field) {
      field = new Token(fieldId);
      field.x = event.params.x;
      field.y = event.params.y;
      field.amount = BigInt.fromI32(0);
    }
    field.amount = field.amount.plus(event.params.amount);
    field.save();
  }
}
