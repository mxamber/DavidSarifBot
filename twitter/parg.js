/* PARG - Parsing Arguments, Returning Goodies */

module.exports = {
	parg: function(argv) {
		var args = {};
		
		for(i = 0; i < argv.length; i++) {
			var arg = argv[i].toString();
			if(arg.startsWith("-") == true) {
				args[arg.slice(1)] = true;
			} else if(i > 0 && argv[i-1].toString().startsWith("-") == true) {
				args[argv[i-1].slice(1)] = arg.toString();
			} else {
				// console.log("Discarded invalid argument " + arg + "!");
			}
		}
		
		return args;
	},
	
	sanitiseArgInt: function(input) {
		if(typeof input == 'undefined')
			return false;
		var output = parseInt(input);
		if(isNaN(output))
			return false;
		return output;
	},
	
	sanitiseArgFloat: function(input) {
		if(typeof input == 'undefined')
			return false;
		var output = parseFloat(input);
		if(isNaN(output))
			return false;
		return output;
	}
}