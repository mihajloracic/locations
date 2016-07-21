var dataJSON = {
    "lokacije": [{
        "x": "45.254914",
        "y": "19.842342"
    }, {
        "x": "45.254914",
        "y": "19.855642"
    }, {
        "x": "45.252914",
        "y": "19.844642"
    }, {
        "x": "45.254914",
        "y": "19.821642"
    }, {
        "x": "45.254184",
        "y": "19.845642"
    }, {
        "x": "45.254914",
        "y": "19.844642"
    }, {
        "x": "45.252114",
        "y": "19.865642"
    }]
}
var loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam venenatis posuere augue, eu mattis lacus mollis dignissim. Mauris rutrum, elit eu egestas vulputate, risus erat ultricies nibh, eget cursus nulla quam at risus. Nam mi dui, pulvinar vitae ligula sit amet, accumsan dictum purus. Aenean consequat dignissim neque quis gravida. Aliquam lobortis pellentesque sem id feugiat. Nulla sit amet porttitor risus, ac venenatis ipsum. Pellentesque a odio quis augue malesuada porta. Nullam vitae dolor et orci tincidunt malesuada. Suspendisse egestas vitae mi at tincidunt.';
var itertor = 0;
//uzima od Gugla imena tih lokacija pa promeni json title u to
function initName() {
    if (itertor == dataJSON.lokacije.length) {
        setWheel();
        return;
    }
    var origin1 = new google.maps.LatLng(45.254914, 19.844642);
    var origin2 = "Novi Sad Trg Slobode";
    var destinationA = 'Baoo';
    var destinationB = new google.maps.LatLng(dataJSON.lokacije[itertor].x, dataJSON.lokacije[itertor].y);
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.WALKING,
    }, function(response, status) {
        dataJSON.lokacije[itertor].description = response.destinationAddresses[1];
        itertor++;
        initName();
    });
}

function initialize() {

    initName();
    var mapProp = {
        center: new google.maps.LatLng(45.254914, 19.844642),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    //novi kod
    var infowindow = new google.maps.InfoWindow(),
        marker, i;
    for (i = 0; i < dataJSON.lokacije.length; i++) {
        dataJSON.lokacije[i].clicked = Math.random(3);
        marker = new google.maps.Marker({
            title: dataJSON.lokacije[i].description,
            position: new google.maps.LatLng(dataJSON.lokacije[i].x, dataJSON.lokacije[i].y),
            map: map
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                dataJSON.lokacije[i].clicked = +dataJSON.lokacije[i].clicked + 1;
                google.charts.setOnLoadCallback(drawChart);
                infowindow.open(map, marker);
                infowindow.setContent('<h3>' + dataJSON.lokacije[i].description + '</h1>' + loremIpsum);
                var origin1 = new google.maps.LatLng(45.254914, 19.844642);
                var origin2 = "Novi Sad Trg Slobode";
                var destinationA = dataJSON.lokacije[i].description;
                var destinationB = new google.maps.LatLng(dataJSON.lokacije[i].x, dataJSON.lokacije[i].y);

                var service = new google.maps.DistanceMatrixService();

                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix({
                    origins: [origin1, origin2],
                    destinations: [destinationA, destinationB],
                    travelMode: google.maps.TravelMode.WALKING,
                }, callback);

                function callback(response, status) {

                    $("#udaljenost").text("Udaljenost " + response.destinationAddresses[1] + " od katedrale je " + response.rows[1].elements[1].distance.text);
                }

            }
        })(marker, i));
    }
}
google.maps.event.addDomListener(window, 'load', initialize);

function setWheel() {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {

    var dataArray = [];
    var dat = [];
    dat[0] = 'Na sta';
    dat[1] = 'koliko';
    dataArray.push(dat);
    for (i = 0; i < dataJSON.lokacije.length; i++) {
        var dat = [];
        dat.push(dataJSON.lokacije[i].description);
        dat.push(+dataJSON.lokacije[i].clicked);
        dataArray.push(dat);
    }
    var piData = google.visualization.arrayToDataTable(dataArray);

    var options = {
        title: 'Koliko klikova na sta'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(piData, options);
}
