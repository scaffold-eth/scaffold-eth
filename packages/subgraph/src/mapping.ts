import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  Fishing,
  Withdraw,
} from "../generated/SailorLoogiesGame/SailorLoogiesGame";
import { FishingLog, Ranking, Prize } from "../generated/schema";

export function handleFishing(event: Fishing): void {
  let fishing = new FishingLog(
    event.params.id.toString() + "-" +
    event.params.week.toString() + "-" +
    event.params.day.toString() + "-" +
    event.params.round.toString()
  );

  fishing.shipId = event.params.id;
  fishing.week = event.params.week;
  fishing.day = event.params.day;
  fishing.reward = event.params.reward;
  fishing.owner = event.params.owner;
  fishing.round = event.params.round;
  fishing.createdAt = event.block.timestamp;
  fishing.transactionHash = event.transaction.hash.toHex();
  fishing.save();

  const rankingId = event.params.week.toString() + "-" + event.params.id.toString();

  let ranking = Ranking.load(rankingId);

  if (ranking === null) {
    ranking = new Ranking(rankingId);
    ranking.week = event.params.week;
    ranking.shipId = event.params.id;
    ranking.reward = event.params.reward;
    ranking.owner = event.params.owner;
  } else {
    ranking.reward = ranking.reward.plus(event.params.reward);
  }

  ranking.save();
}

export function handleWithdraw(event: Withdraw): void {
  let prize = new Prize(event.params.week.toString());

  prize.winner = event.params.winner;
  prize.shipId = event.params.shipId;
  prize.week = event.params.week;
  prize.rewardNftId = event.params.rewardNftId;
  prize.createdAt = event.block.timestamp;
  prize.transactionHash = event.transaction.hash.toHex();
  prize.save();
}
