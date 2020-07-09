var box = document.querySelector("html").getBoundingClientRect(); //Mendapatkan nilai posisi si "box" -> pada kasus ini seluruh document html yang digunakan
//console.log(box)

//variabel container buat heatmap terus di append ke body
var hm = document.createElement("div");
document.body.appendChild(hm);

//Mengatur posisi divisi heatmap yang baru
hm.style.top = 0;
hm.style.left = 0; // koordinat (0,0) -> pojok kiri atas
hm.style.width = box.width + "px"; //Lebar div sesuai dengan box dokumen
hm.style.height = Math.min(5000, box.height) + "px";
hm.style.zIndex = Number.MAX_SAFE_INTEGER; //Biar si hm selalu ada di paling depan (stack order) makinn besar makin di depan

var heatmap = h337.create({ container: hm, radius: 60 });

document.querySelector("html").style.position = "relative";
hm.style.position = "absolute";

var i;

for (i = 0; i < x_axis.length; i++) {
  xPoint = x_axis[i];
  yPoint = y_axis[i];
  heatmap.addData({ x: xPoint, y: yPoint });
}
