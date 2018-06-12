// delete the cookies
$("#fixTheCookiesButton").click(() => {

  // open the background page (async)
  chrome.runtime.getBackgroundPage((bgPage) => {

    // delete the cookies
    var cookiesLength = bgPage.deleteTheCookies()
    console.log(cookiesLength)

    switch(cookiesLength){

      // if nothing was deleted...
      case 0:
        $("#statusMessage").html("<span class=\"text-info\">Nothing to be fixed</span>")
        setTimeout(() => {
          $("#statusMessage").html("")
        }, 1000)
        break

      // if there was an error...
      case undefined:
        $("#statusMessage").html("<span class=\"text-danger font-weight-bold\">ERROR!</span>")
        setTimeout(() => {
          $("#statusMessage").html("")
        }, 1000)
        break

      // if something was deleted...
      default:
        $("#statusMessage").html("<span class=\"text-success\">Fixed!</span>")
        setTimeout(() => {
          $("#statusMessage").html("")
        }, 1000)
    }
  })
})

// stores whether or not periodical erasing is being done
var periodically

// check if periodical erasing is in action
function checkPeriodically(){

  chrome.storage.local.get("periodically", (result) => {

    // if periodical erasing is already running on this machine...
    if(result.periodically){

      // change the button in the GUI
      $("#periodicallySwitchButton").html("Stop erasing periodically")
      $("#periodicallySwitchButton").addClass("btn-danger")

      // set the local var
      periodically = true
    }

    // if periodical erasing is not running...
    else{

      // change the button in the GUI
      $("#periodicallySwitchButton").html("Start erasing periodically")
      $("#periodicallySwitchButton").removeClass("btn-danger")

      // set the local var
      periodically = false
    }
  })
}

// check if periodical erasing is already in action
checkPeriodically()

$("#periodicallySwitchButton").click(() => {
  // if we periodical erasing is running, stop it
  if(periodically){
    // store the variable
    chrome.storage.local.set({periodically: false}, () => {
      console.log("periodically = false")

      // update the GUI and the local variable
      checkPeriodically()

      // delete the alarm
      chrome.alarms.clear("periodically")
    })
  }

  // if periodical erasing isn't running, start it
  else{
    // store the variable
    chrome.storage.local.set({periodically: true}, () => {
      console.log("periodically = true")

      // update the GUI and the local variable
      checkPeriodically()

      // create the alarm
      chrome.alarms.create("periodically", {periodInMinutes: 1500})
    })
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if(alarm.name == "periodically"){
    deleteTheCookies()
  }
})
