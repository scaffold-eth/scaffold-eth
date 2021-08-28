# zk-poker (most simplified version:smile:)

## :game_die: Brief Synopsis:
We used to zk-proof to build a scaffold of any card game. Namely, with our protocol, we can keep the player's card private throughout the game and prove that the card is randomly drawn and that the player indeed holds the card. We also allow a comparison of the player's and the dealer's card without revealing the player's card.

## :game_die: Game Rules:
step 1: player randomly draws a private card

step 2: player commits a bet

step 3: dealer randomly draws a card

step 4: player wins the bet amount if their card is (greater than or equal to) the dealer’s and loses the bet amount otherwise

## :game_die: General Description of our Protocol:
Instead of directly publishing a private card, the player will publish a commitment to the card, or a hash of the card. and a zk-proof associated with the card proving that the hash does correpond to the correct private card.

The randomness is ensured by combining a private randomness commited by the player at the begining and a public randomness. In this way, the player can't bias his card.

Next, the player commits a bet and another zk-proof showing whether his card is greater or smaller than the dealer card without revealing his own card value.

![image](https://user-images.githubusercontent.com/71540484/131203355-72745a79-5b80-4694-8ded-43a9cc9692dd.png)
