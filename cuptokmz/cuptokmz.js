function convertFile(){
    var files = document.getElementById('fileinput').files;
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

        //Build indexes so the waypoints can be sorted by type
        for (var i = 0; i < cups1d.length; i++){
            cups2d[i] = cups1d[i].split(',');
            switch(cups2d[i][6]){
                case '1': addtoTurnpoints(); break;
                case '2': addtoLandouts(); break;
                case '3': addtoLandouts(); break;
                case '4': addtoLandouts(); break;
                case '5': addtoLandouts(); break;
                case '6': idxMtnPasses.push(i); break;
                case '7': idxMtnTops.push(i); break;
                case '8': addtoTurnpoints(); break;
                case '9': addtoTurnpoints(); break;
                case '10': addtoTurnpoints(); break;
                case '11': addtoTurnpoints(); break;
                case '12': addtoTurnpoints(); break;
                case '13': addtoTurnpoints(); break;
                case '14': addtoTurnpoints(); break;
                case '15': addtoTurnpoints(); break;
                case '16': addtoTurnpoints(); break;
                case '17': idxReportPt.push(i); break;
            }
            function addtoLandouts(){idxLandouts.push(i);}
            function addtoTurnpoints(){idxTurnpoints.push(i);}
        }

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
        a.download = 'result.kml';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(tmpURL);
        alert('Done!');


        /////////////////////// FUNCTIONS ///////////////////////////

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
                } 
                catch (error) {
                    alert('Error: point "' + cups2d[index][0] + '" will be omitted');
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