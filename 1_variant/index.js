
/**
 * @type {{head: (string|{text: string, colspan: number})[], body: (string|{text: string, colspan: number})[][]}}
 */
const tableData = {
    head: ['Szerző', 'Mű', {text: 'Fogalmak', colspan: 2}],
    body: [
        ['Móricz Zsigmond', 'Úri muri', 'regény', 'dzsentri'],
        ['Móricz Zsigmond', 'Tragédia', {text: 'novella', colspan: 2}],
        ['Kosztolányi Dezső', 'Édes Anna', {text: 'regény', colspan: 2}],
        ['Kosztolányi Dezső', 'Esti Kornél', 'novella', 'alakmás'],
        ['Babits Mihály', 'Jónás könyve', 'elbeszélő költemény', 'prófétaszerep']
    ]
};

/**
 * 
 * @param {string} type 
 * @param {string} content 
 * @param {number} [colspan] 
 * @returns {HTMLTableCellElement}
 */
function createCell(type, content, colspan) {
    const cell = document.createElement(type);

    cell.innerText = content;

    if (colspan) {
        cell.colSpan = colspan;
    }

    return cell;
}

/**
 * 
 * @param {(string|{text: string, colspan: number})[]} rowData 
 * @returns {HTMLTableRowElement}
 */
function createRow(rowData) {
    const tr = document.createElement('tr');

    for (const cellData of rowData) {
        let td;

        if (typeof cellData === 'object') {
            td = createCell('td', cellData.text, cellData.colspan);
        } else {
            td = createCell('td', cellData);
        }

        tr.appendChild(td);
    }

    return tr;
}

/**
 * 
 * @param {{head: (string|{text: string, colspan: number})[], body: (string|{text: string, colspan: number})[][]}} data
 * @returns {void}
 */
function generateTable(data) {
    const body = document.body;

    const div = document.createElement('div');
    body.appendChild(div);
    div.classList.add('jssection');

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);
    div.appendChild(table);

    const headRow = createRow(data.head);
    thead.appendChild(headRow);

    for (const rowData of data.body) {
        const tr = createRow(rowData);

        tbody.appendChild(tr);
    }
}

/**
 * 
 * @param {Event|undefined} event 
 */
function handleRadioChange(event) {
    const value = event ? event.target.value : 'js';

    const jsSection = document.querySelector('.jssection');
    jsSection.style.display = value === 'js' ? 'block' : 'none';

    const htmlSection = document.querySelector('.htmlsection');
    htmlSection.style.display = value === 'html' ? 'block' : 'none';
}

const tableSelectorElement = document.querySelector('#tableselector');
tableSelectorElement.addEventListener('change', handleRadioChange);

generateTable(tableData);
handleRadioChange();