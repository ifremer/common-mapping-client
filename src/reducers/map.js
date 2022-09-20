import { mapState } from "reducers/models/map";
import mapCore from "_core/reducers/map";
import MapReducer from "reducers/reducerFunctions/MapReducer";
import * as actionTypes from "constants/actionTypes";

export default function map(state = mapState, action, opt_reducer = MapReducer) {
    switch (action.type) {
        case actionTypes.PIXEL_DRAG:
            return opt_reducer.pixelDrag(state, action);
        case actionTypes.UPDATE_URL_PARAMETER:
            return opt_reducer.updateLayerUrl(state, action);
        case actionTypes.BIND_LAYER_DATA:
            return opt_reducer.bindLayerData(state, action);
        default:
            return mapCore.call(this, state, action, opt_reducer);
    }
}
