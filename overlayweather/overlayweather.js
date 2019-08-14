function createOverlay(){
    var files = document.getElementById('fileinput').files;
    var imgName = files[0].name;

    var kml = [];
    kml.push('<?xml version="1.0" encoding="UTF-8"?>');
    kml.push('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">');
    kml.push('<GroundOverlay>');
    kml.push('<name>' + imgName + '</name>');
    kml.push('<color>52ffffff</color>');
    kml.push('<Icon>');
    kml.push('<href>files/' + imgName + '</href>');
    kml.push('<viewBoundScale>0.75</viewBoundScale>');
    kml.push('</Icon>');
    kml.push('<LatLonBox>');
    kml.push('<north>-42.53184169617862</north>');
    kml.push('<south>-47.11614060282076</south>');
    kml.push('<east>172.7438189963526</east>');
    kml.push('<west>166.343352592303</west>');
    kml.push('<rotation>-41.78198623657227</rotation>');
    kml.push('</LatLonBox>');
    kml.push('</GroundOverlay>');
    kml.push('</kml>');
    
    //add new line characters
    for (var i = 0; i < kml.length; i++){
        kml[i] += '\n';
    }

    var zip = new JSZip();
    zip.folder('files').file(imgName, files[0]);
    zip.file('doc.kml', new Blob(kml, {type : 'text/xml'}));
    zip.generateAsync({type:"blob"})
            .then(function(blob){
                const tmpURL = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = tmpURL;
                a.download = imgName.replace('.png', '.kmz');
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(tmpURL);
            });
}