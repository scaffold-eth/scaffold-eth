#!/bin/bash

# Run Docker container
# to run the frontend on a different port add the "-e PORT=8080" parameter and change "-p 8080:8080" one.
docker run --name SCAFFOLD_ETH -p 3000:3000 -p 8545:8545 -dt scaffold-eth
