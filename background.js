// delete the cookies n stuff
function deleteTheCookies(callback){
  // delete the cookies
  chrome.cookies.getAll({domain: "www.youtube.com"}, (cookies) => {
    console.log("deleting " + cookies.length + " cookies")
    for(var i = 0; i < cookies.length; i++){
      console.log(i+1 + " deleted")
      chrome.cookies.remove({
        url: "https://www.youtube.com" + cookies[i].path,
        name: cookies[i].name
      })
    }
    callback(cookies.length)
  })
}

chrome.alarms.onAlarm.addListener((alarm) => {
  deleteTheCookies((cookiesLength) => {})
})

// respond to the message from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.type == "deleteTheCookies"){
    deleteTheCookies((cookiesLength) => {
      //send the response
      sendResponse({cookiesLength: cookiesLength})
    })
  }
  return true
})
