const API_ENDPOINT = "https://k0v0rx1twg.execute-api.us-east-1.amazonaws.com/getjobs"; // Replace with your Invoke URL


window.onload = function() {
    getJobs();
};

function getJobs() {
    fetch(API_ENDPOINT, {
        method: 'GET',

    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Process the response from Lambda function
    })
    .catch(error => {
        console.error("There was an error calling the Lambda function", error);
    });
}