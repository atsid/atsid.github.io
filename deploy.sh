#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

cd dist

git add -A
git commit -m "rebuild pages at ${rev}"
git push origin master
