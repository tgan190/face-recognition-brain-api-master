const Clarifai = require('clarifai');

// note - using heroku env variable for api key
const app = new Clarifai.App({
    apiKey: process.env.APIKEY_CLARIFAI
   });

const handleApiCall = (req, res) => {
    // console.log('req.body.input', req.body.input);
    app.models
        .predict(
        Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {res.json(data);})
        .catch(err => 
            res.status(400).json('Clarifai image processing failed'));
}




const handleImage = (req, res, db) => {


    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleApiCall,
    handleImage
}