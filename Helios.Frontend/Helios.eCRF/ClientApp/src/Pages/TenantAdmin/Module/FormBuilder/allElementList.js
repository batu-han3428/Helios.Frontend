const elements = [
    { key: 17, name: 'Adverse event', icon: 'fas fa-heartbeat' },
    { key: 7, name: 'Calculation', icon: 'fas fa-calculator' },
    { key: 9, name: 'Check list', icon: 'fas fa-check-square' },
    { key: 14, name: 'Concomitant medication', icon: 'dripicons-view-list' },
    { key: 16, name: 'Datagrid', icon: 'fas fa-table' },
    { key: 6, name: 'Date', icon: 'far fa-calendar-alt ' },
    { key: 10, name: 'Dropdown', icon: 'ti-arrow-circle-down' },
    { key: 12, name: 'File attachment', icon: 'fas fa-file-import' },
    { key: 3, name: 'Hidden', icon: 'fas fa-puzzle-piece' },
    { key: 1, name: 'Label', icon: 'fas fa-text-height' },
    { key: 11, name: 'Dropdown checklist', icon: 'ti-arrow-circle-down' },
    { key: 4, name: 'Numeric', icon: 'fas fa-sort-numeric-down' },
    { key: 8, name: 'Radio list', icon: 'ion ion-md-radio-button-on' },
    { key: 18, name: 'Randomization', icon: 'fas fa-random' },
    { key: 13, name: 'Range slider', icon: 'fas fa-sliders-h' },
    { key: 15, name: 'Table', icon: 'fas fa-table' },
    { key: 2, name: 'Text', icon: 'fas fa-font' },
    { key: 5, name: 'Textarea', icon: 'fas fa-ad' },
];

export function GetAllElementList() {
    return elements;
}

export function GetAllElementListForSelect(excludedKeys) {
    var lmOptionGroup = [];
    var data = GetAllElementList();

    // Use filter to exclude the item with the specified keys
    data.filter(item => !excludedKeys.includes(item.key))
        .map(item => {
            var itm = { label: item.name, value: item.key };
            lmOptionGroup.push(itm);
        });

    return lmOptionGroup;
}


