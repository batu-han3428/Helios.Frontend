import {
    ADD_STUDY,
    GET_STUDY,
    RESET_STUDY
} from "./actionTypes"

const study = {
    studyId: '',
    equivalentStudyId: '',
    studyName: '',
    studyLink: '',
    isDemo: false,
    protocolCode: '',
    studyLanguage: 0,
    description: '',
    subDescription: '',
    /* subjectnumberdigist: '',*/
    doubleDataEntry: false,
    askSubjectInitial:false,
    reasonForChange: true,
}

const studyReducer = (state = study, action) => {
    switch (action.type) {
        case ADD_STUDY:
            return state = {
                studyId: action.payload.study.id,
                equivalentStudyId: action.payload.study.equivalentStudyId,
                studyName: action.payload.study.studyName,
                studyLink: action.payload.study.studyLink,
                isDemo: action.payload.study.isDemo,
                protocolCode: action.payload.study.protocolCode,
                studyLanguage: action.payload.study.studyLanguage,
                description: action.payload.study.description,
                subDescription: action.payload.study.subDescription,
                /* subjectnumberdigist: '',*/
                doubleDataEntry: action.payload.study.doubleDataEntry,
                askSubjectInitial: action.payload.study.askSubjectInitial,
                reasonForChange: action.payload.study.reasonForChange,
            }
        case GET_STUDY:
            return state;
        case RESET_STUDY:
            return study;
        default:
            return state;
    }
};

export default studyReducer