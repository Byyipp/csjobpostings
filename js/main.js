const API_ENDPOINT = "https://k0v0rx1twg.execute-api.us-east-1.amazonaws.com/getjobs"; 


window.onload = function() {
    getJobs();
};

function getJobs() {
    fetch(API_ENDPOINT, {
        method: 'GET',
    })
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        console.log("Parsed Lambda Response:", data);  // Log the initial response
    
        // If the 'body' attribute of your Lambda response contains stringified JSON:
        const jobData = JSON.parse(data.body);
        const desiredData = jobData.results.map(job => ({
            title: job.title,
            company_display_name: job.company.display_name,
            location_display_name: job.location.display_name.slice(0, job.location.display_name.indexOf(",")),
            location_area: job.location.area.slice(0, 2).reverse().join(', '),
            salary_min: job.salary_min,
            company_created: job.created,
            redirect_url: job.redirect_url
        }));

        console.log(desiredData);
    
        // Further processing of actualData if needed...
    })
    .catch(error => {
        console.error("There was an error calling the Lambda function", error);
    });
}