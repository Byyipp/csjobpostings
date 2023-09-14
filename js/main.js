const API_ENDPOINT = "https://k0v0rx1twg.execute-api.us-east-1.amazonaws.com/getjobs"; 
const IMAGE_ENDPOINT = "https://k0v0rx1twg.execute-api.us-east-1.amazonaws.com/getimage"

window.onload = function() {
    getJobs().then(jobDataMap => {
        if (jobDataMap) {
            updateJobPostings(jobDataMap);
        }
    });
};

document.getElementById('zipcodeForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const zipcode = document.getElementById('Zipcode').value;
    const distance = document.getElementById('distance').value;

    if (zipcode && distance !== "0") {
        getJobsDistance(zipcode, distance).then(jobDataMap => {
            if (jobDataMap) {
                updateJobPostings(jobDataMap);
            }
        });
    } else {
        alert('Please select a distance with Zipcode.');
    }
});

function getJobs() {
    document.querySelector('.loader-container').style.display = 'flex';

    return fetch(API_ENDPOINT, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const jobData = JSON.parse(data.body);

        // Fetch images for each job and return a promise for each job's data.
        const promises = jobData.results.map(job => 
            fetch(IMAGE_ENDPOINT + `?company=${job.company.display_name}`, { 
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

function getJobsDistance(zipcode, distance) {
    document.querySelector('.loader-container').style.display = 'flex';
    km = distance * 1.609344;

    return fetch(API_ENDPOINT + `?where=${zipcode}&distance=${km}`, {
        method: 'GET', 
    })
    .then(response => response.json())
    .then(data => {
        const jobData = JSON.parse(data.body);

        // Fetch images for each job and return a promise for each job's data.
        const promises = jobData.results.map(job => 
            fetch(IMAGE_ENDPOINT + `?company=${job.company.display_name}`, { 
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
    const jobContainer = document.querySelector('ul[role="list"][class="list w-list-unstyled"]');

    // Clear existing job cards
    const oldJobCards = document.querySelectorAll('.job-card-list');
    oldJobCards.forEach(card => card.remove());
    const oldli = document.querySelectorAll('li');
    oldli.forEach(card => card.remove());

    // Generate new job cards based on the job data map
    jobDataMap.forEach(job => {
        const jobCard = document.createElement('li');
        jobCard.className = 'job-card-list';

        const jobList = document.createElement('ul'); 
        jobList.className = 'job-list w-list-unstyled';
        jobList.role = 'list';
        jobCard.appendChild(jobList);

        // Image
        const companyImg = document.createElement('li'); //append
        companyImg.className = 'logo-list w-clearfix';
        const image = document.createElement('img');
        image.src = job.company_image;
        image.loading = 'lazy';
        image.sizes = '(max-width: 479px) 50px, 60px'
        image.alt = job.title;
        image.className = 'logo-image-2';
        companyImg.appendChild(image);

        // Title
        const companyTitleli = document.createElement('li'); //append
        companyTitleli.className = 'job-title-list';
        const companyTitle = document.createElement('h3');
        companyTitle.className = 'job-title-header';
        companyTitle.innerText = job.title;
        companyTitleli.appendChild(companyTitle);

        // Company
        const companyHeader = document.createElement('h4');
        companyHeader.className = 'company-header';
        companyHeader.innerText = job.company_display_name;
        companyTitleli.appendChild(companyHeader);

        // Location - Display name
        const locationli = document.createElement('li'); //append
        locationli.className = 'location-list';
        const locationul = document.createElement('ul');
        locationul.role = 'list';
        locationul.className = 'location-icon-list w-list-unstyled';
        locationli.appendChild(locationul);

        const locationIconli = document.createElement('li');
        locationIconli.className = 'location-list-item';
        const locationIcon = document.createElement('img');
        locationIcon.src = 'images/locationimg.png';
        locationIcon.loading = 'lazy';
        locationIcon.width = '20';
        locationIcon.sizes = '20px';
        locationIcon.alt = 'location_icon';
        locationIcon.srcset = 'images/locationimg-p-500.png 500w, images/locationimg.png 512w';
        locationIcon.className = 'location-img';
        locationIconli.appendChild(locationIcon);
        locationul.appendChild(locationIconli);

        // Location - Area
        const locationItemli = document.createElement('li');
        locationItemli.className = 'location-text-list-item';
        locationul.appendChild(locationItemli);
        const locationHeader = document.createElement('h4');
        locationHeader.className = 'location-header';
        locationHeader.innerText = job.location_display_name;
        locationItemli.appendChild(locationHeader);

        const locationState = document.createElement('h5');
        locationState.className = 'location-state';
        locationState.innerText = job.location_area;
        locationItemli.appendChild(locationState);

        // Salary
        const salaryListli = document.createElement('li'); //append
        salaryListli.className = 'salary-list';

        const salaryHeader = document.createElement('h5');
        salaryHeader.className = 'salary-header';
        salaryHeader.innerText = 'Est. Salary:';
        salaryListli.appendChild(salaryHeader);

        const salaryText = document.createElement('div');
        salaryText.className = 'salary-text-block';
        salaryListli.appendChild(salaryText);
        const salaryMoney = document.createElement('strong');
        salaryMoney.className = 'salary-money-text';
        salaryMoney.innerText = `$${job.salary_min.toFixed(2)}`;
        salaryText.appendChild(salaryMoney);

        // Date Posted
        postedDateli = document.createElement('li'); //append
        postedDateli.className = 'posted-date-list';

        postedDate = document.createElement('h6');
        postedDate.className = 'posted-date';
        postedDate.innerText = 'Posted:';
        postedDateli.appendChild(postedDate);

        timePosted = document.createElement('h6');
        timePosted.className = 'time-posted';
        timePosted.innerText = updateTimePosted(job.company_created);
        postedDateli.appendChild(timePosted);


        // Button
        const viewJobButtonli = document.createElement('li') //append
        viewJobButtonli.className = 'view-job-button-list';

        const viewJobButton = document.createElement('a');
        viewJobButton.className = 'view-job-button w-button';
        viewJobButton.target = '_blank';
        viewJobButton.href = job.redirect_url;
        viewJobButton.innerText = 'View Job';
        viewJobButtonli.appendChild(viewJobButton)

        //append all
        jobList.appendChild(companyImg);
        jobList.appendChild(companyTitleli);
        jobList.appendChild(locationli);
        jobList.appendChild(salaryListli);
        jobList.appendChild(postedDateli);
        jobList.appendChild(viewJobButtonli);

        // Append the job card to the container
        jobContainer.appendChild(jobCard);
        document.querySelector('.loader-container').style.display = 'none';

    });
}

function updateTimePosted(time) {
    const currentTime = new Date();
    const postTime = new Date(time);
    const diffInMilliseconds = currentTime - postTime;

    // Convert milliseconds to days
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    let displayText;

    if (diffInDays < 1) {
        displayText = '<24h';
    } else if (diffInDays <= 30) {
        displayText = `${diffInDays}D`;
    } else {
        displayText = '>30D';
    }

    return displayText;
}