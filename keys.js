
console.log('this is loaded');

var twitterKeys = {
  consumer_key: 'tQhskcviHfThgz2BG3eVrOD5y',
  consumer_secret: 'pqLKONysHuutH8R7yLcbmpA7a5oTyYj7yNfzbZnSbQfZjL0N3v',
  access_token_key: '922633944041959424-FYIPN7ZSCoiWnGZ3Ndg6n1iTRGjKRf4',
  access_token_secret: 'XsE18r8zY1okZgg40VO4gaCWFQhCp4CyFjpgEgBtsuE2K',

}

module.exports = twitterKeys;


var Spotify = require('node-spotify-api');

var spotify = new Spotify({
  id: 'b05fe7bfc7ca4f3789cd379ce8684d9c',
  secret:'5808901556ff4d5ba1f7c969c45b7072'
});

spotify.search({ type: 'track', query: 'Just Got Paid' }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }

console.log(data);
});
