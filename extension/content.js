// content.js
console.log("Content script loaded.");

setTimeout(function () {
  if (
    document
      .querySelector('[class$="_primary-description"')
      .innerText.split(" · ")[1]
      .includes("Area")
  ) {
    console.log(
      document
        .querySelector('[class$="_primary-description"')
        .innerText.split(" · ")[1]
        .split("Area")[0]
        .trim()
    );
    console.log(
      document
        .querySelector('[class$="_primary-description"')
        .innerText.split(" · ")[1]
        .split("Area")[1]
        .trim()
    );
  }
}, 3000);

//declare variables
let appUrl = "error";
let appStatus = "Added";

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "addJobButtonClicked") {
    //if the add job button is clicked
    // Function to extract data from the page
    function extractJobInfo() {
      function getDateFromRelativeTime(relativeTime) {
        // Extract the numerical value and unit from the relative time string
        let matches = relativeTime.match(/^(\d+)\s+(\w+)\s+ago$/i);

        if (matches) {
          let value = parseInt(matches[1]);
          let unit = matches[2].toLowerCase();

          // Get the current date
          let currentDate = new Date();

          // Calculate the target date based on the relative time
          switch (unit) {
            case "hour":
            case "hours":
              currentDate.setHours(currentDate.getHours() - value);
              break;
            case "day":
            case "days":
              currentDate.setDate(currentDate.getDate() - value);
              break;
            case "week":
            case "weeks":
              currentDate.setDate(currentDate.getDate() - value * 7);
              break;
            case "month":
            case "months":
              currentDate.setMonth(currentDate.getMonth() - value);
              break;
            // Add more cases as needed (e.g., 'year', 'years')

            default:
              console.error("Invalid unit:", unit);
              return null;
          }

          return currentDate;
        } else {
          console.error("Invalid relative time format:", relativeTime);
          return null;
        }
      }
      // Check if the URL is a job posting or a job collection
      const jobId = window.location.href.split("=")[1]; // split the url at the = and take the second part (the job ID)
      if (
        window.location.href.includes("linkedin.com/jobs/collections/") ===
        false // if its not a job collection
      ) {
        if (window.location.href.includes("linkedin.com/jobs/search/")) { // if its a job search
          if (jobId.includes("&")) {
            //check if the url has an & in it, if so split it at the & and take the first part
            appUrl = `https://linkedin.com/jobs/view/${jobId.split("&")[0]}`;
          } else {
            appUrl = `https://linkedin.com/jobs/view/${
              //if not just put the jobId
              jobId
            }`;
          }
        } else if (window.location.href.includes("linkedin.com/jobs/view/")) {
          appUrl = window.location.href; // add check to see if it is jobs/view or jobs/search, if jobs/search then get the job ID and change to jobs /view
        }
      } else {
        // if its a job collection replace the appUrl with the current job

        if (jobId.includes("&")) {
          //check if the url has an & in it, if so split it at the & and take the first part
          appUrl = `https://linkedin.com/jobs/view/${jobId.split("&")[0]}`;
        } else {
          appUrl = `https://linkedin.com/jobs/view/${
            //if not just split at the =
            jobId
          }`;
        }
      }
      // get company name from primary description
      let companyName = document
        .querySelector('[class$="_primary-description"')
        .innerText.split(" · ")[0];
      let location = "";
      // get location from primary description
      if (
        document
          .querySelector('[class$="_primary-description"')
          .innerText.split(" · ")[1]
          .match(/(.*),\s*([A-Za-z]{2})/) === null ||
        undefined
      ) {
        if (
          document
            .querySelector('[class$="_primary-description"')
            .innerText.split(" · ")[1]
            .includes("United States")
        ) {
          location = "United States";
        } else if (
          document
            .querySelector('[class$="_primary-description"')
            .innerText.split(" · ")[1]
            .includes("Area")
        ) {
          location = `${document
            .querySelector('[class$="_primary-description"')
            .innerText.split(" · ")[1]
            .split("Area")[0]
            .trim()} Area`;
        }
      } // ADD CHECK FOR IF ITS JUST 'United States' && Add Handling for if it doesn't meet these requirements OR IF IT IS GREATER SOMETHING AREA (Greater Chicago Area, New York City Metropolitan Area, etc.)
      else {
        location = document
          .querySelector('[class$="_primary-description"')
          .innerText.split(" · ")[1]
          .match(/(.*),\s*([A-Za-z]{2})/)[0];
      }
      let datePosted = "";
      //check if the job has been reposted to remove "Reposted" before date
      if (
        document
          .querySelector('[class$="_primary-description"')
          .innerText.split(" · ")[1]
          .replace(location, "")
          .trim()
          .includes("Reposted")
      ) {
        datePosted = getDateFromRelativeTime(
          document
            .querySelector('[class$="_primary-description"')
            .innerText.split(" · ")[1]
            .replace(location, "")
            .replace("Reposted", "")
            .trim()
        );
      } else {
        datePosted = getDateFromRelativeTime(
          document
            .querySelector('[class$="_primary-description"')
            .innerText.split(" · ")[1]
            .replace(location, "")
            .trim()
        );
      }

      // get salary from job insight
      let salary = document.querySelectorAll('[class$="_job-insight"')[0]
        .children[1].children[0].innerText;
      let salaryMin = 0;
      let salaryMax = 0;
      if (salary.includes("$")) {
        // TODO: Add support for non-range (e.g. $50/hr or $100,000/yr)
        if (salary.includes("-")) {
          if (salary.includes("/yr")) {
            salaryMin = salary
              .split("-")[0]
              .replace("$", "")
              .replace(",", "")
              .replace("/yr", "")
              .trim();
            salaryMax = salary
              .split("-")[1]
              .replace("$", "")
              .replace(",", "")
              .replace("/yr", "")
              .trim();
          }
          if (salary.includes("/hr")) {
            salaryMin = salary
              .split("-")[0]
              .replace("$", "")
              .replace(",", "")
              .replace("/hr", "")
              .trim();
            salaryMax = salary
              .split("-")[1]
              .replace("$", "")
              .replace(",", "")
              .replace("/hr", "")
              .trim();
          }
        }
      }
      let description = document.getElementById("job-details").innerText; //TODO: See if I can fix formatting a bit so it doesnt have SOO much blank space
      //   console.log(description);
      //   console.log(salary);
      //   console.log(salaryMin);
      //   console.log(salaryMax);
      //   console.log(datePosted); // TODO: CHECK IF InnerText includes Reposted, otherwise this works
      //   console.log(location);
      //   console.log(companyName);
      //   console.log(appUrl);
      //   console.log(document.querySelector('[class$="_job-title"').innerText);
      let jobTitle = document.querySelector('[class$="_job-title"').innerText;

      const jobInfo = {
        jobTitle: jobTitle,
        appURL: appUrl,
        companyName: companyName,
        location: location,
        dateCreated: datePosted,
        salaryMin: salaryMin,
        salaryMax: salaryMax,
        desc: description,
        appStatus: appStatus,
        ATS: "LinkedIn",
      };
      console.log(jobInfo);
      return jobInfo;
    }

    // Send extracted data to the background script and handle the response
    chrome.runtime.sendMessage(
      { action: "extractJobInfo", data: extractJobInfo() },
      function (response) {
        console.log("Response from background script:", response);
      }
    );
  }
});

// Assume you have a function to update the popup UI
function getPageInfo() {
  // Your logic to extract information from the page
  let companyName = document
    .querySelector('[class$="_primary-description"')
    .innerText.split(" · ")[0];
  let jobTitle = document.querySelector('[class$="_job-title"').innerText;

  const pageInfo = {
    companyName: companyName,
    jobTitle: jobTitle,
    // Add more properties as needed
  };

  console.log("Updating popup UI with data:", pageInfo);
  chrome.runtime.sendMessage(
    { action: "pageInfo", data: pageInfo },
    function (response) {
      console.log("Response from background script:", response);
    }
  );
}

// Add a listener for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "extractPageInfo") {
    // Call the function to extract page information
    setTimeout(getPageInfo, 1000);
  }
});
