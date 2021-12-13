#!/bin/bash

if [ "$1" = "start" ]; then
  # Run Docker container
  # to run the frontend on a different port add the "-e PORT=8080" parameter and change "-p 8080:8080" one.
  docker restart SCAFFOLD_ETH || docker run \
    --name SCAFFOLD_ETH \
    -v `pwd`:/opt/scaffold-eth \
    -w /opt/scaffold-eth \
    -p 3000:3000 \
    -p 8545:8545 \
    -dt node:16

  docker exec -ti SCAFFOLD_ETH bash -c "yarn install"
  docker exec -dt SCAFFOLD_ETH bash -c "yarn chain"
  sleep 5
  docker exec -ti SCAFFOLD_ETH bash -c "yarn deploy"
  docker exec -dt SCAFFOLD_ETH bash -c "yarn start"
else
  if [ "$1" = "deploy" ]; then
    docker exec -ti SCAFFOLD_ETH bash -c "yarn deploy"
  else
    echo "Invalid command. Choose 'start' or 'deploy'."
  fi
fi


