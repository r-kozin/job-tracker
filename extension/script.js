document.addEventListener("DOMContentLoaded", function () {
  console.log("script.js loaded");

  // Function to update the UI based on the received information
  function updatePopupUI(message) {
    console.log("Received message:", message);
    if (message.companyName === undefined || message.jobTitle === undefined) {
      document.getElementById("companyName").style.display = "none";
      document.getElementById("jobTitle").style.display = "none";
      document.getElementById("jobAdded").style.display = "none";
    }
    // Update the popup with the received information
    document.getElementById("companyName").innerText = message.companyName;
    document.getElementById("jobTitle").innerText = message.jobTitle;
    document.getElementById("jobAdded").style.display = "none";
  }

  function updateJobAdded(message) {
    console.log("Received message:", message);
    // Update the popup with the job added message
    document.getElementById("jobAdded").style.display = "block";
    setTimeout(function () {
      document.getElementById("jobAdded").style.display = "none";
    }, 3000);
  }

  chrome.runtime.sendMessage({ action: "getLatestInfo" }, function (response) {
    if (response.success) {
      console.log(response.data);
      updatePopupUI(response.data);
    }
  });

  // Handle messages from the background script
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "updateJobAdded") {
      console.log("Job added, updating UI");
      updateJobAdded(msg);
      sendResponse({
        action: "updatedJobAdded",
        data: "UI Updated!",
      });
    }
  });

  // Add an event listener to the "Add Job" button
  document
    .getElementById("addJobButton")
    .addEventListener("click", function () {
      // Send a message to the content script when the button is clicked
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let activeTab = tabs && tabs.length > 0 ? tabs[0] : null;

        if (activeTab) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "addJobButtonClicked" },
            function (response) {
              // Handle the response if needed
              console.log("Response from content script:", response);
            }
          );
        } else {
          console.error("No active tab found.");
        }
      });
    });
});
