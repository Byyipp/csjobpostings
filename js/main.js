

const GOOGLE_API = process.env.GOOGLE_API;
const GOOGLE_ID = process.env.GOOGLE_ID;
const ADZUNA_ID = process.env.ADZUNA_ID;
const ADZUNA_KEY = process.env.ADZUNA_KEY;

const client = new GoogleImages(GOOGLE_ID, GOOGLE_API);

window.onload = function() {
    getJobs();
};

function getJobs() {
    fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=5&what=software%20engineer&what_and=entry`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log(response.json())
    })
    .catch(error => {
        // handle the error
        console.log("error")
    });
}