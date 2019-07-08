//for information on cup file format, see http://download.naviter.com/docs/CUP-file-format-description.pdf

function convertFile(){
    var files = document.getElementById('fileinput').files;
    var cupname = files[0].name;
    var reader = new FileReader();

    reader.onload = function(){
        var cup = reader.result.replace(/&/g,'and');
        var cups1d = cup.split('\n'); //this is a 1D array
        
        //index numbers of waypoints sorted by type
        var idxTurnpoints = [];
        var idxLandouts = [];
        var idxMtnTops = [];
        var idxMtnPasses = [];
        var idxReportPt = [];

        //next split the elements on , to make a 2D array
        var cups2d = [];

        //Build indexes so the waypoints can be sorted by type.
        //Lines which are not waypoints, e.g. the first line, will be skipped.
        for (var i = 0; i < cups1d.length; i++){
            cups2d[i] = cups1d[i].split(',');
            switch(cups2d[i][6]){
                case '0': addtoTurnpoints(); break;             //Unknown
                case '1': addtoTurnpoints(); break;             //Waypoint
                case '2': addtoLandouts(); break;               //Airfield with grass runway
                case '3': addtoLandouts(); break;               //Outlanding
                case '4': addtoLandouts(); break;               //Gliding airfield
                case '5': addtoLandouts(); break;               //Airfield with solid runway
                case '6': idxMtnPasses.push(i); break;          //Mountain pass
                case '7': idxMtnTops.push(i); break;            //Mountain top
                case '8': addtoTurnpoints(); break;             //Transmitter mast
                case '9': addtoTurnpoints(); break;             //VOR
                case '10': addtoTurnpoints(); break;            //NDB
                case '11': addtoTurnpoints(); break;            //Cooling tower
                case '12': addtoTurnpoints(); break;            //Dam
                case '13': addtoTurnpoints(); break;            //Tunnel
                case '14': addtoTurnpoints(); break;            //Bridge
                case '15': addtoTurnpoints(); break;            //Power plant
                case '16': addtoTurnpoints(); break;            //Castle
                case '17': idxReportPt.push(i); break;          //Intersection  //used in NZ for VFR reporting points
            }
            function addtoLandouts(){idxLandouts.push(i);}
            function addtoTurnpoints(){idxTurnpoints.push(i);}
        }

        var wpCount = 0;
        var failCount = 0;

        //build the kml file as an array
        var kml = []
        kml.push('<?xml version="1.0" encoding="UTF-8"?>');
        kml.push('<kml xmlns="http://www.opengis.net/kml/2.2">');
        kml.push('<Document>');    
        writeFolder(idxLandouts,'Landouts','IconWindsock.png');
        writeFolder(idxTurnpoints,'Turnpoints','IconTP.png');
        writeFolder(idxMtnPasses, 'Mountain Passes', 'IconMtnPass.png');
        writeFolder(idxMtnTops, 'Mountain Tops', 'IconMtnTop.png');
        writeFolder(idxReportPt,'Reporting Points', 'IconRepPt.png');
        kml.push('</Document>');
        kml.push('</kml>')

        //add new line characters
        for (var i = 0; i < kml.length; i++){
            kml[i] += '\n';
        }

        //get the user to download the kml file
        var blb = new Blob(kml, {type : 'text/xml'});
        const tmpURL = window.URL.createObjectURL(blb);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = tmpURL;
        a.download = cupname.replace('.cup', '') + '.kml';
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(tmpURL);

        //make the zip folder
        var zip = new JSZip();
        var kmzname = cupname.replace('.cup', '') + '.kmz';
        var IconTP, IconWindsock, IconMtnPass, IconMtnTop, IconRepPt;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                IconTP = new Blob(xhr.response, {type: 'image/png'});
            }
        }
        xhr.open ('GET', 'IconTP.png');
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        

        // $.get('/IconTP.png', function(data){
        //     IconTP = new Blob([data], {type: 'image/png'});
        //     report('IconTP imported');
        // });
        // $.get('IconWindsock.png', function(data, status){IconWindsock = new Blob([data], {type: 'image/png'});});
        // $.get('IconMtnPass.png', function(data, status){IconMtnPass = new Blob([data], {type: 'image/png'});});
        // $.get('IconMtnTop.png', function(data, status){IconMtnTop = new Blob([data], {type: 'image/png'});});
        // $.get('IconRepPt.png', function(data, status){IconRepPt = new Blob([data], {type: 'image/png'});});
        zip.folder(kmzname).file('IconTP.png', IconTP);
        zip.folder(kmzname).file('IconWindsock.png', IconWindsock);
        zip.folder(kmzname).file('IconMtnPass.png', IconMtnPass);
        zip.folder(kmzname).file('IconMtnTop.png', IconMtnTop);
        zip.folder(kmzname).file('IconRepPt.png', IconRepPt);
        zip.folder(kmzname).file(a.download, blb);

        /*
        I'm stuck trying to import image data into blobs in memory in order to put the icons into the zip. Ideas:
        1. Access the data with a HTTP GET request, e.g. jQuery $.get()
            Problem: this isn't returning any data.
            -8/7/19 trying with XmlHttpRequest, setting responseType = 'arraybuffer'
        2. Put hidden <img> tags in the html with src set to the icon URL. Access these using getElementById().
            Problems: can the raw data be accessed like this? Does a img element have a .files property?
        */

        var kmzBlob = new Blob([zip], {type: 'application/zip'});
        //test whether pngs are being imported correctly
        const urlb = window.URL.createObjectURL(IconTP);
        const b = document.createElement('a');
        b.style.display = 'none';
        b.href = urlb;
        b.download = "IconTP.png";
        document.body.appendChild(b);
        b.click();
        window.URL.revokeObjectURL(urlb);

        
        report('File conversion successful! ' + wpCount + ' waypoints converted, ' + failCount + ' skipped.');


        /////////////////////// FUNCTIONS ///////////////////////

        function report(strMsg){
            document.getElementById('output').innerHTML += strMsg + '<br>';
        }

        function writeFolder(idxArray, strFolderName, strIconPath){
            kml.push('<Style id="' + strFolderName + '">')
            kml.push('<IconStyle>');
            kml.push('<Icon>');
            kml.push('<href>' + strIconPath + '</href>');
            kml.push('</Icon>');
            kml.push('</IconStyle>');
            kml.push('</Style>');
            
            kml.push('<Folder>');
            kml.push('<name>' + strFolderName + '</name>');
            for (var i = 0; i < idxArray.length; i++){
                var newPt = [];
                try {
                    var index = idxArray[i];
                    newPt.push('<Placemark>');
                    newPt.push('<name>' + cups2d[index][0] + '</name>');
                    newPt.push('<description>' + cups2d[index][10] + '</description>');
                    newPt.push('<styleUrl>#' + strFolderName + '</styleUrl>');
                    newPt.push('<Point>');
                    newPt.push('<coordinates>' + convertLatLong(cups2d[index][4]) + ', ' + convertLatLong(cups2d[index][3]) + '</coordinates>');
                    newPt.push('</Point>');
                    newPt.push('</Placemark>');
                    Array.prototype.push.apply(kml, newPt);
                    wpCount++
                } 
                catch (error) {
                    report('Error! Point skipped: ' + cups2d[index][0]);
                    failCount++
                }
            }
            kml.push('</Folder>');
        }

        function convertLatLong(cupLatOrLong){
            var sign, deg, min, limit;
            switch (cupLatOrLong.charAt(cupLatOrLong.length - 1)){
                case 'N': sign = 1; isLat(); break;
                case 'E': sign = 1; isLong(); break;
                case 'S': sign = -1; isLat(); break;
                case 'W': sign = -1; isLong(); break;
                throw 'Latitude or longitude ' + cupLatOrLong + ' invalid!'
            }
            function isLat(){
                deg = cupLatOrLong.substring(0, 2);
                min = cupLatOrLong.substring(2, cupLatOrLong.length - 1);
                limit = 90;
            }
            function isLong(){
                deg = cupLatOrLong.substring(0, 3);
                min = cupLatOrLong.substring(3, cupLatOrLong.length - 1);
                limit = 180;
            }
            var magnitude = Number(deg) + Number(min / 60);
            if (magnitude > limit){
                throw 'Latitude or longitude ' + cupLatOrLong + ' invalid!';
            }
            return (magnitude * sign);
        }
    }




    reader.readAsText(files[0]);
}