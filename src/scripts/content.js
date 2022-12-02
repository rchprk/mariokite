if (typeof browser === "undefined") {
  var browser = chrome;
}

const buildHeader = document.getElementsByClassName("build-header")[0];

const buildStatuses = {
  passed: "build-state-passed",
  failed: "build-state-failed",
  canceled: "build-state-canceled",
  building: "build-state-building",
  preBuilt: "pre-built",
};

const listenButton = document.getElementById("listen-button");

// var sound = (file) => new Audio(chrome.runtime.getURL(`./audio/${file}`));
// sound.play();

// https://quicksounds.com/library/sounds/mario
var sound = (file) => new Audio(chrome.runtime.getURL(file));

// base function from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
const waitForElement = (className) => {
  return new Promise((resolve) => {
    const elementCheck = () =>
      buildHeader.getElementsByClassName(className).length > 0;

    const element = () => buildHeader.getElementsByClassName(className)[0];

    if (elementCheck()) {
      console.log("resolving: ", element());
      resolve(buildStatuses.preBuilt);
    } else {
      const observer = new MutationObserver((mutations) => {
        if (elementCheck()) {
          console.log("resolving: ", element());
          resolve(element());
          observer.disconnect();
        } else {
          observer.observe(buildHeader, {
            childList: true,
            subtree: true,
          });
        }
      });

      observer.observe(buildHeader, {
        childList: true,
        subtree: true,
      });
    }
  });
};

let buildStatus;

async function retrieveStatus() {
  try {
    let buildElement = await Promise.any([
      waitForElement(buildStatuses.passed),
      waitForElement(buildStatuses.failed),
      waitForElement(buildStatuses.canceled),
    ]);

    if (buildElement === buildStatuses.preBuilt) {
      buildStatus = buildStatuses.preBuilt;
    } else {
      const classList = Array.from(buildElement.classList);
      buildStatus = classList.find((name) =>
        Object.values(buildStatuses).includes(name)
      );
    }
  } catch (err) {
    alert(err);
  }

  switch (buildStatus) {
    case buildStatuses.passed:
      window
        .open(
          "https://quicksounds.com/uploads/tracks/494252996_1728349084_1953913782.mp3",
          "_blank"
        )
        .focus();
      console.log("=======");
      console.log("PASSED");
      console.log("=======");
      break;

    case buildStatuses.failed:
    case buildStatuses.canceled:
      window
        .open("https://www.youtube.com/watch?v=m9zhgDsd4P4", "_blank")
        .focus();
      console.log("=======");
      console.log("FAILED");
      console.log("=======");
      break;

    case buildStatuses.preBuilt:
      break;

    default:
      window
        .open("https://www.youtube.com/watch?v=Cc_HRIX_MdM", "_blank")
        .focus();
      console.log("=======");
      console.log("WHAT");
      console.log("=======");
  }
}

if (buildHeader) {
  retrieveStatus();
} else {
  console.log("! -- this doesn't look like a build page -- !");
}
