//修改root就OK~
var root = 'e:/project/land/res';
var fs = require('fs');

module.exports = {
	package_js : root + '/scripts/micloudfe/package_js',
	package_css : root + '/scripts/micloudfe/package_css',
	srckey : {
		key : fs.readFileSync(root + '/scripts/micloudfe/tools/server.key'),
		cert : fs.readFileSync(root + '/scripts/micloudfe/tools/server.crt')
	},
	rewrite :  {
		'^/res/(.*/)?scripts/micloudfe/' : root + '/scripts/micloudfe/',
		'^/res/(.*/)?css/' : root + '/css/',
		'^/\/?img' : 'https://10.237.100.38/img',
		'^/\/?imgp' : 'https://10.237.100.38/imgp'
	},
	root : root
};