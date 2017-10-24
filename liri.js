var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter('keys.twitterKeys');
var fs = require('fs');

var nodeArgv = process.argv;
var command = process.argv[2];
var x = "";
for (var i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length) {
        x = x + "+" + nodeArgv[i];
    } else {
        x = x + nodeArgv[i];
    }
}

switch (command) {
    case "my-tweets":
        showTweets();
        break;

    case "spotify-this-song":
        if (x) {
            spotifySong(x);
        } else {
            spotifySong("Just Got Paid");
        }
        break;

    case "movie-this":
        if (x) {
            omdbData(x)
        } else {
            omdbData("Coming to America");
        }
        break;

    case "do-what-it-says":
        doThing();
        break;

    default:
        console.log("{Enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
        break;
}

function showTweets() {

    var screenName = { screen_name: 'MeyLiri'};
    client.get('statuses/user_timeline', screenName, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@MeyLiri: " + tweets[i].text + " Created At: " + date.substring(0, 19));
                console.log("-----------------------");


                fs.appendFile('log.txt', "@MeyLiri:" + tweets[i].text + " Created At: " + date.substring(0, 19));
                fs.appendFile('log.txt', "-----------------------");
            }
        } else {
            console.log('Error');
        }
    });
}

function spotifySong(song) {
    spotify.search({
        type: 'track',
        query: song
    }, function(error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];

                console.log("Artist: " + songData.artists[0].name);

                console.log("Song: " + songData.name);

                console.log("Preview URL: " + songData.preview_url);

                console.log("Album: " + songData.album.name);
                console.log("-----------------------");

                fs.appendFile('log.txt', songData.artists[0].name);
                fs.appendFile('log.txt', songData.name);
                fs.appendFile('log.txt', songData.preview_url);
                fs.appendFile('log.txt', songData.album.name);
                fs.appendFile('log.txt', "-----------------------");
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

function omdbData(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true';

    request(omdbURL, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var body = JSON.parse(body);

                console.log("Title: " + body.Title);
                console.log("Year:" + body.Year);
                console.log("IMDB Rating: " + body.imdbRating);
                console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                console.log("Country: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);

                console.log("Rotten Tomatoes URL: " + body.tomatoURL);


                fs.appendFile('log.txt', "Title: " + body.Title);
                fs.appendFile('log.txt', "Release Year: " + body.Year);
                fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
                fs.appendFile('log.txt', "Country: " + body.Country);
                fs.appendFile('log.txt', "Language: " + body.Language);
                fs.appendFile('log.txt', "Plot: " + body.Plot);
                fs.appendFile('log.txt', "Actors: " + body.Actors);
                fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
                fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);

            } else {
                console.log('Error')
            }
            if (movie === "Coming to America"); {
                    console.log("-----------------------");
                    console.log("This movie is one of the best comedy movies in the 80s ");
                    console.log("It is considered a Classic");

                    //adds text to log.txt
                    fs.appendFile('log.txt', "-----------------------");
                    fs.appendFile('log.txt', "This movie is one of the best comedy movies in the 80s");
                    fs.appendFile('log.txt', "It is considered a Classic");
                }
            });

    }

    function doThing() {
        fs.readFile('random.txt', "utf8", function(error, data) {
            var txt = data.split(',');

            spotifySong(txt[1]);
        });
    }
