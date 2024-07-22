#!/bin/bash
SCRIPT_DIR=$(realpath $(dirname "${BASH_SOURCE[0]}"))
cd "$SCRIPT_DIR"

set -o allexport
source deploy.env
set +o allexport

docker build -t $DOCKER_REGISTRY --build-arg VITE_BASE_PATH=$VITE_BASE_PATH . &&
docker push $DOCKER_REGISTRY &&
# Scale down so pod gets recreated and uses new image
oc --namespace stf218-app scale deploy -l app=exadigit-simulation-dashboard --replicas=0

oc process -f ./deployment.yaml -o yaml --param=DASHBOARD_IMAGE="$DOCKER_REGISTRY" | oc apply -f -
