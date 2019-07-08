//for information on cup file format, see http://download.naviter.com/docs/CUP-file-format-description.pdf

function convertFile(){
    var files = document.getElementById('fileinput').files;
    var filename = files[0].name.replace('.cup', '');
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

        //make the zip folder
        var zip = new JSZip();
        var kmzname = filename + '.kmz';
        var kmlname = filename + '.kml';
        var iconsInZip = 0;

        zip.file(kmlname, new Blob(kml, {type : 'text/xml'}));
        addIcon('IconTP.png');
        addIcon('IconWindsock.png');
        addIcon('IconMtnPass.png');
        addIcon('IconMtnTop.png');
        addIcon('IconRepPt.png');


        /////////////////////// FUNCTIONS ///////////////////////

        function addIcon(iconUrl){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    var iconBlob = new Blob([this.response], {type: 'image/png'});
                    zip.file(iconUrl, iconBlob);
                    iconsInZip++;
                    if (iconsInZip == 5){finishAndDownload();}
                }
            }
            xhr.open ('GET', iconUrl);
            xhr.responseType = 'arraybuffer';
            xhr.send();
        }

        function finishAndDownload(){
            zip.generateAsync({type:"blob"})
            .then(function(blob){
                const tmpURL = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = tmpURL;
                a.download = kmzname;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(tmpURL);
            });
            report('File conversion successful! ' + wpCount + ' waypoints converted, ' + failCount + ' skipped.');
        }

        function report(strMsg){
            document.getElementById('output').innerHTML += strMsg + '<br>';
        }

        function writeFolder(idxArray, strFolderName, strIconPath){
            kml.push('<Style id="' + strFolderName + '">');
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
                    Array.prototype.push.apply(kml, newPt);     //do this last so that any errors will cause the point to be skipped
                    wpCount++;
                } 
                catch (error) {
                    report('Error! Point skipped: ' + cups2d[index][0]);
                    failCount++;
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