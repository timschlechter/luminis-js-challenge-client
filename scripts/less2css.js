var less = require('less'),
    fs = require('fs'),
    path = require('path');

var outputdir = '../app/css';

// ensure output dir exists
var existsSync = fs.existsSync || path.existsSync;
if (!existsSync(outputdir))
	fs.mkdirSync(outputdir);

fs.readFile('../app/styles/bootstrap.custom.less',function(error,data){


	data = data.toString();
	less.render(data, function(e, css) {
		fs.writeFile('../app/css/styles.css', css, function(err) {
				if (err)
					console.log(err);
			});
	});
});