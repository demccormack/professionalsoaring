function convertFile(){
    var files = document.getElementById('fileinput').files;
    var reader = new FileReader();

    reader.onload = function(){
        var cup = reader.result.replace('&','and');
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
        kml.push('<?xml version=""1.0"" encoding=""UTF-8""?>');
        kml.push('<kml xmlns=""http://www.opengis.net/kml/2.2"">');
        kml.push('<Document>');    
        
        writeFolder(idxLandouts,'Landouts','IconWindsock.png');
        writeFolder(idxTurnpoints,'Turnpoints','IconTP.png');
        writeFolder(idxMtnPasses, 'Mountain Passes', 'IconMtnPass.png');
        writeFolder(idxMtnTops, 'Mountain Tops', 'IconMtnTop.png');
        writeFolder(idxReportPt,'Reporting Points', 'IconRepPt.png');

        kml.push('</Document>');
        kml.push('</kml>')

        //output to browser for debugging
        document.getElementById('output').innerHTML = kml.join('<br>');//.substring(0,1200);
    }
    reader.readAsText(files[0]);
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
        var index = idxArray[i];
        kml.push('<Placemark>');
        kml.push('<name>' + cups2d[index][0] + '</name>');
        kml.push('<description>' + cups2d[index][10] + '</description>');
        kml.push('<styleUrl>#' + strFolderName + '</styleUrl>');
        kml.push('<Point>');
        kml.push('<coordinates>NO COORDINATES</coordinates>'); //needs conversion
        kml.push('</Point>');
        kml.push('</Placemark>');
    }
    kml.push('</Folder>');
}