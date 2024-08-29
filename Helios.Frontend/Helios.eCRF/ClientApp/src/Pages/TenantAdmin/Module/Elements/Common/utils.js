export function GetElementNameByKey(props, key) {
    switch (key) {
        case 1:
            return props.t("Label");
        case 2:
            return props.t("Text");
        case 3:
            return props.t("Hidden");
        case 4:
            return props.t("Numeric");
        case 5:
            return props.t("Textarea");
        case 6:
            return props.t("Date");
        case 7:
            return props.t("Calculation");
        case 8:
            return props.t("Radio list");
        case 9:
            return props.t("Check list");
        case 10:
            return props.t("Dropdown");
        case 11:
            return props.t("Dropdown checklist");
        case 12:
            return props.t("File attachment");
        case 13:
            return props.t("Range slider");
        case 14:
            return props.t("Concomitant medication");
        case 15:
            return props.t("Table");
        case 16:
            return props.t("Datagrid");
        case 17:
            return props.t("Adverse event");
        case 18:
            return props.t("Randomization");
        default:
    }
}

const width = [
    { label: "col-md-1", value: 1 },
    { label: "col-md-2", value: 2 },
    { label: "col-md-3", value: 3 },
    { label: "col-md-4", value: 4 },
    { label: "col-md-5", value: 5 },
    { label: "col-md-6", value: 6 },
    { label: "col-md-7", value: 7 },
    { label: "col-md-8", value: 8 },
    { label: "col-md-9", value: 9 },
    { label: "col-md-10", value: 10 },
    { label: "col-md-11", value: 11 },
    { label: "col-md-12", value: 12 }
];

export function GetWidth() {
    return width;
}

const conditionList = [
    { label: "Less", value: 1 },
    { label: "More", value: 2 },
    { label: "Equal", value: 3 },
    { label: "More and equal", value: 4 },
    { label: "Less and equal", value: 5 },
    { label: "Not equal", value: 6 },
];

export function GetConditionList() {
    return conditionList;
}

const actionList = [
    { label: "Show", value: 1 },
    { label: "Hide", value: 2 },
]

export function GetActionList() {
    return actionList;
}

const validationMessageType = [
    { label: "Exclusion (blocks further data entry)", value: 1 },
    { label: "Error (prevents saving that field value)", value: 2 },
    { label: "Warning", value: 3 },
    { label: "Information", value: 4 },
];

export function GetValidationMessageType() {
    return validationMessageType;
}