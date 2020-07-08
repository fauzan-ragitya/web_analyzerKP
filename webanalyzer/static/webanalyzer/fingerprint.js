var client = new ClientJS(); // Create A New Client Object
      
var fingerprint = client.getFingerprint(); // Get Client's Fingerprint
var browser = client.getBrowser(); // Get Browser
var operatingSystem = client.getOS(); // Get Device Type
var mobile = client.isMobile(); // Check For Mobile
var language = client.getLanguage(); // Get User Language

$.ajax({
  // points to the url where your data will be posted
  url:'',
  // post for security reason
  type: "POST",
  // data that you will like to return 
  data: {
    csrfmiddlewaretoken: csrftoken,
    fingerprint: fingerprint, 
    browser: browser, 
    OS: operatingSystem, 
    mobile: mobile, 
    language: language,
    state: "in"
  },  
  // what to do when the call is success 
  success:function(response){},
  // what to do when the call is complete ( you can right your clean from code here)
  complete:function(){},
  // what to do when there is an error
  error:function (xhr, textStatus, thrownError){}
});

window.addEventListener('beforeunload', function (e) { 
   $.ajax({
  // points to the url where your data will be posted
  url:'',
  // post for security reason
  type: "POST",
  // data that you will like to return 
  data: {
    csrfmiddlewaretoken: csrftoken,
    fingerprint: fingerprint, 
    state: "out"
  },  
  // what to do when the call is success 
  success:function(response){},
  // what to do when the call is complete ( you can right your clean from code here)
  complete:function(){},
  // what to do when there is an error
  error:function (xhr, textStatus, thrownError){}
  });
}); 

