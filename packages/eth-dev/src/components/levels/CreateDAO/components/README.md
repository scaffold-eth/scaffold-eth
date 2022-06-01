The following smart contracts were taken from the OpenZeppelin library.
OpenZeppelin also provides a UI that allowes to easily cusotmize the DAO contracts to ones needs.

We will now go through the conttacts to better understand what is happening in the background.
Afterwards we'll build a ui using scaffold-eth to better interact with and vizualize the contracts.
We can use the governor creator ui from openzeppelin.
https://docs.openzeppelin.com/contracts/4.x/wizard

* openzeppelin contracts: https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v4.5
* openzeppelin/governance contracts: https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v4.5/contracts/governance

The top level MyGovernor.sol contract imports and inherits from 6 different contracts:
The `Governor.sol` contract and 5 extension contracts.

```solidity
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
```

We'll go through them one-by-one.
A far more detailed documentation can be found [here](https://docs.openzeppelin.com/contracts/4.x/api/governance).

## `Governor.sol`

The core contract of the governance system. It can be extendet by a selection of extensions
See https://docs.openzeppelin.com/contracts/4.x/api/governance for details on all functions.

## `GovernorSettings.sol`

Manages settings like voting delay, voting period duration, and proposal threshold. The settings are upgradable throughout the existance of the DAO.

### Functions

```solidity
constructor(initialVotingDelay, initialVotingPeriod, initialProposalThreshold)

votingDelay()

votingPeriod()

proposalThreshold()

setVotingDelay(newVotingDelay)

setVotingPeriod(newVotingPeriod)

setProposalThreshold(newProposalThreshold)

_setVotingDelay(newVotingDelay)

_setVotingPeriod(newVotingPeriod)

_setProposalThreshold(newProposalThreshold)
```

## `GovernorCountingSimple.sol`

Implements the voting mechanism. Voters can choose between four types of votes: Against, For and Abstain.

### Functions

```solidity
COUNTING_MODE()

hasVoted(proposalId, account)

proposalVotes(proposalId)

_quorumReached(proposalId)

_voteSucceeded(proposalId)

_countVote(proposalId, account, support, weight)
```

## `GovernorVotes.sol`

For getting weighted votes from an ERC20 token.

### Functions

```solidity
constructor(tokenAddress)

getVotes(account, blockNumber)
```

## `GovernorVotesQuorumFraction.sol`

Implements a quorum as a fraction of the total token supply.

### Functions

```solidity
constructor(quorumNumeratorValue)

quorumNumerator()

quorumDenominator()

quorum(blockNumber)

updateQuorumNumerator(newQuorumNumerator)

_updateQuorumNumerator(newQuorumNumerator)
```

## `GovernorTimelockControl.sol`

Adds a delay to all successfull proposals. Gives DAO owners time to react if a malicious proposal was voted upon and passed.

### Functions

```solidity
constructor(timelockAddress)

supportsInterface(interfaceId)

state(proposalId)

timelock()

proposalEta(proposalId)

queue(targets, values, calldatas, descriptionHash)

_execute(_, targets, values, calldatas, descriptionHash)

_cancel(targets, values, calldatas, descriptionHash)

_executor()

updateTimelock(newTimelock)
```
