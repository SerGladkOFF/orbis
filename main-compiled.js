"use strict";

/******/(function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "app/";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	"use strict";

	var _model = __webpack_require__(1);

	var _model2 = _interopRequireDefault(_model);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	//enter
	var map = L.map('mapid', {
		center: [55.75, 37.716],
		zoom: 8
	});

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	//BARS LAYAER
	var bars = new L.LayerGroup();
	var barsIcon = L.icon({
		iconUrl: 'https://a.tiles.mapbox.com/v4/marker/pin-m-bar+438fd3.png?access_token=pk.eyJ1IjoiZ2l0aHViIiwiYSI6IjEzMDNiZjNlZGQ5Yjg3ZjBkNGZkZWQ3MTIxN2FkODIxIn0.o0lbEdOfJYEOaibweUDlzA',
		iconAnchor: [16, 37],
		popupAnchor: [0, -28]

	});

	var _Model$bars = _model2.default.bars();

	var bars_type = _Model$bars.type;
	var bars_features = _Model$bars.features;

	console.log();
	var onEachFeature = function onEachFeature(feature, layer) {
		var popupContent = "<p>name:" + feature.properties.name + "</p><p>address:" + feature.properties.address + "</p>";
		layer.bindPopup(popupContent);
	};
	L.geoJson(bars_features, {
		onEachFeature: onEachFeature,
		pointToLayer: function pointToLayer(feature, latlng) {
			return L.marker(latlng, { icon: barsIcon });
		}
	}).addTo(bars);

	//SOME LAYAER
	var some = new L.LayerGroup();

	var _Model$some = _model2.default.some();

	var some_features = _Model$some.features;

	var onEachFeature2 = function onEachFeature2(feature, layer) {
		var popupContent = "<p>name:" + feature.properties.name + "</p><p>address:" + feature.properties.address + "</p>";
		layer.bindPopup(popupContent);
	};

	L.geoJson(some_features, {
		onEachFeature: onEachFeature2,
		pointToLayer: function pointToLayer(feature, latlng) {
			return L.marker(latlng);
		}
	}).addTo(some);

	//METRO LAYER
	var metro = new L.LayerGroup();

	var onEachFeature1 = function onEachFeature1(feature, layer) {
		var popupContent = feature.properties["name_ru"];
		layer.bindPopup(popupContent);
	};

	var customLayer = L.geoJson(null, {
		onEachFeature: onEachFeature1,
		pointToLayer: function pointToLayer(feature, latlng) {
			return L.marker(latlng);
		} });

	omnivore.csv('https://raw.githubusercontent.com/nextgis/metro4all/master/data/msk/portals.csv', { latfield: 'lat',
		lonfield: 'lon',
		delimiter: ';'
	}, customLayer).addTo(metro);

	var _omnivore$csv = omnivore.csv('https://raw.githubusercontent.com/nextgis/metro4all/master/data/msk/portals.csv', { latfield: 'lat',
		lonfield: 'lon',
		delimiter: ';'
	});

	var _layers = _omnivore$csv._layers;

	console.log(_layers);

	//Controls


	var baselays = {
		"<span id=\"some_control\" class='my-layer-item'>some</span>": some,
		"<span id=\"bars_control\" class='my-layer-item'>Bars</span>": bars,
		"<span id=\"metro_control\" class='my-layer-item'>Metro</span>": metro
	};

	L.control.layers(baselays).addTo(map);

	var bars_control = document.getElementById("bars_control");
	var some_control = document.getElementById("some_control");
	var metro_control = document.getElementById("metro_control");

	bars_control.addEventListener("click", function (e) {
		map.setView([38.898321, -77.039882], 12
		//,{pan:{animate: true, duration:3}}
		);
		// map.panTo([38.898321,-77.039882], {
		//     animate: true,
		//     duration:2
		// });
		var source = document.getElementById("table-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = { data: bars_features };
		var html = template(context);
		document.getElementById("table").innerHTML = html;
	});

	some_control.addEventListener("click", function (e) {
		map.setView([53.228430, 50.229303], 12);
	});

	metro_control.addEventListener("click", function (e) {
		map.setView([55.751, 37.716], 12);
	});

	function check(element, substr) {
		if (element.toLowerCase().indexOf(substr) != -1) return true;
	};

	filter__name.onkeyup = function (e, template) {
		//фильтрация
		var newData = [];
		var substr = filter__name.value.toLowerCase();
		for (var i = 0; i < bars_features.length; i++) {
			if (check(bars_features[i]["properties"]["name"], substr)) {
				newData.push(bars_features[i]);
			}
		};

		//вывод списка филтрации
		var source = document.getElementById("table-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = { data: newData };
		var html = template(context);
		document.getElementById("table").innerHTML = html;

		bars.clearLayers();
		L.geoJson(newData, {
			onEachFeature: onEachFeature,
			pointToLayer: function pointToLayer(feature, latlng) {
				return L.marker(latlng, { icon: barsIcon });
			}
		}).addTo(bars);
	};
	var chooseMarker = function chooseMarker(e) {
		var parent = e.target.closest(".geoObject");
		var choose = parent.querySelector(".name").innerText;
		for (var i = 0; i < bars_features.length; i++) {
			if (bars_features[i]["properties"]["name"] === choose) {
				map.panTo(bars_features[i]["geometry"]["coordinates"], {
					animate: true,
					duration: 2
				});
			}
		};
		//console.log(choose);
	};

	table.addEventListener("click", chooseMarker);

	/***/
},
/* 1 */
/***/function (module, exports) {

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

	/***/
}
/******/]);

//# sourceMappingURL=main-compiled.js.map