export function GetElementPropertiesPlace(elementType) {
    switch (elementType) {
        case 2:
        case 4:
        case 5:
            return 0;
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            return 1;
        case 1:
            return 2;
        case 3:
        case 6:
        case 7:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
            return 3;
        default:
            return 0;
    }
}

export function GetElementPropertiesWidth(elementType) {
    switch (elementType) {
        case 1:
        case 7:
            return "col-md-6";
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
            return "col-md-10";
        default:
            return "";
    }
}