/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "app/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _model = __webpack_require__(1);

	var _model2 = _interopRequireDefault(_model);

	var _control = __webpack_require__(2);

	var _control2 = _interopRequireDefault(_control);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var preload = document.querySelector(".preload");
	//handlbars
	Handlebars.registerHelper('list', function (context, options) {
	    var ret = "";
	    for (var i = 0; i < context.length; i++) {
	        ret += "<li class=\'geoObject\'>";

	        for (var key in context[i].properties) {
	            if (key === "marker-symbol") {
	                continue;
	            }
	            ret += "<span class=" + key + ">" + context[i].properties[key] + "</span>";
	        }
	        ret += "</li>";
	    }
	    return ret;
	});

	Handlebars.registerHelper('popup', function (context, options) {
	    console.log(context[0].properties);
	    var ret = "";
	    ret += "<li class=\'popup_decription\'>";
	    for (var key in context[0].properties) {
	        if (key === "marker-symbol") {
	            continue;
	        }
	        ret += "<span>" + key + "</span>" + "<span>" + context[i].properties[key] + "</span>";
	    }
	    ret += "</li>";
	    return ret;
	});

	var map = void 0,
	    _data = void 0,
	    _active_layer = void 0,
	    center = void 0,
	    layer = void 0,
	    init = void 0,
	    _features = void 0;

	var some = _model2.default.layerGroup();
	var bars = _model2.default.layerGroup();
	var metro = _model2.default.layerGroup();

	//контейнер слоев
	var baselaysObj = {
	    'some': some,
	    'bars': bars,
	    'metro': metro
	};

	//базовые слои
	var baselays = {
	    "<span id=\"some_control\" class='my-layer-item'>some</span>": some,
	    "<span id=\"bars_control\" class='my-layer-item'>Bars</span>": bars,
	    "<span id=\"metro_control\" class='my-layer-item'>Metro</span>": metro
	};

	//проверка localStorage
	if (localStorage.getItem("_center") && localStorage.getItem("_active_layer")) {
	    //инициализируем карту с параметрами
	    init = new Promise(function (resolve) {

	        //забираем данные( карты\активный слой ) из локального хранилища
	        center = JSON.parse(localStorage.getItem("_center"));
	        layer = baselaysObj[localStorage.getItem("_active_layer")];
	        var features = localStorage.getItem("_active_layer") + "_features";

	        //подгружаем данные
	        _features = _model2.default[features]();
	        _features.then(function (_features) {

	            //переменные для состоняти активного слоя и данных для отображения
	            _data = _features;
	            _active_layer = layer;

	            //строим таблицу с данными
	            _model2.default.handlbars({ _data: _features });

	            //добавдяем маркеры с данными на слой
	            L.geoJson(_features, {
	                onEachFeature: _model2.default.onEachFeature(),
	                pointToLayer: function pointToLayer(feature, latlng) {
	                    return L.marker(latlng);
	                }
	            }).addTo(layer);

	            //инициализируем карту с активным слоем
	            map = _model2.default.map(layer);

	            //устанавливаем центр
	            map.setView(center, 12);

	            //создаем контролы для слоев
	            L.control.layers(baselays).addTo(map);
	            preload.classList.toggle("hide");
	            resolve();
	        });
	    });
	} else {
	    //инициализируем карту
	    init = new Promise(function (resolve) {

	        map = _model2.default.map();

	        L.control.layers(baselays).addTo(map);
	        preload.classList.toggle("hide");
	        resolve();
	    });
	}

	init.then(function () {
	    //забираем данные( фильтр ) из локального хранилища
	    if (localStorage.getItem("_filter")) {
	        var _substr = localStorage.getItem("_filter");
	        //приводим данные в соответсвтие с фильтром
	        filter__name.value = _substr;
	        _control2.default.filter(_data, _active_layer, _model2.default.onEachFeature());
	    }

	    // обработчик клика на слой баров
	    bars_control.addEventListener("click", function (e) {
	        preload.classList.toggle("hide");
	        //если солй активен ничего не делаем
	        if (_active_layer == bars) {
	            return;
	        };
	        //сбрасываем фильтр
	        filter__name.value = "";
	        localStorage.setItem("_filter", "");

	        //устанавливаем центра
	        map.setView([38.898321, -77.039882], 12);

	        //достаем геоданные
	        _features = _model2.default.bars_features();
	        _features.then(function (_features) {

	            // //запоминаем активный слой и объект данных
	            _data = _features;
	            _active_layer = bars;

	            //строим таблицу
	            _model2.default.handlbars({ _data: _features });
	            _control2.default.saveStorage([38.898321, -77.039882], "bars");

	            //наполняем слой на основе данных
	            L.geoJson(_features, {
	                onEachFeature: _model2.default.onEachFeature(),
	                pointToLayer: function pointToLayer(feature, latlng) {
	                    return L.marker(latlng);
	                }
	            }).addTo(bars);
	            preload.classList.toggle("hide");
	        });
	    });

	    some_control.addEventListener("click", function () {
	        preload.classList.toggle("hide");
	        if (_active_layer == some) {
	            return;
	        }
	        ;
	        filter__name.value = "";
	        localStorage.setItem("_filter", "");

	        map.setView([53.228430, 50.229303], 12);
	        _features = _model2.default.some_features();
	        _features.then(function (_features) {

	            _data = _features;
	            _active_layer = some;

	            _model2.default.handlbars({ _data: _features });
	            _control2.default.saveStorage([53.228430, 50.229303], "some");

	            L.geoJson(_features, {
	                onEachFeature: _model2.default.onEachFeature(),
	                pointToLayer: function pointToLayer(feature, latlng) {
	                    return L.marker(latlng);
	                }
	            }).addTo(some);

	            preload.classList.toggle("hide");
	        });
	    });

	    metro_control.addEventListener("click", function () {

	        if (_active_layer == metro) {
	            return;
	        }
	        // ;
	        filter__name.value = "";
	        localStorage.setItem("_filter", "");

	        map.setView([55.751, 37.716], 12);
	        preload.classList.toggle("hide");
	        _features = _model2.default.metro_features();
	        _features.then(function (_features) {
	            _data = _features;
	            _active_layer = metro;
	            // Control.layerCreate(_features,metro,"metro",[55.751, 37.716],_data,_active_layer);

	            _model2.default.handlbars({ _data: _features });
	            _control2.default.saveStorage([55.751, 37.716], "metro");
	            L.geoJson(_features, {
	                onEachFeature: _model2.default.onEachFeature(),
	                pointToLayer: function pointToLayer(feature, latlng) {
	                    return L.marker(latlng);
	                }
	            }).addTo(metro);

	            preload.classList.toggle("hide");
	        });
	    });

	    //функция фильтрации
	    filter__name.addEventListener("keyup", function (e) {
	        _control2.default.filter(_data, _active_layer, _model2.default.onEachFeature());
	    });

	    //клик по таблице - поиск элемента на слое
	    table.addEventListener("click", function (e) {
	        _control2.default.chooseMarker(e, _data, map);
	    });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Model = {
	    map: function map(layer) {
	        var map = void 0;
	        if (layer) {
	            map = L.map('mapid', {
	                center: [55.75, 37.716],
	                zoom: 8,
	                layers: [layer] || null
	            });
	        } else {
	            map = L.map('mapid', {
	                center: [55.75, 37.716],
	                zoom: 8
	            });
	        };

	        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	        }).addTo(map);
	        return map;
	    },
	    layerGroup: function layerGroup() {
	        return new L.LayerGroup();
	    },
	    bars_icon: function bars_icon() {
	        return L.icon({
	            iconUrl: 'https://a.tiles.mapbox.com/v4/marker/pin-m-bar+438fd3.png?access_token=pk.eyJ1IjoiZ2l0aHViIiwiYSI6IjEzMDNiZjNlZGQ5Yjg3ZjBkNGZkZWQ3MTIxN2FkODIxIn0.o0lbEdOfJYEOaibweUDlzA',
	            iconAnchor: [16, 37],
	            popupAnchor: [0, -28]

	        });
	    },
	    bars_features: function bars_features() {
	        return new Promise(function (resolve) {
	            var xhr = new XMLHttpRequest();
	            xhr.open('GET', 'https://raw.githubusercontent.com/benbalter/dc-wifi-social/master/bars.geojson', false);
	            xhr.send();
	            if (xhr.status != 200) {
	                // обработать ошибку
	                console.log(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
	            } else {
	                // вывести результат
	                var _JSON$parse = JSON.parse(xhr.response);

	                var bars_features = _JSON$parse.features;
	                //   return bars_features;

	                resolve(bars_features);
	            }
	        });
	    },
	    onEachFeature: function onEachFeature() {
	        var onEachFeature = function onEachFeature(feature, layer) {
	            var popupContent = function popupContent() {
	                var content = "";
	                for (var key in feature.properties) {
	                    if (key === "marker-symbol") {
	                        continue;
	                    }
	                    content += "<p><span class=\'key\'>" + key + ":</span>" + feature.properties[key] + "</p>";
	                }
	                return content;
	            };
	            layer.bindPopup(popupContent());
	        };
	        return onEachFeature;
	    },
	    metro: function metro() {
	        return new L.LayerGroup();
	    },
	    metro_features: function metro_features() {
	        return new Promise(function (resolve) {
	            omnivore.csv('https://raw.githubusercontent.com/nextgis/metro4all/master/data/msk/portals.csv', {
	                latfield: 'lat',
	                lonfield: 'lon',
	                delimiter: ';'
	            }).on("ready", function () {
	                var data = this._layers;

	                var metro_features = [];
	                for (var key in data) {
	                    metro_features.push(data[key]["feature"]);
	                };
	                resolve(metro_features);
	                return metro_features;
	            });
	        });
	    },

	    some_features: function some_features() {
	        return new Promise(function (resolve) {
	            var xhr = new XMLHttpRequest();

	            xhr.open('GET', 'some-layer.json', false);

	            xhr.send();
	            if (xhr.status != 200) {
	                // обработать ошибку
	                console.log(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
	            } else {
	                // вывести результат
	                var _JSON$parse2 = JSON.parse(xhr.response);

	                var some_features = _JSON$parse2.features;

	                resolve(some_features);
	            }
	        });
	    },

	    some: function some() {
	        return new L.LayerGroup();
	    },
	    handlbars: function handlbars(_data) {

	        var source = document.getElementById("table-template").innerHTML;
	        var template = Handlebars.compile(source);
	        var html = template(_data);
	        document.getElementById("table").innerHTML = html;
	    },
	    popup: function popup(_data) {
	        var source = document.getElementById("popup").innerHTML;
	        var template = Handlebars.compile(source);
	        var context = _data;
	        var html = template(context);
	        document.getElementById("table").innerHTML = html;
	    }
	};

	exports.default = Model;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _model = __webpack_require__(1);

	var _model2 = _interopRequireDefault(_model);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Control = {
	    filter: function filter(_data, _active_layer, onEachFeature, icon) {
	        function check(element, substr) {
	            if (element.toLowerCase().indexOf(substr) != -1) return true;
	        };

	        var substr = filter__name.value.toLowerCase();

	        var newData = [];

	        localStorage.setItem("_filter", substr);

	        for (var i = 0; i < _data.length; i++) {
	            if (check(_data[i]["properties"]["name"] || _data[i]["properties"]["name_ru"], substr)) {
	                newData.push(_data[i]);
	            }
	        }
	        ;

	        _model2.default.handlbars({ _data: newData });
	        var _icon = icon ? { icon: icon } : {};

	        _active_layer.clearLayers();

	        L.geoJson(newData, {
	            onEachFeature: onEachFeature,
	            pointToLayer: function pointToLayer(feature, latlng) {
	                return L.marker(latlng, _icon);
	            }
	        }).addTo(_active_layer);
	    },
	    chooseMarker: function chooseMarker(e, _data, map) {
	        var parent = e.target.closest(".geoObject");
	        var parent_name = parent.querySelector(".name") || parent.querySelector(".name_ru");
	        var choose = parent_name.innerText;
	        for (var i = 0; i < _data.length; i++) {

	            if (_data[i]["properties"]["name"] || _data[i]["properties"]["name_ru"] === choose) {

	                map.setView([_data[i]["geometry"]["coordinates"][1], _data[i]["geometry"]["coordinates"][0]], 16);
	            }
	        }
	    },
	    saveStorage: function saveStorage(cetner, _active_layer) {
	        var _sCenter = JSON.stringify(cetner);

	        localStorage.setItem("_active_layer", _active_layer);
	        localStorage.setItem("_center", _sCenter);
	    },
	    layerCreate: function layerCreate(_features, layer, layerName, center, _data, _active_layer) {

	        // _data = _features;
	        // _active_layer = layer;
	        _model2.default.handlbars({ _data: _features });
	        Control.saveStorage(center, layerName);
	        L.geoJson(_features, {
	            onEachFeature: _model2.default.onEachFeature(),
	            pointToLayer: function pointToLayer(feature, latlng) {
	                return L.marker(latlng);
	            }
	        }).addTo(layer);

	        preload.classList.toggle("hide");
	    }
	};

	exports.default = Control;

/***/ }
/******/ ]);