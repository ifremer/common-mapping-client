import Immutable from "immutable";
import MapReducerCore from "_core/reducers/reducerFunctions/MapReducer";
import { layerModel } from "reducers/models/map";
import * as appStrings from "constants/appStrings";

export default class MapReducer extends MapReducerCore {
    static getLayerModel() {
        return layerModel;
    }

    static pixelHover(state, action) {
        let pixelCoordinate = state.getIn(["view", "pixelHoverCoordinate"]).set("isValid", false);
        state.get("maps").forEach(map => {
            if (map.isActive) {
                let coords = map.getLatLonFromPixelCoordinate(action.pixel);
                let data = [];

                if (coords && coords.isValid) {
                    // set the coordinate as valid and store the data :
                    pixelCoordinate = pixelCoordinate
                        .set("lat", coords.lat)
                        .set("lon", coords.lon)
                        .set("x", action.pixel[0])
                        .set("y", action.pixel[1])
                        .set("data", data)
                        .set("showData", data.size > 0)
                        .set("isValid", true);
                    return false;
                }
            }
            return true;
        });
        return state.setIn(["view", "pixelHoverCoordinate"], pixelCoordinate);
    }

    static pixelClick(state, action) {
        let pixelCoordinate = state.getIn(["view", "pixelClickCoordinate"]).set("isValid", false);
        state.get("maps").forEach(map => {
            if (map.isActive) {
                let pixel = map.getPixelFromClickEvent(action.clickEvt);
                if (pixel) {
                    let coords = map.getLatLonFromPixelCoordinate(pixel);

                    let data = [];
                    if (coords && coords.isValid) {
                        // find data if any
                        data = map.getDataAtPoint(
                            action.clickEvt.pixel,
                            state.getIn(["layers", "data"])
                        );
                        data = data !== false ? data : [];
                        data = Immutable.fromJS(
                            data.map(entry => {
                                entry.layer = this.findLayerById(state, entry.layerId);
                                return entry;
                            })
                        );

                        // set the coordinate as valid and store the data
                        pixelCoordinate = pixelCoordinate
                            .set("lat", coords.lat)
                            .set("lon", coords.lon)
                            .set("x", pixel[0])
                            .set("y", pixel[1])
                            .set("data", data)
                            .set("isValid", true);
                        return false;
                    } else {
                        pixelCoordinate = pixelCoordinate.set("isValid", false);
                    }
                }
            }
            return true;
        });
        return state.setIn(["view", "pixelClickCoordinate"], pixelCoordinate);
    }

    static pixelDrag(state, action) {
        //TODO implementation
        return state.setIn(["view", "pixelDragCoordinate"], undefined);
    }

    /**
     * Bind layer data realize two main actions, updating the palette and coloring points if necessary
     *
     * @param {*} state
     * @param {*} action
     */
    static bindLayerData(state, action) {
        // activate data binding
        if (action.value) {
            action.layer = action.layer.set("bind_parameter", action.parameter);
        } else {
            if (action.layer.get("bind_parameter")) {
                action.layer = action.layer.delete("bind_parameter");
            }
        }

        // update palette
        const updatedState = this.setLayerPalette(state, action);
        action.layer = updatedState.getIn([
            "layers",
            action.layer.get("type"),
            action.layer.get("id")
        ]);

        // update url
        return this.updateLayerUrl(state, action);
    }

    static updateLayerUrl(state, action) {
        let anyMapFail = false;
        let alerts = state.get("alerts");
        let actionLayer = action.layer;

        // TODO : improve and add again ? shortcut non-updates
        // if (
        //     action.value ===
        //     actionLayer.getIn(["updateParameters", "filters", action.parameter]).get("value")
        // ) {
        //     return state;
        // }

        //mise a jour du parametre
        actionLayer = actionLayer.setIn(
            ["updateParameters", "filters", action.parameter, "value"],
            action.value
        );

        // update each map
        state.get("maps").forEach(map => {
            if (
                actionLayer.get("isActive") &&
                actionLayer.getIn(["updateParameters", "filters", action.parameter])
            ) {
                map.clearCacheForLayer(actionLayer);
                // update the layer and track if any fail
                if (!map.updateLayer(actionLayer)) {
                    let contextStr = map.is3D ? "3D" : "2D";
                    alerts = alerts.push(
                        alert.merge({
                            title: appStrings.ALERTS.SET_PARAMETER_FAILED.title,
                            body: appStrings.ALERTS.SET_PARAMETER_FAILED.formatString
                                .replace("{PARAMETER}", action.parameter)
                                .replace("{MAP}", contextStr),
                            severity: appStrings.ALERTS.SET_DATE_FAILED.severity,
                            time: new Date()
                        })
                    );
                    anyMapFail = true;
                }
            }
        });

        // only update layer if everything went well
        if (!anyMapFail) {
            state = state.setIn(
                ["layers", actionLayer.get("type"), actionLayer.get("id")],
                actionLayer
            );
        }

        return state.set("alerts", alerts);
    }

    /**
     * Define dinamically the current palette of the layer
     * @param {*} state
     * @param {*} action
     */
    static setLayerPalette(state, action) {
        // resolve layer from id if necessary
        let actionLayer = action.layer;
        if (typeof actionLayer === "string") {
            actionLayer = this.findLayerById(state, actionLayer);
            if (typeof actionLayer === "undefined") {
                return state;
            }
        }

        let newLayer = actionLayer.delete("palette");
        if (action.palette) {
            // get palette min/max
            const minKey = action.palette.get(0).get("value");
            const min = minKey.match(/\d+/g)[0] || "0";
            const maxKey = action.palette.get(action.palette.size - 1).get("value");
            const max = maxKey.match(/\d+/g)[0] || "0";

            // update palette name
            newLayer = actionLayer.delete("palette");
            if (action.paletteId) {
                newLayer = actionLayer
                    .setIn(["palette", "name"], action.paletteId)
                    .setIn(["palette", "handleAs"], "json-fixed")
                    .setIn(["palette", "min"], min)
                    .setIn(["palette", "max"], max)
                    .setIn(["palette", "values"], action.palette);
            }
        }

        return state.setIn(["layers", actionLayer.get("type"), actionLayer.get("id")], newLayer);
    }
}
