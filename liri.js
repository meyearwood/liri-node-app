// Dependencies
var keys = require('./keys');
var Twit = require('twit');
var Spotify = require('node-spotify-api');
var https = require('https');
var fs = require('fs');

// Initialize MyTwit
var MyTwit = new Twit(keys);

// Initialize Spotify
var MySpotify = new Spotify({
    id: 'b05fe7bfc7ca4f3789cd379ce8684d9c',
    secret: '5808901556ff4d5ba1f7c969c45b7072',
});

// Command Types
var COMMANDS = {
    MY_TWEETS: 'my-tweets',
    SPOTIFY_THIS_SONG: 'spotify-this-song',
    MOVIE_THIS: 'movie-this',
    DO_WHAT_IT_SAYS: 'do-what-it-says',
};

// Get command
var commandType = process.argv[2];

// Decide how to handle the request
var request = function() {
    // console.log('commandType: ', commandType);
    var commandHandler = getCommandHandler(commandType);
    commandHandler();
};

// Get Command Handler
var getCommandHandler = function(commandType) {
    // Decide which function to call based on command type
    switch (commandType) {
        case COMMANDS.MY_TWEETS:
            return handleMyTweets;
        case COMMANDS.SPOTIFY_THIS_SONG:
            return handleSpotifyThisSong;
        case COMMANDS.MOVIE_THIS:
            return handleMovieThis;
        case COMMANDS.DO_WHAT_IT_SAYS:
            return handleDoWhatItSays;
        default:

    }
}

// Handle My Tweets
// This will show your last 20 tweets and when they were created
var handleMyTweets = function() {
    console.log('Showing my last 20 tweets...');

    MyTwit.get('statuses/user_timeline', { user_id: '922633944041959424', count: 20 }, function(err, data, response) {
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                // Create number for message
                var tweetNum = i + 1;
                // Format message to something like, "1. Message goes here"
                var tweetMessage = tweetNum + '. ' + data[i].text;
                // Print out message
                console.log(tweetMessage);
                logData(tweetMessage);
            }
        }
    });
};

// Handle Spotify This Song
// This will show the following information about the song:
// - Artist(s)
// - The song's name
// - A preview link of the song from Spotify
// - The album that the song is from
var handleSpotifyThisSong = function(paramSongName) {
    // Default Song Name
    var defaultSongName = 'The Sign';
    var songName = process.argv[3] || paramSongName || defaultSongName;
    console.log('Search Results for "' + songName + '"');
    console.log('');
    console.log('');

    MySpotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
        } else {
            // Get the results from data or set to empty array.
            var results = (data && data.tracks && data.tracks.items) || [];
            // console.log('results: ', results);

            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var resultSongName = result.name;
                var resultSongPreviewLink = result.preview_url;
                var resultSongArtistsArr = result.artists || [];
                var resultSongAlbumName = result.album && result.album.name;
                var artistsTempArr = [];
                var resultSongArtists = 'N/A';

                // Loop through the artist objects and push the
                // artist name to the temp array
                for (var count = 0; count < resultSongArtistsArr.length; count++) {
                    var artist = resultSongArtistsArr[count];
                    artistsTempArr.push(artist.name);
                }

                // Set the value for resultSongArtists
                if (artistsTempArr.length) {
                    resultSongArtists = artistsTempArr.join(', ');
                }


                console.log('Song Name: ' + resultSongName);
                logData('Song Name: ' + resultSongName);
                console.log('   • Album: ' + resultSongAlbumName);
                logData('   • Album: ' + resultSongAlbumName);
                console.log('   • Artists: ' + resultSongArtists);
                logData('   • Artists: ' + resultSongArtists);
                console.log('   • Preview Link: ' + resultSongPreviewLink);
                logData('   • Preview Link: ' + resultSongPreviewLink);
                console.log('');
                logData('');
                console.log('');
                logData('');
            }
        }
    });
};

// Handle Movie This
// This will output the following information:
// - Title of the movie.
// - Year the movie came out.
// - IMDB Rating of the movie.
// - Rotten Tomatoes Rating of the movie.
// - Country where the movie was produced.
// - Language of the movie.
// - Plot of the movie.
// - Actors in the movie.
var handleMovieThis = function(paramMovieName) {
    // Default Movie Name
    var defaultMovieName = 'Mr. Nobody';
    var movieName = process.argv[3] || paramMovieName || defaultMovieName;
    var apiURI = 'https://www.omdbapi.com/?apikey=40e9cece&t=' + movieName;
    console.log('Search Results for "' + movieName + '"');
    console.log('');
    console.log('');

    https.get(apiURI, function(resp) {
        var data = '';
        var respObj;

        // A chunk of data has been received.
        resp.on('data', function(chunk) {
            data = data + chunk;
            // can also be written as data += chunk;
        });

        // Got the whole response now.
        resp.on('end', function() {
            respObj = JSON.parse(data);
            var movieTitle = respObj.Title;
            var movieYear = respObj.Year;
            var movieIMDBRating = respObj.Ratings[0].Value;
            var movieRotTomatoesRating = respObj.Ratings[1].Value;
            var movieCountry = respObj.Country;
            var movieLang = respObj.Language;
            var moviePlot = respObj.Plot;
            var movieActors = respObj.Actors;

            console.log('Title: ' + movieTitle);
            logData('Title: ' + movieTitle);
            console.log('Year: ' + movieYear);
            logData('Year: ' + movieYear);
            console.log('IMDB Rating: ' + movieIMDBRating);
            logData('IMDB Rating: ' + movieIMDBRating);
            console.log('Rotten Tomatoes Rating: ' + movieRotTomatoesRating);
            logData('Rotten Tomatoes Rating: ' + movieRotTomatoesRating);
            console.log('Country: ' + movieCountry);
            logData('Country: ' + movieCountry);
            console.log('Language: ' + movieLang);
            logData('Language: ' + movieLang);
            console.log('Plot: ' + moviePlot);
            logData('Plot: ' + moviePlot);
            console.log('Actors: ' + movieActors);
            logData('Actors: ' + movieActors);
            console.log('');
            logData('');
            console.log('');
            logData('');
        });

    }).on("error", function(err) {
        console.log('Error: ' + err.message);
    });
};

// Handle Do What It Says
// This will take the text inside of the random.txt file and use it to
// call one of LIRI's commands.
var handleDoWhatItSays = function() {
    console.log('handleDoWhatItSays was called...');

    fs.readFile('random.txt', function(err, data) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            docText = data.toString();
            var params = docText.split(',');
            var commandHandler = getCommandHandler(params[0]);
            if (params.length > 1) {
                // Convert string to array
                var queryParam = params[1].split('');
                // Remove Quotes
                queryParam.pop();
                queryParam.shift();
                // Convert Array back to string
                queryParam = queryParam.join('');
                commandHandler(queryParam);
            } else {
                commandHandler();
            }
        }
    });
};

// Bonus: Output the data of each command to log.txt file.
var logData = function(data) {
    fs.appendFile('log.txt', data, function(err) {
        if (err) {
            console.log('Error: ' + err);
        }
    });
};

// Kick off request
request();
