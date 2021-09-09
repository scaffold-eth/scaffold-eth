# The Graph

[The Graph](https://thegraph.com/docs/introduction) lets you process on-chain events to create a Subgraph, an easy to query graphQL endpoint!

scaffold-eth comes with a built in demo subgraph, as well as a local docker setup to run a graph-node locally.

A 15-minutes speedrun on how to integrate The Graph

{% embed url="https://youtu.be/T5ylzOTkn-Q" %}

{% hint style="warning" %}
[Requires Docker](https://www.docker.com/products/docker-desktop) 
{% endhint %}

**Step 1: Clean up previous data:**

```text
yarn clean-graph-node
```

**Step 2: Spin up a local graph node by running**

```text
yarn run-graph-node
```

**Step 3: Create your local subgraph by running**

```text
yarn graph-create-local
```

{% hint style="info" %}
This is only required once!
{% endhint %}

**Step 4: Deploy your local subgraph by running**

```text
yarn graph-ship-local
```

**Step 5: Edit your local subgraph in `packages/subgraph/src`**

Learn more about subgraph definition [here](https://thegraph.com/docs/define-a-subgraph)

**Step 6: Deploy your contracts and your subgraph in one go by running:**

```text
yarn deploy-and-graph
```

