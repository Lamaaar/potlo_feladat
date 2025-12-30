
/**
 * @type {{head: string[], body: {author: string, works: {title: string, concepts: string[]}[]}[]}}
 */
const tableData = {
    head: ['Szerző', 'Mű', 'Fogalmak'],
    body: [
        {
            author: 'Móricz Zsigmond',
            works: [
                {
                    title: 'Úri muri',
                    concepts: ['regény', 'dzsentri']
                },
                {
                    title: 'Tragédia',
                    concepts: ['novella']
                }
            ]
        },
        {
            author: 'Kosztolányi Dezső',
            works: [
                {
                    title: 'Édes Anna',
                    concepts: ['regény']
                },
                {
                    title: 'Esti Kornél',
                    concepts: ['novella', 'alakmás']
                }
            ]
        },
        {
            author: 'Babits Mihály',
            works: [
                {
                    title: 'Jónás könyve',
                    concepts: ['elbeszélő költemény', 'prófétaszerep']
                }
            ]
        }
    ]
};

/**
 * A szerző megváltoztatásakor frissíti a művek menüben elérhető opciókat
 * @param {Event} event
 * @returns {void}
 */
function dropdownChange(event) {
    const selectedValue = event.target.value;
    const workSelectElement = document.querySelector('.jssection #masodik');
    workSelectElement.innerHTML = '';

    for (const authorData of tableData.body) {
        if (authorData.author === selectedValue) {
            for (const work of authorData.works) {
                const optionElement = document.createElement('option');
                optionElement.value = work.title;
                optionElement.innerText = work.title;
                workSelectElement.appendChild(optionElement);
            }
        }
    }
}

/**
 * @type {{label: string, type: string, id: string, name: string}[]}
 */
const formFields = [
    {label: 'Szerző:', type: 'dropdown', id: 'elso', name: 'szerzo', handler: dropdownChange},
    {label: 'Mű:', type: 'dropdown', id: 'masodik', name: 'mu'},
    {label: 'Fogalom 1:', type: 'text', id: 'harmadik', name: 'fogalom1'},
    {label: 'Fogalom 2:', type: 'text', id: 'negyedik', name: 'fogalom2'},
    {label: 'Hozzáad', type: 'submit'}
]

/**
 * Létrehoz egy cellát a megadott paraméterek szerint
 * @param {string} type 
 * @param {string} content 
 * @param {number} [colspan] 
 * @returns {HTMLTableCellElement}
 */
function createCell(type, content, colspan, rowspan) {
    const cell = document.createElement(type);

    cell.innerText = content;

    if (colspan) {
        cell.colSpan = colspan;
    } else if (rowspan) {
        cell.rowSpan = rowspan;
    }

    return cell;
}

/**
 * Meghatározza az összes mű közül a max. előforduló fogalmak számát
 * @returns {number}
 */
function getMaxConcepts() {
    let max = 0;

    for (const authorData of tableData.body) {
        for (const work of authorData.works) {
            if (work.concepts.length > max) {
                max = work.concepts.length;
            }
        }
    }

    return max;
}

/**
 * Létrehozza a táblázat fejlécének sorát
 * @param {(string|{text: string, colspan: number})[]} rowData 
 * @returns {HTMLTableRowElement}
 */
function createHeadRow(rowData) {
    const tr = document.createElement('tr');

    for (const label of rowData) {
        const td = createCell('td', label);

        if (label === 'Fogalmak') {
            td.colSpan = getMaxConcepts();
        }

        tr.appendChild(td);
    }

    return tr;
}

/**
 * Létrehozza a táblázat törzsét
 * @param {HTMLTableSectionElement} tbody
 * @param {{head: (string|{text: string, colspan: number})[], body: (string|{text: string, colspan: number})[][]}} data
 * @returns {void}
 */
