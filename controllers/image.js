const env = require('../environment.js');

// PAT (property access token)
let PAT = env.PAT;
// Specify the correct user_id/app_id pairings
let USER_ID = env.userId;
// Specify app id currently being used
let APP_ID = env.AppId;

const clarifaiRequestOptions = (imageURL) => {  
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": imageURL
                    }
                }
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions
}

const handleApiCall = async (req, res) => {
    // model for face detection API
    const MODEL_ID = 'face-detection';
    // fetch carifai API to get bounding boxes for face
    await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", clarifaiRequestOptions(req.body.input))
    .then(response => response.json())
    .then(data => {
        return res.json(data)
    })
}

const handleImage = (req,res,knex) => {
    const { id } = req.body;
    const badRequest = 400;
    
    // if user submits an image, update count in db
    knex('users')
    .where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(() => res.status(badRequest).json('error updating entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}