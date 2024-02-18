import {
    START_LOADER,
    END_LOADER,
} from "./actionTypes"

export const startloading = () => ({
    type: START_LOADER
})

export const endloading = () => ({
    type: END_LOADER
})