function convertFile(){
    var files = document.getElementById('fileinput').files;
    var reader = new FileReader();

    reader.onload = function(){
        var cup = reader.result;
        var cups1d = cup.split('\n'); //this is a 1D array
        
        //index numbers of waypoints sorted by type
        var idxTurnpoints = [];
        var idxLandouts = [];
        var idxMtnTops = [];
        var idxMtnPasses = [];
        var idxReportPt = [];

        //next split the elements on , to make a 2D array
        var cups2d = [];
        for (var i = 0, f; f = cups1d[i]; i++){
            cups2d[i] = cups1d[i].split(',');
            switch(cups2d[i][6]){
                case "1": idxTurnpoints.push(i); break;
                case "2": addtoLandouts(); break;
                case "3": addtoLandouts(); break;
                case "4": addtoLandouts(); break;
                case "5": addtoLandouts(); break;
                case "6": idxMtnPasses.push(i); break;
                case "7": idxMtnTops.push(i); break;
                case "17": idxReportPt.push(i); break;
            }
            function addtoLandouts(){
                idxLandouts.push(i);
                // alert(cups1d[i]);
            }
        }

        
        
        document.getElementById('output').innerHTML = cups1d.join('<br>').substring(0,1200);
    }
    reader.readAsText(files[0]);


    // var output = [];
    // // for (var i = 0, f; f = files[i]; i++){
    //     output.push('<li><strong>', escape(files[0].name), '</strong></li>');
    // // }
    // document.getElementById('output').innerHTML = '<ul>' + output.join('') + '</ul>';
}