function createBody(tbody, data) {
    tbody.innerHTML = '';

    for (const authorData of data.body) {
        let workIndex = 1;

        for (const work of authorData.works) {
            const tr = document.createElement('tr');
            
            if (workIndex === 1) {
                const authorCell = createCell('td', authorData.author, false, authorData.works.length);
                authorCell.rowSpan = authorData.works.length;
                tr.appendChild(authorCell);
            }

            const workCell = createCell('td', work.title);
            tr.appendChild(workCell);

            let conceptIndex = 1;

            for (const concept of work.concepts) {
                const colSpan = getMaxConcepts() - work.concepts.length + 1;
                const conceptCell = createCell('td', concept);

                if (colSpan > 1 && conceptIndex === work.concepts.length) {
                    conceptCell.colSpan = colSpan;
                }

                tr.appendChild(conceptCell);
                conceptIndex++;
            }

            tbody.appendChild(tr);

            workIndex++;
        }
    }
}

/**
 * Létrehozza a táblázatot
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
    tbody.id = 'jstbody';
    table.appendChild(thead);
    table.appendChild(tbody);
    div.appendChild(table);

    const headRow = createHeadRow(data.head);
    thead.appendChild(headRow);

    createBody(tbody, data);
}

/**
 * Visszaad egy string-eket tartalmazó listát, mely a label szerinti dropdown-hoz tartozik
 * @param {string} label 
 * @returns {string[]}
 */
function getOptions(label) {
    const options = [];

    if (label === 'Szerző:') {
        for (const authorData of tableData.body) {
            options.push(authorData.author);
        }
    } else if (label === 'Mű:') {
        const authorSelectElement = document.querySelector('.jssection #elso');
        const selectedAuthor = authorSelectElement.value;

        for (const authorData of tableData.body) {
            if (authorData.author === selectedAuthor) {
                for (const work of authorData.works) {
                    options.push(work.title);
                }
            }
        }
    }

    return options;
}

/**
 * Létrehoz a form-hoz egy beviteli mezőt
 * @param {{label: string, type: string, id: string, name: string, handler?: (event: Event) => void}} field 
 * @returns {HTMLDivElement}
 */
function createFormField(field) {
    const div = document.createElement('div');
    
    if (field.type === 'submit') {
        const button = document.createElement('button');
        button.type = 'submit';
        button.innerText = field.label;
        div.appendChild(button);
        
        return div;
    }

    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.innerText = field.label;
    div.appendChild(label);

    if (field.type === 'dropdown') {
        const options = getOptions(field.label);
        const select = document.createElement('select');
        select.id = field.id;
        select.name = field.name;

        if (field.handler) {
            select.addEventListener('change', field.handler);
        }
        
        for (const option of options) {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.innerText = option;
            select.appendChild(optionElement);
        }

        div.appendChild(select);
    } else {
        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.name = field.name;
        div.appendChild(input);

        const error = document.createElement('p');
        error.classList.add('error');
        div.appendChild(error);
    }

    return div;
}

/**
 * Létrehozza a form-ot
 * @returns {void}
 */
function generateForm() {
    const section = document.querySelector('.jssection');

    const form = document.createElement('form');
    section.appendChild(form);

    for (const field of formFields) {
        const div = createFormField(field);
        form.appendChild(div);
    }
}

/**
 * Létrehozza a JS részleget
 * @returns {void}
 */
function generateJSSection() {
    generateTable(tableData);
    generateForm();
    document.querySelector('.jssection form').addEventListener('submit', JSFormHandler);
}

/**
 * A HTML/JS táblázatok közötti léptetést kezeli
 * @param {Event|undefined} event 
 */
function handleRadioChange(event) {
    const value = event ? event.target.value : 'js';

    const jsSection = document.querySelector('.jssection');
    const htmlSection = document.querySelector('.htmlsection');
    
    jsSection.style.display = value === 'js' ? 'block' : 'none';
    htmlSection.style.display = value === 'html' ? 'block' : 'none';
}

/**
 * A HTML form-on belüli dropdown-t kezeli
 * @param {Event|undefined} event 
 */
function handleHTMLFormDropdownChange(event) {
    const value = event ? event.target.value : 'double';

    const negyedikDivElement = document.querySelector('.htmlsection #negyedik').parentElement;
    const otodikDivElement = document.querySelector('.htmlsection #otodik').parentElement;

    if (value === 'double') {
        negyedikDivElement.classList.remove('hide');
        otodikDivElement.classList.remove('hide');
    } else {
        negyedikDivElement.classList.add('hide');
        otodikDivElement.classList.add('hide');
    }
}

/**
 * @type {HTMLDivElement}
 */
