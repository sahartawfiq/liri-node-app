require("dotenv").config();
// Twitter require
var Twitter = require("twitter");
// Spotify require
var Spotify = require("node-spotify-api");
// Request 
var request = require("request");
// Reading key.js
var fs = require("fs");
// importing the keys
var keys = require("./keys.js");
// console.log(keys);
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var input = process.argv.slice();
var command = input[2];

// check the current command
// text file command
if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        } else {
            var dataString = data;
            var commandString = dataString.split(",");
            songName = commandString[1];
            command = commandString[0];
            spotifySong(songName);
        }
    });
// Tweets
} else if (command === "my-tweets") {
    var params = { screen_name: "saheera100" };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text)
            }
        } else {
            console.log(error);
        }
    });

// Spotify a song
} else if (command === "spotify-this-song") {
    var songName = "";
    for (var i = 3; i < input.length; i++) {
        songName = songName + input[i] + " ";
    }
    
    if (songName ===  "") {
        songName = "The Sign";
        spotify.search({ type: 'track', query: songName + " - Ace Of Base", limit: 1}, function(err,data){
            if (err) {
                return console.log('Error occurred: ' + err);
            } else {
                console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
                console.log("Song Name: " + data.tracks.items[0].name);
                console.log("Preview Link: " + data.tracks.items[0].preview_url);
                console.log("Album Name: " + data.tracks.items[0].album.name); 
            }
        });
    }
    else{
        spotifySong(songName);
    }

// OMDB query
} else if (command === "movie-this") {
    var movieName =  "";
    for (var i = 3; i < input.length; i++) {
        movieName = movieName + input[i] + " ";
    }
    if (movieName === "") {
        movieName = "Mr. Nobody";
    }
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(("Movie Title: " + JSON.parse(body).Title) + "\n" + ("Release Year: " + JSON.parse(body).Year));
            console.log(("IMDB Rating: " + JSON.parse(body).imdbRating) + "\n" + ("Rotten Tomato Rating: " + JSON.parse(body).Ratings[1].Value));
            console.log(("Production Country: " + JSON.parse(body).Country) + "\n" + ("Language: " + JSON.parse(body).Language));
            console.log(("Actors: " + JSON.parse(body).Actors) + "\n" + ("Plot: " + JSON.parse(body).Plot));
        }
    });
}
function spotifySong(x){
    spotify.search({ type: 'track', query: x , limit: 1}, function(err,data){
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            for (var i = 0; i < data.tracks.items.length; i++) {

                console.log("Artist: " + data.tracks.items[i].album.artists[i].name);
                console.log("Song Name: " + data.tracks.items[i].name);
                console.log("Preview Link: " + data.tracks.items[i].preview_url);
                console.log("Album Name: " + data.tracks.items[i].album.name);
            }
        }   
    });
}