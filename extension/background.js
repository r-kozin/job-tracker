// background.js
console.log("Background script loaded");
let latestInfo = {};

chrome.runtime.onInstalled.addListener(function () {
  console.log("Job Tracker Extension Installed");
});

async function addToDatabase(jobInfo) {
  const res = await fetch("http://localhost:3000/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobInfo),
  });
  console.log("Adding job to the database:", jobInfo);
  console.log(res);

  return res;
}

// Handle messages from the content script
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "extractJobInfo") {
    console.log("Job information received from content script:", msg.data);

    // Add job information to the database
    addToDatabase(msg.data).then((data) => {
      console.log(data);
      if (data.status === 200) {
        sendResponse({
          action: "jobAdded",
          data: "Job added to database!",
        });
        chrome.runtime.sendMessage({ action: "updateJobAdded" }, function (response) {
          if (response.success) {
            console.log("updated UI with new job added");
          }
        });
      }
    });
  }
  if (msg.action === "pageInfo") {
    console.log("Page information received from content script:", msg.data);
    sendResponse({ success: true });
    latestInfo = msg.data;
  }
  if (msg.action === "getLatestInfo") {
    sendResponse({ success: true, data: latestInfo });
  }
});

function handleHistoryStateUpdated(details) {
  console.log("History state updated:", details.url);
  if (details.url.includes("linkedin.com/jobs/view/") || details.url.includes("linkedin.com/jobs/search/") || details.url.includes("linkedin.com/jobs/collections/")) {
    chrome.tabs.sendMessage(details.tabId, { action: "extractPageInfo" });
    console.log("Job page loaded, message sent for page info");
    if (details.url.includes("postApplyJobId")) {
      console.log("Job application submitted!");
      chrome.notifications.create(
        {
          type: "basic",
          iconUrl: "images/icon.png",
          title: "Add to Job Tracker?",
          message:
            "We noticed you applied to a job on LinkedIn. Make sure to open the extension and add it to your tracker!",
          priority: 2, // Set priority (0 is default)
          eventTime: Date.now() + 3000, // Set event time (milliseconds since the epoch)
        },
        function (notificationId) {
          if (chrome.runtime.lastError) {
            console.error(
              "Error creating notification:",
              chrome.runtime.lastError
            );
          } else {
            console.log("Notification created with ID:", notificationId);
          }
        }
      );
    }
  } else {
    console.log("Not a job page, no message sent");
    latestInfo = {};
  }
}

chrome.webNavigation.onHistoryStateUpdated.addListener(
  handleHistoryStateUpdated
);

chrome.webNavigation.onCompleted.addListener(handleHistoryStateUpdated);
