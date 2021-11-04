# Full build with debuginfo for graph-node
#
# The expectation if that the docker build uses the parent directory as PWD
# by running something like the following
#   docker build --target STAGE -f docker/Dockerfile .

FROM rust:latest as graph-node-build

ARG COMMIT_SHA=unknown
ARG REPO_NAME=unknown
ARG BRANCH_NAME=unknown
ARG TAG_NAME=unknown

ADD . /graph-node

RUN cd /graph-node \
 && RUSTFLAGS="-g" cargo install --locked --path node \
 && cargo clean \
 && objcopy --only-keep-debug /usr/local/cargo/bin/graph-node /usr/local/cargo/bin/graph-node.debug \
 && strip -g /usr/local/cargo/bin/graph-node \
 && cd /usr/local/cargo/bin \
 && objcopy --add-gnu-debuglink=graph-node.debug graph-node \
 && echo "REPO_NAME='$REPO_NAME'" > /etc/image-info \
 && echo "TAG_NAME='$TAG_NAME'" >> /etc/image-info \
 && echo "BRANCH_NAME='$BRANCH_NAME'" >> /etc/image-info \
 && echo "COMMIT_SHA='$COMMIT_SHA'" >> /etc/image-info \
 && echo "CARGO_VERSION='$(cargo --version)'" >> /etc/image-info \
 && echo "RUST_VERSION='$(rustc --version)'" >> /etc/image-info

# The graph-node runtime image with only the executable
FROM debian:buster-slim as graph-node
ENV RUST_LOG ""
ENV GRAPH_LOG ""
ENV EARLY_LOG_CHUNK_SIZE ""
ENV ETHEREUM_RPC_PARALLEL_REQUESTS ""
ENV ETHEREUM_BLOCK_CHUNK_SIZE ""

ENV postgres_host ""
ENV postgres_user ""
ENV postgres_pass ""
ENV postgres_db ""
# The full URL to the IPFS node
ENV ipfs ""
# The etherum network(s) to connect to. Set this to a space-separated
# list of the networks where each entry has the form NAME:URL
ENV ethereum ""
# The role the node should have, one of index-node, query-node, or
# combined-node
ENV node_role "combined-node"
# The name of this node
ENV node_id "default"

# HTTP port
EXPOSE 8000
# WebSocket port
EXPOSE 8001
# JSON-RPC port
EXPOSE 8020

RUN apt-get update \
 && apt-get install -y libpq-dev ca-certificates netcat

ADD docker/wait_for docker/start /usr/local/bin/
COPY --from=graph-node-build /usr/local/cargo/bin/graph-node /usr/local/bin
COPY --from=graph-node-build /etc/image-info /etc/image-info
COPY docker/Dockerfile /Dockerfile
CMD start

# Debug image to access core dumps
FROM graph-node-build as graph-node-debug
RUN apt-get update \
 && apt-get install -y curl gdb postgresql-client

COPY docker/Dockerfile /Dockerfile
COPY docker/bin/* /usr/local/bin/
