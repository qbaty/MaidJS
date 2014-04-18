// var core = require('./component/core.js');
// var evt = require('./component/event.js');
// var log = require(./'component/log.js');

function maidjs(){
	this.init();

	return this;
}

maidjs.log = function(str){
	if(this.debug){
		return console.log(str);
	}else{
		// log(str);
	}
};

maidjs.init = function(){
	this.cDate = new Date();
	this.debug = true;
	this.ipAddress = '127.0.0.1';
	
	return this;
};

maidjs.load = function(){
	this.startDate = new Date();
	this.loadConf();
	this.createServer();

	return this;
};

maidjs.exit = function(){
	this.endDate = new Date();
	this.endServer();
};

maidjs.loadConf = function(){
	console.log('loadConf');
	this.conf = require('./confReader.js').scan();

};

maidjs.createServer = function(){
	console.log('createServer');
};

maidjs.endServer = function(){
	console.log('endServer');
};

module.exports = maidjs;