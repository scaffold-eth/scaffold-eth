#!/bin/bash

cd /opt/scaffold-eth

# Run chain in the background
yarn chain &

# Deploy contracts
yarn deploy

# Start front-end
yarn start
