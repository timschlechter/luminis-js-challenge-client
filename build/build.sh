# install node packages
cd ..
npm install
cd build

rm -rf ../app/assets
mkdir ../app/assets

mkdir ../app/assets/js
mkdir ../app/assets/css
mkdir ../app/assets/img

# Compile LESS files to CSS
../node_modules/less/bin/lessc ../app/styles/styles.less >> ../app/assets/css/styles.css

# Minify CSS
../node_modules/uglifycss/uglifycss ../app/lib/bootstrap/css/bootstrap.min.css >> ../app/assets/css/styles.min.css
../node_modules/uglifycss/uglifycss ../app/lib/bootstrap/css/bootstrap-responsive.min.css >> ../app/assets/css/styles.min.css
../node_modules/uglifycss/uglifycss ../app/assets/css/styles.css >> ../app/assets/css/styles.min.css

# Minify JS
cat ../app/lib/jquery-1.9.1.min.js >> ../app/assets/js/chatapp.js
cat ../app/lib/lodash.min.js >> ../app/assets/js/chatapp.js
cat ../app/lib/angular/angular.min.js >> ../app/assets/js/chatapp.js
cat ../app/lib/bootstrap/js/bootstrap.min.js >> ../app/assets/js/chatapp.js
cat ../app/lib/socket.io.js >> ../app/assets/js/chatapp.js

cat ../app/js/*.js >> ../app/assets/js/chatapp.js
cat ../app/js/**/*.js >> ../app/assets/js/chatapp.js

../node_modules/uglify-js/bin/uglifyjs ../app/assets/js/chatapp.js >> ../app/assets/js/chatapp.min.js

# Copy images
cp -R ../app/lib/bootstrap/img ../app/assets

# Create Javascript documentation
../node_modules/yuidocjs/lib/cli.js ../app/js -o ../app/assets/docs