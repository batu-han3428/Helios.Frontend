import TextElement from '../Elements/TextElement/textElement.js';
import NumericElement from '../Elements/NumericElement/numericElement.js';
import RadioElement from '../Elements/RadioElement/radioElement.js';
import CheckElement from '../Elements/CheckElement/checkElement.js';
import DropdownElement from '../Elements/DropdownElement/dropdownElement.js';
import DropdownCheckListElement from '../Elements/DropdownCheckListElement/dropdownCheckListElement.js';
import LabelElement from '../Elements/LabelElement/labelElement.js';
import DateElement from '../Elements/DateElement/dateElement.js';
import TextareaElement from '../Elements/TextareaElement/textareaElement.js';
import FileUploaderElement from '../Elements/FileUploaderElement/fileUploaderElement.js';
import RangeSliderElement from '../Elements/RangeSliderElement/rangeSliderElement.js';
import DatagridElement from '../Elements/DatagridElement/datagridElement.js';

const elements = [
    { key: 17, name: 'Adverse Event', icon: 'fas fa-heartbeat' },
    { key: 7, name: 'Calculation', icon: 'fas fa-calculator' },
    { key: 9, name: 'Check List', icon: 'fas fa-check-square' },
    { key: 14, name: 'Concomitant medication', icon: 'dripicons-view-list' },
    { key: 16, name: 'Datagrid', icon: 'fas fa-table' },
    { key: 6, name: 'Date', icon: 'far fa-calendar-alt ' },
    { key: 10, name: 'Drop Down', icon: 'ti-arrow-circle-down' },
    { key: 12, name: 'File Attachmen', icon: 'fas fa-file-import' },
    { key: 3, name: 'Hidden', icon: 'fas fa-puzzle-piece' },
    { key: 1, name: 'Label', icon: 'fas fa-text-height' },
    { key: 11, name: 'Drop Down Checklist', icon: 'ti-arrow-circle-down' },
    { key: 4, name: 'Numeric', icon: 'fas fa-sort-numeric-down' },
    { key: 8, name: 'Radio List', icon: 'ion ion-md-radio-button-on' },
    { key: 13, name: 'Range Slider', icon: 'fas fa-sliders-h' },
    { key: 15, name: 'Table', icon: 'fas fa-table' },
    { key: 2, name: 'Text', icon: 'fas fa-font' },
    { key: 5, name: 'Textarea', icon: 'fas fa-ad' },
];

export function GetAllElementList() {
    return elements;
}

export function GetAllElementListForSelect(excludedKey) {
    var lmOptionGroup = [];
    var data = GetAllElementList();

    // Use filter to exclude the item with the specified key
    data.filter(item => item.key !== excludedKey)
        .map(item => {
            var itm = { label: item.name, value: item.key };
            lmOptionGroup.push(itm);
        });

    return lmOptionGroup;
}


