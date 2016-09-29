"use strict"
import Model from "./model.js"
import Control from "./control.js"

let preload = document.querySelector(".preload");
//handlbars
Handlebars.registerHelper('list', function (context, options) {
    let ret = ""
    for (var i = 0; i < context.length; i++) {
        ret += "<li class=\'geoObject\'>";


        for (var key in context[i].properties) {
            if (key === "marker-symbol") {
                continue;
            }
            ret += "<span class=" + key + ">" + context[i].properties[key] + "</span>"
        }
        ret += "</li>"
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
        ret += "<span>" + key + "</span>" +
            "<span>" + context[i].properties[key] + "</span>"
    }
    ret += "</li>"
    return ret;
});


let map,_data,_active_layer,center,layer,init,_features;


let some = Model.layerGroup();
let bars = Model.layerGroup();
let metro = Model.layerGroup();

//контейнер слоев
let baselaysObj = {
    'some': some,
    'bars': bars,
    'metro': metro
};

//базовые слои
let baselays = {
    "<span id=\"some_control\" class='my-layer-item'>some</span>": some,
    "<span id=\"bars_control\" class='my-layer-item'>Bars</span>": bars,
    "<span id=\"metro_control\" class='my-layer-item'>Metro</span>": metro,
};

//проверка localStorage
if (localStorage.getItem("_center") &&
    localStorage.getItem("_active_layer")) {
    //инициализируем карту с параметрами
    init = new Promise((resolve)=>{

        //забираем данные( карты\активный слой ) из локального хранилища
         center = JSON.parse(localStorage.getItem("_center"));
         layer = baselaysObj[localStorage.getItem("_active_layer")];
         let features = localStorage.getItem("_active_layer") + "_features";

         //подгружаем данные
         _features = Model[features]();
         _features.then((_features)=> {

            //переменные для состоняти активного слоя и данных для отображения
             _data = _features;
             _active_layer = layer;

            //строим таблицу с данными
             Model.handlbars({_data: _features});

            //добавдяем маркеры с данными на слой
             L.geoJson(_features, {
                 onEachFeature: Model.onEachFeature(),
                 pointToLayer: function (feature, latlng) {
                     return L.marker(latlng);
                 }
             }).addTo(layer);

             //инициализируем карту с активным слоем
             map = Model.map(layer);

             //устанавливаем центр
             map.setView(center, 12);

             //создаем контролы для слоев
             L.control.layers(baselays).addTo(map);
             preload.classList.toggle("hide")
             resolve()
         })
    });


} else {
    //инициализируем карту
    init = new Promise((resolve)=> {

        map = Model.map();

        // filter__name.addEventListener("keyup", (e)=> {
        //     Control.filter(_data, _active_layer, Model.onEachFeature());
        // });
        // table.addEventListener("click", (e)=> {
        //     Control.chooseMarker(e, _data, map)
        // });

        L.control.layers(baselays).addTo(map);
        preload.classList.toggle("hide")
        resolve();
    })
}


init.then(()=>{
    //забираем данные( фильтр ) из локального хранилища
    if (localStorage.getItem("_filter")){
        let _substr = localStorage.getItem("_filter");
        //приводим данные в соответсвтие с фильтром
        filter__name.value = _substr;
        Control.filter(_data, _active_layer, Model.onEachFeature());
    }


    // обработчик клика на слой баров
    bars_control.addEventListener("click", (e)=> {
        preload.classList.toggle("hide")
        //если солй активен ничего не делаем
        if (_active_layer == bars) {
            return
        };
        //сбрасываем фильтр
        filter__name.value ="";
        localStorage.setItem("_filter","");

        //устанавливаем центра
        map.setView([38.898321, -77.039882], 12);

        //достаем геоданные
        _features = Model.bars_features();
        _features.then((_features)=> {

            // //запоминаем активный слой и объект данных
            _data = _features;
            _active_layer = bars;

            //строим таблицу
            Model.handlbars({_data: _features});
            Control.saveStorage([38.898321, -77.039882], "bars");

            //наполняем слой на основе данных
            L.geoJson(_features, {
                onEachFeature: Model.onEachFeature(),
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng);
                }
            }).addTo(bars);
            preload.classList.toggle("hide")
        })
    });

    some_control.addEventListener("click", ()=> {
        preload.classList.toggle("hide")
        if (_active_layer == some) {
            return
        }
        ;
        filter__name.value ="";
        localStorage.setItem("_filter","");

        map.setView([53.228430, 50.229303], 12);
        _features = Model.some_features();
        _features.then((_features)=> {

            _data = _features;
            _active_layer = some;

            Model.handlbars({_data: _features});
            Control.saveStorage([53.228430, 50.229303], "some");

            L.geoJson(_features, {
                onEachFeature: Model.onEachFeature(),
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng);
                }
            }).addTo(some);

            preload.classList.toggle("hide")
        })
    });

    metro_control.addEventListener("click", ()=> {

        if (_active_layer == metro) {
            return
        }
        // ;
        filter__name.value ="";
        localStorage.setItem("_filter","");

        map.setView([55.751, 37.716], 12);
        preload.classList.toggle("hide");
        _features = Model.metro_features();
        _features.then((_features)=> {
            _data = _features;
             _active_layer = metro;
            // Control.layerCreate(_features,metro,"metro",[55.751, 37.716],_data,_active_layer);

            Model.handlbars({_data: _features});
            Control.saveStorage([55.751, 37.716], "metro");
            L.geoJson(_features, {
                onEachFeature: Model.onEachFeature(),
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng);
                }
            }).addTo(metro);


            preload.classList.toggle("hide")
        })

    });

    //функция фильтрации
    filter__name.addEventListener("keyup", (e)=> {
        Control.filter(_data, _active_layer, Model.onEachFeature());
    });

    //клик по таблице - поиск элемента на слое
    table.addEventListener("click", (e)=> {
        Control.chooseMarker(e, _data, map)
    });




});

//
// let layerCreate = (_features,layer,layerName,center)=> {
//
//     _data = _features;
//     _active_layer = layer;
//     Model.handlbars({_data: _features});
//     Control.saveStorage(center, layerName);
//     L.geoJson(_features, {
//         onEachFeature: Model.onEachFeature(),
//         pointToLayer: function (feature, latlng) {
//             return L.marker(latlng);
//         }
//     }).addTo(layer);
//
//
//     preload.classList.toggle("hide")
// }