const tableSelectorElement = document.querySelector('#tableselector');
tableSelectorElement.addEventListener('change', handleRadioChange);

/**
 * @type {HTMLSelectElement}
 */
const formDropdownElement = document.querySelector('#htmlformdropdown');
formDropdownElement.addEventListener('change', handleHTMLFormDropdownChange);

/**
 * Ellenőrzi, hogy a mező érvényesen van-e kitöltve
 * @param {HTMLElement} inputElement
 * @returns {boolean} 
 */
function validateField(inputElement) {
    if (inputElement.value.trim() === '') {
        const errorElement = inputElement.parentElement.querySelector('.error');
        errorElement.innerText = 'Érvénytelen tartalom!';
        return false;
    }

    return true;
}

/**
 * Törli a hibaértesítéseket
 * @returns {void}
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error');

    for (const errorElement of errorElements) {
        errorElement.innerText = '';
    }
}

document.querySelector('.htmlsection form').addEventListener('submit',
    function (event) {
        event.preventDefault();
        clearErrors();

        /**
         * @type {string}
         */
        const selectedType = document.querySelector('#htmlformdropdown').value;
        
        /**
         * @type {string[]}
         */
        let fields = ['elso', 'masodik', 'harmadik'];
        
        if (selectedType === 'double') {
            fields = ['elso', 'masodik', 'harmadik', 'negyedik', 'otodik'];
        }

        let isValid = true;
        for (const fieldId of fields) {
            const inputElement = document.querySelector(`.htmlsection #${fieldId}`);
            if (!validateField(inputElement)) {
                isValid = false;
            }
        }

        if (isValid) {
            clearErrors();

            const tbody = document.querySelector('#htmltbody');
            const tr = document.createElement('tr');

            if (selectedType === 'simple') {
                for (const field of fields) {
                    const inputElement = document.querySelector(`.htmlsection #${field}`);
                    const inputValue = inputElement.value;

                    const cell = createCell('td', inputValue);

                    if (selectedType === 'double' && (field === 'elso')) {
                        cell.rowSpan = 2;
                    }

                    tr.appendChild(cell);
                }

                tbody.appendChild(tr);
            } else {
                const tr2 = document.createElement('tr');

                for (const field of fields) {
                    const inputElement = document.querySelector(`.htmlsection #${field}`);
                    const inputValue = inputElement.value;

                    const cell = createCell('td', inputValue);

                    if (field === 'elso') {
                        cell.rowSpan = 2;
                        tr.appendChild(cell);
                    } else if (field === 'negyedik' || field === 'otodik') {
                        tr2.appendChild(cell);
                    } else {
                        tr.appendChild(cell);
                    }
                }

                tbody.appendChild(tr);
                tbody.appendChild(tr2);
            }

            for (const fieldId of fields) {
                document.querySelector(`.htmlsection #${fieldId}`).value = '';
            }
        }
    }
);

/**
 * 
 * @param {Event} event 
 * @returns {void}
 */
function JSFormHandler(event) {
    event.preventDefault();
    clearErrors();

    const authorSelectElement = document.querySelector('.jssection #elso');
    const selectedAuthor = authorSelectElement.value;
    const workSelectElement = document.querySelector('.jssection #masodik');
    const selectedWork = workSelectElement.value;

    /**
     * @type {string[]}
     */
    const inputFields = ['harmadik', 'negyedik'];
    /**
     * @type {string[]}
     */
    const concepts = [];
    let validCount = 0;

    for (const fieldId of inputFields) {
        const inputElement = document.querySelector(`.jssection #${fieldId}`);
        
        if (validateField(inputElement)) {
            concepts.push(inputElement.value);
            validCount++;
        }
    }

    if (validCount < 1) {
        return;
    }
    
    clearErrors();

    for (const authorData of tableData.body) {
        if (authorData.author === selectedAuthor) {
            for (const work of authorData.works) {
                if (work.title === selectedWork) {
                    work.concepts = concepts;
                }
            }
        }
    }

    const tbody = document.querySelector('.jssection tbody');

    createBody(tbody, tableData);

    for (const fieldId of inputFields) {
        document.querySelector(`.jssection #${fieldId}`).value = '';
    }
}

generateJSSection();
handleRadioChange();
handleHTMLFormDropdownChange();