#!/bin/bash

git pull
yarn upgrade --latest
npm run test -- --watchAll=false
git add -- package.json yarn.lock
git commit -m "Bump packages"
git push origin