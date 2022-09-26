import * as coreTypes from "_core/constants/actionTypes";
import * as types from "constants/actionTypes";

export function pixelDrag(clickEvt) {
    return { type: types.PIXEL_DRAG, clickEvt };
}

export function mapMoveEnd() {
    return { type: types.MAP_MOVE_END };
}

export function updateUrlParameter(layer, parameter, value) {
    return { type: types.UPDATE_URL_PARAMETER, layer, parameter, value };
}

export function setLayerPalette(layer, paletteConfig) {
    return { type: coreTypes.SET_LAYER_PALETTE, layer, paletteConfig };
}

export function bindLayerData(layer, parameter, value, paletteId, palette) {
    return { type: types.BIND_LAYER_DATA, layer, parameter, value, paletteId, palette };
}
