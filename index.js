require('dotenv').config();

const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      cors = require('cors'),
      port = process.env.PORT || 3000;

const recipes = require('./recipe-routes');

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true});
const db = mongoose.connection;

app.use(cors());
app.use(bodyParser.json());

app.use('/recipes', recipes)

app.get('/', function(req, res){
  res.send("I'm a little server");
});

http.listen(port, () => {
    console.log(`server is running on localhost:` + port)
});