# L2 / Sidechain Services

## About Scaffold-eth Services

`/services` is a new \(!\) scaffold-eth package that pulls in backend services that you might need for local development, or even for production deployment.

Scaffold-eth uses [submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to pull in other repositories. These first need to be initiated.

```text
yarn workspace @scaffold-eth/services submodule-init
```

## Arbitrum

[Arbitrum](https://developer.offchainlabs.com/docs/developer_quickstart) is an Optimistic Rollup. This submodule \(of the [Arbitrum monorepo](https://github.com/OffchainLabs/arbitrum)\) runs a local chain, with an optimistic rollup.

To run the local setup...

{% hint style="info" %}
[Requires Docker](https://www.docker.com/products/docker-desktop)
{% endhint %}

In one terminal:

```text
yarn workspace @scaffold-eth/services arbitrum-init
yarn workspace @scaffold-eth/services arbitrum-build-l1
yarn workspace @scaffold-eth/services arbitrum-run-l1
```

In a second terminal:

```text
yarn workspace @scaffold-eth/services arbitrum-init-l2
yarn workspace @scaffold-eth/services arbitrum-run-l2
```

{% hint style="info" %}
 The first time may take a while as the services build!
{% endhint %}

To stop the processes, you can just run CTRL-C.

The local L1 and the Rollup are configured in both `/hardhat` and `/react-app` as `localArbitrum` and `localArbitrumL1`, so you can deploy and build out of the box!

{% hint style="success" %}
Learn more about building on Arbitrum [here](https://developer.offchainlabs.com/docs/developer_quickstart).
{% endhint %}

## Optimism

[optimism.io](https://optimism.io/) is an Optimistic Rollup. This submodule \(of the [Optimism monorepo](https://github.com/ethereum-optimism/optimism)\) runs a local chain, with an optimistic rollup.

To run the local setup, do the following:

{% hint style="info" %}
[Requires Docker](https://www.docker.com/products/docker-desktop)
{% endhint %}

```text
yarn workspace @scaffold-eth/services run-optimism
```

{% hint style="info" %}
The first time may take a while as the services build!
{% endhint %}

The underlying services are run in the background, so you won't see anything in the terminal, but you can use Docker Desktop to inspect them.

You can stop local optimism at any time by running:

```text
yarn workspace @scaffold-eth/services stop-optimism
```

The local L1 and the Rollup are configured in both `/hardhat` and `/react-app` as `localOptimism` and `localOptimismL1`, so you can deploy and build out of the box!

{% hint style="success" %}
Learn more about building on Optimism [here](https://community.optimism.io/docs/).
{% endhint %}

## Graph Node

`graph-node` lets you [run a node locally](https://thegraph.com/docs/quick-start#local-development).

```text
run-graph-node // runs the graph node
remove-graph-node // stops the graph node
clean-graph-node // clears the local data
```

