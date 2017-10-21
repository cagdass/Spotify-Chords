'use-strict';
let SpotifyWebApi = require('spotify-web-api-node');
let config = require('./config');
var ugs = require('ultimate-guitar-scraper');

let scopes = ['user-read-playback-state'],
    state = 'spotify_auth_state';
// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
let spotifyApi = new SpotifyWebApi({
  redirectUri : config.redirectUri,
  clientId : config.clientId,
  clientSecret : config.clientSecret
});

// Create and open the authorization URL
let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
let opn = require('opn');
opn(authorizeURL);


let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors')
let app = express();
let router = express.Router();

let port = config.port;

//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


//now we can set the route path & initialize the API
router.get('/', function(req, res) {
	// Get the currently playing
	spotifyApi.getMyCurrentPlaybackState()
	  .then(function(data) {
	  	let temp  = getSongArtist(data.body);
	  	let name = temp[0];
        let artist = temp[1];

        let tabs = [];
        let chords = [];

        console.log('Gon search for tabs now');

        ugs.search({
            bandName: artist,
            songName: name,
            page: 1,
            type: ['tabs', 'chords'],
        }, function(error, found) {
            if (error) {
                console.log(error);
            }
            else {
                for (let i = 0; i < found.length; i++) {
                    console.log(i);
                    console.log(found[i]);
                    console.log(found[i].url);
                    if (found[i] != undefined && found[i].url != undefined) {
                        if (found[i].rating == undefined) {
                            found[i].rating = 0;
                        }
                        if (found[i].numberRates == undefined) {
                            found[i].numberRates = 0;
                        }
                        if (found[i].type == 'tab') {
                            tabs.push(found[i]);
                        }
                        else if (found[i].type == 'chords') {
                            chords.push(found[i]);
                        }
                    }
                }

                tabs.sort(tabSort);
                chords.sort(tabSort);

                console.log(tabs);
                console.log(chords);

                res.type('text/html');
        		res.write('<head><title>Spotify Lyrics</title></head>');
                res.write('<center>');
                res.write('<h3>' + artist + ' - ' + name + '</h3>');
                if (chords.length == 0) {
                    res.write('Chords not found :(');
                }
                else {
                    res.write('<iframe width="80%" height="900em" sandbox="allow-forms allow-scripts" name="top" src="' + chords[0].url + '">');
                    res.write('</iframe>');
                }
                res.write('</center>');
                res.end();
            }
        });
	  }, function(err) {

		// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
		spotifyApi.refreshAccessToken()
		  .then(function(data) {
		    console.log('The access token has been refreshed!');

		    // Save the access token so that it's used in future calls
		    spotifyApi.setAccessToken(data.body['access_token']);
		    res.redirect(req.originalUrl)
		  }, function(err) {
		    console.log('Could not refresh access token', err);
		  });
	  });

});

router.get('/callback', function(req, res) {
	let code  = req.query['code'];

	spotifyApi.authorizationCodeGrant(code)
	  .then(function(data) {
	    // Set the access token on the API object to use it in later calls
	    spotifyApi.setAccessToken(data.body['access_token']);
	    spotifyApi.setRefreshToken(data.body['refresh_token']);
	    res.redirect('/');
	  }, function(err) {
	    console.log('Something went wrong!', err);
	  });
});




app.use('/', router);
//starts the server and listens for requests
app.listen(port, function() {
    console.log(`api running on port ${port}`);
    console.log(`Access localhost:${port} to see the lyrics for the currently played song` );
});

function tabSort(a, b) {
    var key00 = a.rating;
    var key01 = a.numberRates;
    var key10 = b.rating;
    var key11 = b.numberRates;
    if (Math.abs(key00-key10) < 0.25) {
        if (key01 > key11) {
            return a;
        }
        else {
            return b;
        }
    }
    else {
        if (key00 > key10) {
            return a;
        }
        else {
            return b;
        }
    }
}

function prettify(s) {
    return s.replace(/ *\([^)]*\) */g, " ").trim();
}

function getSongArtist(body) {
	let name = body.item.name;
	let artist = body.item.artists['0'].name;
	return [prettify(name), prettify(artist)];
}
