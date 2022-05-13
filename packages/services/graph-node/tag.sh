#! /bin/bash

# This script is used by cloud build to push Docker images into Docker hub

tag_and_push() {
    tag=$1
    docker tag gcr.io/$PROJECT_ID/graph-node:$SHORT_SHA \
           graphprotocol/graph-node:$tag
    docker push graphprotocol/graph-node:$tag

    docker tag gcr.io/$PROJECT_ID/graph-node-debug:$SHORT_SHA \
           graphprotocol/graph-node-debug:$tag
    docker push graphprotocol/graph-node-debug:$tag
}

echo "Logging into Docker Hub"
echo $PASSWORD | docker login --username="$DOCKER_HUB_USER" --password-stdin

set -ex

tag_and_push "$SHORT_SHA"

# Builds on the master branch become the 'latest'
[ "$BRANCH_NAME" = master ] && tag_and_push latest
# Builds of tags set the tag in Docker Hub, too
[ -n "$TAG_NAME" ] && tag_and_push "$TAG_NAME"

exit 0
