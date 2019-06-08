const parg = require('./parg'); // custom-written script to parse command-line arguments
const args = parg.parg(process.argv); // parse arguments

// check if -h or -help flag is set BEFORE establishing a connection with twitter
if(args.h == true || args.help == true) {
	console.log("");
	console.log("--- SarifBot Help ---");
	console.log("");
	console.log("Flag\t\tExplanation");
	console.log("----\t\t-----------");
	console.log("-s\t\truns the bot a single time and shuts it down afterwards.");
	console.log("-l <int>\truns the bot <int> times. if -s is set, this flag will be ignored.");
	console.log("-m <int>\t manually sets the bot's mode (ignored if -msg is used):");
	console.log("\t\t\t1: ebx mode");
	console.log("\t\t\t2: vanilla mode");
	console.log("\t\t\t3: bonkers mode");
	console.log("\t\t\t4: valentine mode");
	console.log("\t\tusing -m does not affect the number of runs. recommended for use with either -s or -l.");
	console.log("-msg <string>\ttweets <string> and shuts down as if -s were set. Use \" \" around <string>.");
	console.log("-d\t\tdebug mode, prints tweets to the console instead of posting.");
	console.log("-f <int>\tsets the tweet frequency to <int> minutes.");
	console.log("-h, -help\tdisplays help");
	process.exit();
}

// require packages
const fs = require('fs');
const TwitterPackage = require('twitter');

// set up twitter access, unless -d (debug) flag is set
if(args.d != true) {
	var creds = require('./creds.json');
	var Twitter = new TwitterPackage(creds);
}

// check authentication by requesting world-wide trends (an action requiring authentication)
Twitter.get("trends/place", {id: 1}, function(error, response) {
	if(error != true && response != undefined) {
		if(args.p) {
			console.log("[" + cTime() + " DEBUG] Successfully authenticated!");
			process.exit();
		}
	} else {
		console.log("[" + cTime() + " DEBUG] Authentication failed!");
		process.exit();
	}
});

function int_rand(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; // the maximum is exclusive and the minimum is inclusive
}

const randbool = Math.random() < 0.75; // returns bool: 25% true cases, 75% false cases
const msconv = 60000; // multiply x minutes with msconv to get x in milliseconds
var freq = 60 * msconv;
var iterations = 0; // upon startup, bot has run 0 times

// check for -f argument, sanitise and parse as float, discard if impossible, if -f is valid, alter tweet frequency accordingly
if(parg.sanitiseArgFloat(args.f) != false)
	freq = parg.sanitiseArgFloat(args.f) * msconv;

// get local time for console output
function cTime() {
	var d = new Date();
	return d.toLocaleTimeString();
}

// actual tweet functionality
function bot_tweet(content) {
	if(args.d == true) {
		// if -d flag is set, activate debug mode
		// debug mode posts to the console without actually tweeting
		console.log("[" + cTime() + " DEBUG] " + content);
		return;
	} else if(args.p == true) {
		return;
	} else {
		console.log("[" + cTime() + " SARIFBOT] " + content);
	}
	
	// post status to twitter
	Twitter.post('statuses/update', {status: content},  function(error, tweet, response){
		if(error){
			console.log("[" + cTime() + "] " + error);
		}
	});
}

// tweet composition
function hourly_tweet(){
	
	fs.readFile(__dirname + "/quotes.json", function(err, data) {		
		var quotes = JSON.parse(data); // JSON is parsed again for each tweet to allow editing in-between posts
		
		
		var twt_case = int_rand(1,11); // twt_case is between 1 and 10,
		
		if(parg.sanitiseArgInt(args.m) != false) {
			var mode = parg.sanitiseArgInt(args.m);
			switch(mode) {
				case 1:
					twt_case = 7; // ebx mode - case 6 - 10, ebx mode is selected (5/10 chance of being picked randomly)
					break;
				case 2:
					twt_case = 3; // stock quotes mode - case 2 - 5, stock quotes mode is selected (4/10 chance of being picked randomly)
					break;
				case 3:
					twt_case = 1; // bonkers mode - case 1, bonkers mode is selected (1/10 chance of being picked randomly)
					break;
				case 4:
					twt_case = 0; // 0 = valentine's day mode. twt_case is between 1 and 10 so valentine mode never happens except if run manually using -m 4
					break;
				default:
					twt_case = 7;
			}
		}
		
		if(twt_case > 10 || twt_case < 0) {
			bot_tweet("It would appear SOMEONE has messed with our software again... I'll fix that in a minute. --FP"); // if twt_case is SOMEHOW outside the 1-10 range (plus 0 for valentine), this tweet is sent
		} else if(twt_case == 0) {
			bot_tweet(quotes.valentine[int_rand(0,quotes.valentine.length)]);
		} else if(twt_case == 1) {
			bot_tweet(quotes.bonkers[int_rand(0,quotes.bonkers.length)]);
		} else if (twt_case > 1 && twt_case < 6) {
			bot_tweet(quotes.quotes[int_rand(0,quotes.quotes.length)]);
		} else if (twt_case > 5 && twt_case < 11) {
			var quote1 = quotes.lecture.situation[int_rand(0,quotes.lecture.situation.length)];
			var quote2 = quotes.lecture.directive[int_rand(0,quotes.lecture.directive.length)];
			var quote = quote1 + " " + quote2;
			if(randbool) {
				var quote3 = quote + " " + quotes.lecture.mystery[int_rand(0,quotes.lecture.mystery.length)];
				if(quote3.length <= 280) {
					quote = quote3;
				}
			}
			
			bot_tweet(quote);
		}
		
		// increment iterations per tweet, check whether maximum number of tweets (as defined in -l flag) has been sent, shut down if yes
		iterations++;
		if(args.l && iterations >= args.l) {
			console.log("[" + cTime() + " NOTIF] Ran " + args.l + " number of times, shutting down!");
			process.exit();
		}
	});
}

// if -msg <string> argument is given, the message will be sent and the bot shut down
if(typeof args.msg == "string") {
	if(args.msg.length > 280) {
		// if the message exceeds 280 characters, no tweet will be sent and the error displayed
		console.log("[" + cTime() + " ERROR] Character limit violated (" + args.msg.length + " characters). Could not post tweet.")
		console.log("[" + cTime() + " PART1] " + args.msg.slice(0,280));
		console.log("[" + cTime() + " PART2] " + args.msg.slice(280));
		process.exit();
	}
	bot_tweet(args.msg.trim());
	process.exit();
}


// initial tweet
hourly_tweet();

// regular tweets, unless -s (single post) flag is set
if(typeof args.s == 'undefined') {
	setInterval(hourly_tweet, freq);
}
