Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap, culture: 'en-us', homeRegion: 'US' });

function initMap() {
    var map;
    var info = document.getElementById("ajax");

    var mapOptions =
    {
        credentials: "AnXgHQGJ5mSb2ihUcAEype1aEeCF-F9PCI4QQz5zrbCdg4ZbiHf2vfJSVAOIsS_f"
    };

    map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), mapOptions);

    map.setView({
        center: new Microsoft.Maps.Location(43.6523, -79.3792),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 15
    });

    info.style.color = "white";

    //Promise.timeout(200, WinJS.xhr
    WinJS.Promise.timeout(1000, WinJS.xhr({ url: "https://toronto.bixi.com/data/bikeStations.xml", responseType: "responseXML" })
    .done(
        function complete(result) {
            var xml = result.responseXML;

            info.innerText = "Downloaded the page";
            info.style.backgroundColor = "#00FF00"; //here goes my breakpoint to check response value

            //txt = "";
            items = xml.querySelectorAll("station");

            var pinInfoBox;  //the pop up info box
            
            data = {};

            for (var i = 0; i < items.length; i++) {
                data.id = i;
                data.name = items[i].querySelector("name").textContent;
                data.lat = items[i].querySelector("lat").textContent;
                data.long = items[i].querySelector("long").textContent;
                data.bikesleft = items[i].querySelector("nbBikes").textContent;
                data.emptydocks = items[i].querySelector("nbEmptyDocks").textContent;

                //get the location
                pin = new Microsoft.Maps.Location(data.lat, data.long);
                

                //init the pin for the first location right on toronto
                var pushpin = new Microsoft.Maps.Pushpin(pin, null);
                pushpin.title = data.name;
                pushpin.description = "emptydocks:" + data.emptydocks + "<br>" +
                                     "bikesleft:" + data.bikesleft;

                // Create the infobox for the pushpin
                var pinInfobox = new Microsoft.Maps.Infobox(pin,
                    {
                        visible: false
                    });

                map.entities.push(pushpin);
                map.entities.push(pinInfobox);

                // Add handler for the pushpin click event.
                Microsoft.Maps.Events.addHandler(pushpin, 'click', displayInfobox);
                Microsoft.Maps.Events.addHandler(pushpin, 'click', hideInfobox);

                var seconds = new Date().getTime() / 1000;
                console.log("hello world"+ seconds);
            }

            function displayInfobox(e) {
                pinInfobox.setOptions({ title: e.target.title, description: e.target.description, visible: true });
                pinInfobox.setLocation(e.target.getLocation());
            }

            function hideInfobox(e) {
                pinInfobox.setOptions({ visible: false });
            }

        },
        function error(result) {
            info.innerHTML = "Got error: " + result.statusText;
            info.style.backgroundColor = "#FF0000";
        },
        function progress(result) {
            info.innerText = "Ready state is " + result.readyState;
            info.style.backgroundColor = "#0000FF";
        }
    ));
}