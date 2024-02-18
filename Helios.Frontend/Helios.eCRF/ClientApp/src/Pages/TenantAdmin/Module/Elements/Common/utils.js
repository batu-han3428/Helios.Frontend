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
            return props.t("Adverse Event");
        default:
    }
}