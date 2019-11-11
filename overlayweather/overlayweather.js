function createOverlay(){
    var files = document.getElementById('fileinput').files;
    var imgName = files[0].name;
    var coords;
    switch (document.getElementById('maparea').value){
        case '4':
            coords = '164.9970690761069,-44.99139418318028,0 169.7961221411751,-48.12341158631071,0 174.0290219131923,-44.64767786153754,0 169.3214752808527,-41.7092441448925,0';
            break;
        case '3':
            coords = '168.5230207617914,-42.85576057944731,0 172.913553742396,-45.15627600111033,0 175.9473339012809,-41.92145632549207,0 171.7169641608211,-39.71815997670134,0';
            break;
    }

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
    kml.push('<gx:LatLonQuad>');
    kml.push('<coordinates>');
    kml.push(coords);
    kml.push('</coordinates>');
    kml.push('</gx:LatLonQuad>');
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