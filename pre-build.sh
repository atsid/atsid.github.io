#!/bin/bash

set -o errexit -o nounset

rm -rf dist
mkdir dist
cd dist

git init
git config user.name "Chris Leach"
git config user.email "chris.leach@atsid.com"

git remote add origin "https://$GH_TOKEN@github.com/atsid/atsid.github.io.git"
git pull origin master
cd ..
