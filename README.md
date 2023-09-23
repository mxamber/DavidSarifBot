# DavidSarifBot
A lil twitter bot I made, working an \_ebooks idea into a roleplay account. ~~Live~~ A no longer active account can be found at [@DavidSarif](https://twitter.com/DavidSarif) on Twitter.

**Considering the hellscape Twitter has become,** a migration to the Fediverse is planned and being prepared, I'll be working on porting the code whenever I have the time. In preparation, the existing files in the repo have been moved into the /twitter/ folder.

## The idea
Inspired by several "ebooks"&zwj;<sup>1</sup> accounts, I decided to create a similar account roleplaying as David Sarif from the popular Deus Ex: Human Revolution game. However, sticking with the roleplaying theme, I wanted this account to form sentences that actually make sense, or are at least grammatically correct.

## The functionality
The bot's primary functionality consists of two files: a JSON file containing different quotes from all throughout the game, and a nodejs script that establishes a connection to twitter, remixes the quotes into new ones in different modes, and then posts them as tweets. Unlike conventional ebx bots, that mix sentences into new sentences, sometimes making for abrupt changes mid-sentence, this one keeps the individual sentences and instead combines a few sentences one after another to make for fun, never-happened, out-of-context quotes.

## The rest
Besides the two files mentioned above, I included a small script I wrote called `parg.js` to provide an easy way to parse command-line arguments. You will also need to create a `creds.json` file containing your Twitter API access information (see "The how-to").

## The how-to
Running the bot is pretty simple. After creating a directory to download it into and installing nodejs, run npm to install node-twitter (`npm install twitter`). Register an application with Twitter requesting read-write access (the process changed since I created my bot account but your request should be granted fairly quickly) and enter the credentials into your creds.json file (an example file with no credentials filled in is included with the repository). Run `node app.js <arguments>` from your shell, terminal or command line and you're done!

### command-line arguments
* `-h`, `-help`: this will display an explanation for each argument, then shut the bot down without signing in to twitter
* `-f <float>`: sets tweet frequency (in minutes), overriding the default 60
* `-l <int>`: run the bot x number of times
* `-m <1-4>`: sets the mode
  * ebx mode
  * unaltered quotes mode
  * bonkers mode&zwj;<sup>2</sup>
  * valentine's day mode
* `-s`: this will run the bot a single time, then shut it down
* `-msg <string>`: this will send <string> as a tweet, then shut down, overriding `-f`, `-m` and `-s`
* `-d`: debug mode, will print tweets to console without sending them
* `-p`: ping. will check auth data with twitter, then shut down, overriding other flags.

## The dependencies
* [node-twitter](https://github.com/desmondmorris/node-twitter): unofficial twitter API package

## Annotations
<sup>1</sup> "ebooks" accounts, named after the [Horse_ebooks](https://en.wikipedia.org/wiki/Horse_ebooks) phenomenon, are bot accounts that randomly remix two or more sentences, resulting in odd gibberish sentences

<sup>2</sup> uses quotes from Stephen Shellen's infamous "fruit flies" video
