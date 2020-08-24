function onLoad(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("data").innerHTML = this.responseText;
            var txtJSON = this.responseText;
            var objJSON = JSON.parse(txtJSON);
            var txt = "";
            for (var obj of objJSON){
                for (var prop in obj){
                    txt += obj[prop] + " ";
                }
                txt += "<br>";
            }
            document.getElementById("data").innerHTML += "<br>" + txt;
        }
    };
    xhttp.open("GET", "cgi/getData.py?table=airfields", true);
    xhttp.send();
}