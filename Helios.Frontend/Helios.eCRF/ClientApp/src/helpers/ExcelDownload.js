import ExcelJS from 'exceljs';

export const exportToExcel = async (data, fileName = 'exported_data', sheetName = 'Sheet 1') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    const headers = data.headers;
    const rows = data.rows;

    const targetCellCount = headers.length;

    for (let i = 0; i < targetCellCount; i++) {
        const header = headers[i];
        const cell = worksheet.getCell(1, i + 1);
        cell.value = header;
        cell.font = { color: { argb: 'FFFFFF' }, bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1fafaf' } };
        cell.border = {
            top: { style: 'thin', color: { argb: 'a8a8a8' } },
            left: { style: 'thin', color: { argb: 'a8a8a8' } },
        };
    }

    for (const dataRow of rows) {
        worksheet.addRow(Object.values(dataRow));
    }

    const blob = await workbook.xlsx.writeBuffer();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + ".xlsx";

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    a.dispatchEvent(clickEvent);

    window.URL.revokeObjectURL(url);
};