import {
    START_LOADER,
    END_LOADER,
} from "./actionTypes"

const loader = false;

const loaderReducer = (state = loader, action) => {
    switch (action.type) {
        case START_LOADER:
            return state = true;
        case END_LOADER:
            return state = false;
        default:
            return state;
    }
};

export default loaderReducer