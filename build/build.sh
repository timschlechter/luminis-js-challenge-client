# Compile LESS files to CSS
../node_modules/less/bin/lessc ../app/styles/styles.less > ../app/css/styles.css

# Minify CSS
../node_modules/uglifycss/uglifycss ../app/css/styles.css > ../app/css/styles.min.css