const API_ENDPOINT = "https://k0v0rx1twg.execute-api.us-east-1.amazonaws.com/getjobs"; // Replace with your Invoke URL


window.onload = function() {
    getJobs();
};

function getJobs() {
    fetch(API_ENDPOINT, {
        method: 'GET',
        mode: 'no-cors'
    })
    .then(data => {
        console.log("Parsed Lambda Response:", data);  // Log the initial response
    
        // Now, let's attempt to parse the body
        const actualData = JSON.parse(data.body);
        console.log("Parsed Body Data:", actualData);
    
        // Further processing of actualData if needed...
    })
    .catch(error => {
        console.error("There was an error calling the Lambda function", error);
    });
    
}