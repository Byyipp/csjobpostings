const GoogleImages = require('google-images');
const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_API = process.env.GOOGLE_API;
const GOOGLE_ID = process.env.GOOGLE_ID;
 
const client = new GoogleImages(GOOGLE_ID, GOOGLE_API);

client.search('Segment company logo')
    .then(images => {
        if (images.length > 0) {
            console.log(images[0].thumbnail.url);
        } else {
            console.log("No images found.");
        }
    })
    .catch(err => {
        console.error("Error fetching images:", err.message);
        
    });