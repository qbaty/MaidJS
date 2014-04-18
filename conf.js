//修改root就OK~
var root = 'e:/project/land/res';
var fs = require('fs');

module.exports = {
	package_js : root + '/scripts/micloudfe/package_js',
	package_css : root + '/css/micloudfe/package_css',
	srckey : {
		key : fs.readFileSync(root + '/scripts/micloudfe/tools/server.key'),
		cert : fs.readFileSync(root + '/scripts/micloudfe/tools/server.crt')
	},
	rewrite :  {
		'^/html/' : root + '/css/micloudfe/html/',
		'^/res/(.*/)?scripts/micloudfe/' : root + '/scripts/micloudfe/',
		'^/res/(.*/)?css/' : root + '/css/',
		'^/res/(.*/)?image/img/' : 'https://10.237.113.77/www/img/',
        '^/\/?img/' : 'https://10.237.113.77/www/img/',
        '^/demo/' : 'd:/project/polymer/'
		// '^/\/?img' : 'https://10.237.100.38/img',
		// '^/\/?imgp' : 'https://10.237.100.38/imgp',
		// '^\/' : 'e:/jquery/',
	},
	root : root
};