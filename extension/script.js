document.addEventListener("DOMContentLoaded", function () {
  console.log("script.js loaded");

  // popup.js

  // Function to update the UI based on the received information
  function updatePopupUI(message) {
    console.log("Received message:", message);
    if(message.companyName === undefined || message.jobTitle === undefined){
      document.getElementById("companyName").style.display = "none";
      document.getElementById("jobTitle").style.display = "none";
    }
    // Replace this with your logic to update the UI
    document.getElementById("companyName").innerText = message.companyName;
    document.getElementById("jobTitle").innerText = message.jobTitle;
    // Update other UI elements as needed
  }

  chrome.runtime.sendMessage({ action: "getLatestInfo" }, function (response) {
    if (response.success) {
        console.log(response.data)
      updatePopupUI(response.data);
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
