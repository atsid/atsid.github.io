#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

git remote add origin "https://$GH_TOKEN@github.com/atsid/atsid.github.io.git"

cd dist

git add -A
git commit -m "rebuild pages at ${rev}"
git push origin travis_temp
