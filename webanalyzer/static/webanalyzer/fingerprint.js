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

// Collect heatmap data
var box = document.querySelector('html').getBoundingClientRect(); //Mendapatkan nilai posisi si "box" -> pada kasus ini seluruh document html yang digunakan

//variabel container buat heatmap terus di append ke body
var hm = document.createElement('div');
document.body.appendChild(hm);

//Mengatur posisi divisi heatmap yang baru
hm.style.top = 0;
hm.style.left = 0;// koordinat (0,0) -> pojok kiri atas
hm.style.width = box.width + 'px'; //Lebar div sesuai dengan box dokumen
hm.style.height = Math.min(5000, box.height) + 'px';
hm.style.zIndex = Number.MAX_SAFE_INTEGER;

hm.style.position = 'absolute';

var trackData = false;
setInterval( function() {
    trackData = true;
}, 100 );

// Declaring Array buat nyimpen value heatmap
const x = [];
const y = [];

var idleTimeout, idleInterval;
var lastX, lastY;
var idleCount;

//function buat handle user idle
function startIdle() {

    idleCount = 0;

    function idle() {

        // heatmap.addData({ x:lastX, y:lastY });
        x.push(lastX);
        y.push(lastY);
        console.log(x);
        console.log(y);

        idleCount++;

        if( idleCount > 10 ) {
            clearInterval( idleInterval ); //kalo lebih dari 10 detik, maka idle gak nyala lagi
        }//end if

    };

    idle();

    idleInterval = setInterval( idle, 1000 );//nyalain idle tiap sedetik

}   ;

hm.onmousemove = function( ev ) {

    if( idleTimeout ) {
        clearTimeout( idleTimeout );
    }//end if

    if( idleInterval ) {
        clearInterval( idleInterval );
    }//end if

    if( trackData ) {
        //Koordinat x dan y dari pointer pada layar
        lastX = ev.pageX;
        lastY = ev.pageY;
        // heatmap.addData({ x:lastX, y:lastY });
        x.push(lastX);
        y.push(lastY);
        console.log(x);
        console.log(y);
        trackData = false;
    }//end if

    idleTimeout = setTimeout( startIdle, 500 );

};

hm.onmouseout = function( ev ) {//execute fungsi ini kalo mouse keluar dari hm
    if( idleTimeout ) {
        clearTimeout( idleTimeout );
    }//end if

    if( idleInterval ) {
        clearInterval( idleInterval );
    }//end if
}

hm.onclick = function( ev ) {
    lastX = ev.pageX;
    lastY = ev.pageY;
    // heatmap.addData({ x:lastX, y:lastY, value: 5 });
    for (i = 0; i < 5; i++) {
        x.push(lastX);
        y.push(lastY);    
    }
    console.log(x)
    console.log(y)
};

window.onunload = window.onbeforeunload = function () {
  $.ajax({
    // points to the url where your data will be posted
    url: "",
    // post for security reason
    type: "POST",
    // data that you will like to return
    data: {
      csrfmiddlewaretoken: csrftoken,
      fingerprint: fingerprint,
      heatmapX: x,
      heatmapY: y,
      state: "out",
    },
    // what to do when the call is success
    success: function (response) {},
    // what to do when the call is complete ( you can right your clean from code here)
    complete: function () {},
    // what to do when there is an error
    error: function (xhr, textStatus, thrownError) {},
  });
};

