#!/bin/env node

mkdir dist -p

cd action
npx tsc
cd ..

cd page
npx tsc
cd ..

cd service_worker
npx tsc
cd ..

cp manifest.json ./dist/manifest.json
cp ./action/popup.html ./dist/action/popup.html
cp ./page/page.html ./dist/page/page.html