mkdir .dist -p
# npx webpack

cd action
npx tsc --build .
cd ..

cd page
npx tsc --build .
cd ..

cd service_worker
npx tsc --build .
cd ..

cp manifest.json ./.dist/manifest.json
cp ./action/popup.html ./.dist/action/popup.html
cp ./page/page.html ./.dist/page/page.html