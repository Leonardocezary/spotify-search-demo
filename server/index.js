const express = require('express')
const querystring = require( "querystring");
const request = require( 'request');
const dotenv = require('dotenv');

dotenv.config()
const PORT = 5000;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = 'http://localhost:' + PORT + '/callback';
const STATE_KEY = 'spotify_auth_state';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const app = express(); 

const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);
global.access_token = ''

app.get('/auth/login', function(req, res) {
  console.log("Enter auth login");
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';
  res.redirect(200, 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    }));
});


app.get('/callback', function(req, res) {
  console.log("Enter callback");
  const { code, state } = req.query;

  if (state === null) {
      console.log("state is null");
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } 
  else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        console.dir(body);
        res.redirect('http://localhost:3000')
      //   res.send({
      //     'access_token': access_token
      //   });
      }
    });
  }
});

  app.get('/refresh_token', function(req, res) {

    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });


  app.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token})
  })

  app.get('/auth/search', (req, res) => {
    const { type, q } = req.query;
    var options = {
      url: 'https://api.spotify.com/v1/search?type='+type+'&q='+q,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(body);
      res.send(body);
    });
  });

app.listen(PORT, function(err){
    if (err){ console.log("test: \n");console.log(err);
    }
    console.log("Server listening on PORT", PORT);
});