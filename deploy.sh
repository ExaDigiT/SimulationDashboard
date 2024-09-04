#!/bin/bash
set -e

SCRIPT_DIR=$(realpath $(dirname "${BASH_SOURCE[0]}"))
cd "$SCRIPT_DIR"

set -o allexport
source .env.production
set +o allexport

docker build -t $DOCKER_REGISTRY:latest .
docker push $DOCKER_REGISTRY:latest
# Get fully qualified image name
DOCKER_IMAGE=$(docker inspect --format='{{index .RepoDigests 0}}' $DOCKER_REGISTRY:latest)

oc process -f ./deployment.yaml -o yaml --param=IMAGE="$DOCKER_IMAGE" --param=NAMESPACE="$K8S_NAMESPACE" | oc apply -f -
