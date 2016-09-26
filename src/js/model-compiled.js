"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Model = {

    bars: function bars() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/benbalter/dc-wifi-social/master/bars.geojson', false);
        xhr.send();
        if (xhr.status != 200) {
            // обработать ошибку
            console.log(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            return JSON.parse(xhr.response);
        }
    },
    metro: function metro() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/nextgis/metro4all/master/data/msk/portals.csv', false);
        xhr.send();
        if (xhr.status != 200) {
            // обработать ошибку
            console.log(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            return JSON.parse(xhr.response);
        }
    },
    some: function some() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'some-layer.json', false);

        xhr.send();
        if (xhr.status != 200) {
            // обработать ошибку
            console.log(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            return JSON.parse(xhr.response);
        }
    }
};

exports.default = Model;

//# sourceMappingURL=model-compiled.js.map