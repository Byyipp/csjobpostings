const API_ENDPOINT = "https://k0v0rx1twg.execute-api.us-east-1.amazonaws.com/getjobs"; 
const IMAGE_ENDPOINT = "https://k0v0rx1twg.execute-api.us-east-1.amazonaws.com/getimage"

window.onload = function() {
    getJobs().then(jobDataMap => {
        if (jobDataMap) {
            updateJobPostings(jobDataMap);
        }
    });
};

function getJobs() {
    return fetch(API_ENDPOINT, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const jobData = JSON.parse(data.body);

        // Fetch images for each job and return a promise for each job's data.
        const promises = jobData.results.map(job => 
            fetch(IMAGE_ENDPOINT + `?company=${job.company.display_name}`, { // Replace with your actual image API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(imageResponse => imageResponse.json())
            .then(imageData => ({
                company_image: imageData.body,  // Extract the image URL from the body attribute
                title: job.title,
                company_display_name: job.company.display_name,
                location_display_name: job.location.display_name.slice(0, job.location.display_name.indexOf(",")),
                location_area: job.location.area.slice(0, 2).reverse().join(', '),
                salary_min: job.salary_min,
                company_created: job.created,
                redirect_url: job.redirect_url
            }))
        );

        // Wait for all image requests to complete and return the final job data.
        return Promise.all(promises);
    })
    .then(jobDataMap => {
        console.log(jobDataMap);
        return jobDataMap;
    })
    .catch(error => {
        console.error("There was an error calling the Lambda function", error);
        return null;
    });
}




function updateJobPostings(jobDataMap) {
    const jobContainer = document.querySelector('[role="list"]');

    // Clear existing job cards
    const oldJobCards = document.querySelectorAll('.job-card-list');
    oldJobCards.forEach(card => card.remove());

    // Generate new job cards based on the job data map
    jobDataMap.forEach(job => {
        const jobCard = document.createElement('li');
        jobCard.className = 'job-card-list';

        const jobList = document.createElement('ul');
        jobList.className = 'job-list w-list-unstyled';

        // Title
        const titleHeader = document.createElement('h3');
        titleHeader.className = 'job-title-header';
        titleHeader.innerText = job.title;

        // Company
        const companyHeader = document.createElement('h4');
        companyHeader.className = 'company-header';
        companyHeader.innerText = job.company_display_name;

        // Location - Display name
        const locationHeader = document.createElement('h4');
        locationHeader.className = 'location-header';
        locationHeader.innerText = job.location_display_name;

        // Location - Area
        const locationState = document.createElement('h5');
        locationState.className = 'location-state';
        locationState.innerText = job.location_area;

        // Salary
        const salaryText = document.createElement('strong');
        salaryText.className = 'salary-money-text';
        salaryText.innerText = `$${job.salary_min.toFixed(2)}`;

        // Button
        const viewJobButton = document.createElement('a');
        viewJobButton.className = 'view-job-button w-button';
        viewJobButton.href = job.redirect_url;
        viewJobButton.innerText = 'View Job';

        // Append elements to the job card
        jobList.appendChild(titleHeader);
        jobList.appendChild(companyHeader);
        jobList.appendChild(locationHeader);
        jobList.appendChild(locationState);
        jobList.appendChild(salaryText);
        jobList.appendChild(viewJobButton);
        jobCard.appendChild(jobList);

        // Append the job card to the container
        jobContainer.appendChild(jobCard);
    });
}