#!/bin/bash

DOCKER_IMAGE=$(docker ps --filter name=SCAFFOLD_ETH -q)

if [ "$1" = "start" ]; then
  # Run Docker container
  # to run the frontend on a different port add the "-e PORT=8080" parameter and change "-p 8080:8080" one.
  [ -z "$DOCKER_IMAGE" ] && docker run \
    --name SCAFFOLD_ETH \
    -v `pwd`:/opt/scaffold-eth \
    -w /opt/scaffold-eth \
    -p 3000:3000 \
    -p 8545:8545 \
    -dt node:16 || docker restart SCAFFOLD_ETH

  docker exec -ti SCAFFOLD_ETH bash -c "yarn install"
  docker exec -dt SCAFFOLD_ETH bash -c "yarn chain"
  sleep 5
  docker exec -ti SCAFFOLD_ETH bash -c "yarn deploy"
  docker exec -dt SCAFFOLD_ETH bash -c "yarn start"
else
  if [ "$1" = "deploy" ]; then
    [ -z "$DOCKER_IMAGE" ] && echo "Container does not exist. Run the script with 'start' before running it with the 'deploy' option." \
      || docker exec -ti SCAFFOLD_ETH bash -c "yarn deploy"
  else
    echo "Invalid command. Choose 'start' or 'deploy'."
  fi
fi


