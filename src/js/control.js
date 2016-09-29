import Model from "./model.js"

const Control = {
    filter:(_data, _active_layer, onEachFeature, icon,)=> {
        function check(element, substr) {
            if (element.toLowerCase().indexOf(substr) != -1) return true;
        };


         var substr = filter__name.value.toLowerCase();

        let newData = [];

        localStorage.setItem("_filter",substr);

        for (var i = 0; i < _data.length; i++) {
            if (check((_data[i]["properties"]["name"]||_data[i]["properties"]["name_ru"]), substr)) {
                newData.push(_data[i])
            }
        }
        ;

        Model.handlbars({_data: newData});
        let _icon = (icon) ? {icon: icon} : {};

        _active_layer.clearLayers();

        L.geoJson(newData, {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, _icon);
            }
        }).addTo(_active_layer);
    },
    chooseMarker: (e,_data,map) => {
        let parent = e.target.closest(".geoObject");
        let parent_name = parent.querySelector(".name")||parent.querySelector(".name_ru");
        let choose = parent_name.innerText;
        for (var i = 0; i < _data.length; i++) {

            if (_data[i]["properties"]["name"]||_data[i]["properties"]["name_ru"] === choose) {

                map.setView([_data[i]["geometry"]["coordinates"][1], _data[i]["geometry"]["coordinates"][0]], 16 );

            }
        }

    },
    saveStorage:(cetner,_active_layer)=>{
                let _sCenter = JSON.stringify(cetner);

                localStorage.setItem("_active_layer",_active_layer);
                localStorage.setItem("_center",_sCenter);


            },
    layerCreate:(_features,layer,layerName,center,_data,_active_layer)=> {

        // _data = _features;
        // _active_layer = layer;
        Model.handlbars({_data: _features});
        Control.saveStorage(center, layerName);
        L.geoJson(_features, {
            onEachFeature: Model.onEachFeature(),
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng);
            }
        }).addTo(layer);


        preload.classList.toggle("hide")
    }
}

export default Control;