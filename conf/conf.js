module.exports = {

	//micloud project
	micloud : {
		domain : ['land.xiaomi.net', 'i.xiaomi.com'],

		root : 'e:/project/land/res',

		//rewrite rules
		rewrite : {
			'^/res/(.*/)?scripts/micloudfe/' : '/scripts/micloudfe/',
			'^/res/(.*/)?css/' : '/css/',
			'^/\/?img' : 'https://10.237.100.38/img',
			'^/\/?imgp' : 'https://10.237.100.38/imgp'
		},

		//default || false 
		isCombine : true,

		//default || false
		isCompress : true,

		//https optional
		https : true,

		//srckey optional
		srckey : {
			key : '/scripts/micloudfe/tools/server.key',
			cert : '/scripts/micloudfe/tools/server.crt'
		},

		//packinfo
		pack : {
			js : '/scripts/micloudfe/package_js',
			css : '/scripts/micloudfe/package_css'
		}
	},

	//vip project
	vip : {}
};