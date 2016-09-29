"use strict"

const Model = {
        map: function (layer) {
            let map;
            if (layer) {
                map = L.map('mapid', {
                center: [55.75, 37.716],
                zoom: 8,
                layers:[layer]||null
            });
            } else {
                map = L.map('mapid', {
                 center: [55.75, 37.716],
                 zoom: 8,
                 });
            };

            L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
            return map
        },
        layerGroup: ()=> {
            return new L.LayerGroup();
        },
        bars_icon: ()=> {
            return L.icon({
                iconUrl: 'https://a.tiles.mapbox.com/v4/marker/pin-m-bar+438fd3.png?access_token=pk.eyJ1IjoiZ2l0aHViIiwiYSI6IjEzMDNiZjNlZGQ5Yjg3ZjBkNGZkZWQ3MTIxN2FkODIxIn0.o0lbEdOfJYEOaibweUDlzA',
                iconAnchor: [16, 37],
                popupAnchor: [0, -28]

            });
        },
        bars_features: ()=> {
           return new Promise((resolve)=> {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://raw.githubusercontent.com/benbalter/dc-wifi-social/master/bars.geojson', false);
                xhr.send();
                if (xhr.status != 200) {
                    // обработать ошибку
                    console.log(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
                } else {
                    // вывести результат
                    let {features:bars_features} = JSON.parse(xhr.response);
                 //   return bars_features;
                   resolve(bars_features);
                }
           })



        },
        onEachFeature: ()=> {
            let onEachFeature = (feature, layer) => {
                var popupContent = ()=>{
                    let content=""
                    for (let key in feature.properties) {
                        if (key === "marker-symbol") {
                                   continue;
                               }
                         content+="<p><span class=\'key\'>"+key+":</span>" + feature.properties[key] + "</p>"
                    }
                 return content;
                };
                layer.bindPopup(popupContent());
            };
            return onEachFeature;
        },
        metro: function () {
            return new L.LayerGroup();
        },
        metro_features: ()=> {
              return new Promise((resolve)=> {
                omnivore.csv('https://raw.githubusercontent.com/nextgis/metro4all/master/data/msk/portals.csv', {
                    latfield: 'lat',
                    lonfield: 'lon',
                    delimiter: ';'
                }).on("ready",function(){
                    let {_layers:data} = this;
                    let metro_features=[];
                    for (let key in data) {
                        metro_features.push(data[key]["feature"])
                    };
                    resolve(metro_features);
                   return metro_features
                });


              })
        },

        some_features: ()=> {
            return new Promise((resolve)=> {
                let xhr = new XMLHttpRequest();

                xhr.open('GET', 'some-layer.json', false);

                xhr.send();
                if (xhr.status != 200) {
                    // обработать ошибку
                    console.log(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
                } else {
                    // вывести результат
                    let {features:some_features} = JSON.parse(xhr.response);
                    resolve(some_features);
                }
            })


        },

        some: function () {
            return new L.LayerGroup();
        },
        handlbars: function (_data) {

            var source = document.getElementById("table-template").innerHTML;
            var template = Handlebars.compile(source);
            let html = template(_data);
            document.getElementById("table").innerHTML = html;
        },
        popup:(_data)=>{
            var source = document.getElementById("popup").innerHTML;
            var template = Handlebars.compile(source);
            let context = _data;
            let html = template(context);
            document.getElementById("table").innerHTML = html;
        }
    }
    ;

export default Model;

