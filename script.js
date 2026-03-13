// Default Series dummy data
const defaultData = {
    index: [0, 1, 2, 3],
    data: [10, 20, 30, 40],
    dtype: 'int64'
};

// State
let currentTopic = 'creation';
let currentData = JSON.parse(JSON.stringify(defaultData)); 
let isDarkTheme = true;

// DOM Elements
const tableContainer = document.getElementById('table-container');
const actionButtons = document.getElementById('action-buttons');
const codeSnippet = document.getElementById('code-snippet');
const topicTitle = document.getElementById('topic-title');
const topicDoc = document.getElementById('topic-description');
const navItems = document.querySelectorAll('.nav-item:not(.special-btn)');
const themeToggle = document.getElementById('theme-toggle');
const actionConsole = document.getElementById('action-console');
const consoleSyntax = document.getElementById('console-syntax');
const consoleOutput = document.getElementById('console-output');

// Topic Definitions
const topicsInfo = {
    creation: {
        title: "Series Creation",
        desc: "A Series is a one-dimensional labeled array. You can create it from an ndarray, dictionary, or scalar value.",
        code: `# 1. From an ndarray or list\ns = pd.Series([10, 20, 30, 40])\n\n# 2. From a dictionary (keys become index)\ns = pd.Series({'a': 100, 'b': 200, 'c': 300})\n\n# 3. From a scalar value (repeated to match index)\ns = pd.Series(5, index=[0, 1, 2])`,
        buttons: [
            { label: "Create: List/ndarray", action: "createList", class: "primary" },
            { label: "Create: Dictionary", action: "createDict", class: "primary" },
            { label: "Create: Scalar", action: "createScalar", class: "primary" },
            { label: "Reset Series", action: "resetData", class: "warning" }
        ]
    },
    math: {
        title: "Mathematical Operations",
        desc: "Series support vectorized mathematical operations, aligning data intelligently by label.",
        code: `# Mathematical Operations\ns = s * 2\ns = s + 10\n\n# Adding two series (aligns on index)\nother = pd.Series({0: 1, 1: 1})\nres = s.add(other, fill_value=0)`,
        buttons: [
            { label: "s * 2 (Multiply)", action: "mathMultiply", class: "success" },
            { label: "s + 10 (Add)", action: "mathAdd", class: "success" },
            { label: "s.add(other_series)", action: "mathAddSeries", class: "warning" },
            { label: "Reset Series", action: "resetData", class: "" }
        ]
    },
    headtail: {
        title: "Head() and Tail()",
        desc: "Easily inspect the start or end of the Series, especially useful for large datasets.",
        code: `# View data boundaries\n# Top 2 elements\nprint(s.head(2))\n\n# Bottom 2 elements\nprint(s.tail(2))`,
        buttons: [
            { label: "s.head(2)", action: "showHead", class: "primary" },
            { label: "s.tail(2)", action: "showTail", class: "primary" },
            { label: "Reset Series", action: "resetData", class: "" }
        ]
    },
    selection: {
        title: "Selection, Indexing & Slicing",
        desc: "Access individual values or segments of a Series using labels or integer positions.",
        code: `# 1. Select by integer position\ns[1]\n\n# 2. Select by explicit label\ns['b']\n\n# 3. Slicing\ns[1:3] # Integer slicing\ns['a':'c'] # Label slicing (inclusive)`,
        buttons: [
            { label: "s[0] (Positional Index)", action: "selectIndex", class: "primary" },
            { label: "s['a'] (Label Index)", action: "selectLabel", class: "primary" },
            { label: "s[1:3] (Slice)", action: "sliceSeries", class: "warning" },
            { label: "Create Label Index Series", action: "createDict", class: "success" }
        ]
    },
    attributes: {
        title: "Series Attributes",
        desc: "A Series has several important attributes that provide information about its underlying structure without calling a method.",
        code: `# Key Attributes\nprint(s.values) # Underlying data array\nprint(s.index)  # The index labels\n\nprint(s.dtype)  # Data type\nprint(s.shape)  # Dimensions tuple\nprint(s.empty)  # Is it empty?`,
        buttons: [
            { label: "s.values (Data Array)", action: "showValuesAttr", class: "primary" },
            { label: "s.index (Labels)", action: "showIndexAttr", class: "primary" },
            { label: "s.dtype & s.shape", action: "showDtypeShapeAttr", class: "success" },
            { label: "Reset Series", action: "resetData", class: "warning" }
        ]
    }
};

// Core Functions
function setTopic(topic) {
    currentTopic = topic;
    
    // Update active nav state
    navItems.forEach(item => {
        if(item.dataset.topic === topic) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    const info = topicsInfo[topic];
    if (!info) return;

    topicTitle.textContent = info.title;
    topicDoc.textContent = info.desc;
    
    // Format code block
    codeSnippet.innerHTML = `<code>${info.code.replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;')}</code>`;
    
    // Render Buttons
    actionButtons.innerHTML = '';
    info.buttons.forEach((btn, idx) => {
        const button = document.createElement('button');
        button.className = 'action-btn ' + btn.class;
        if(idx === 0) button.classList.add('active-btn-style');
        
        button.textContent = btn.label;
        button.innerHTML += ` <span>▶</span>`;
        
        button.onclick = (e) => {
            document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active-btn-style'));
            e.currentTarget.classList.add('active-btn-style');
            actionRegistry[btn.action]();
        };
        actionButtons.appendChild(button);
    });

    resetData();
}

function renderSeries(dataObj = currentData, animate = true) {
    if(!dataObj || !dataObj.data) return;
    
    const rows = dataObj.data.length;

    const dfDiv = document.createElement('div');
    dfDiv.className = 'pandas-series';
    if(animate) dfDiv.classList.add('anim-slide-in');

    // Headers - Series essentially have Index and 0 (or a name)
    // We add an empty header for index, and "0" or series name for value
    dfDiv.appendChild(createCell('Index', 'series-cell series-header'));
    dfDiv.appendChild(createCell('Values', 'series-cell series-header'));

    // Data Rows
    dataObj.data.forEach((val, rIdx) => {
        // Index cell
        dfDiv.appendChild(createCell(dataObj.index[rIdx], 'series-cell series-index', `idx-${rIdx}`));
        // Value cell
        dfDiv.appendChild(createCell(val, 'series-cell', `cell-${rIdx}`));
    });

    // Add dtype summary row
    dfDiv.appendChild(createCell('', 'series-cell'));
    const dtypeCell = createCell(`dtype: <b>${dataObj.dtype}</b>`, 'series-cell');
    dtypeCell.style.color = 'var(--text-muted)';
    dtypeCell.style.fontSize = '0.8rem';
    dfDiv.appendChild(dtypeCell);

    tableContainer.innerHTML = '';
    tableContainer.appendChild(dfDiv);
}

function createCell(content, className, id = '') {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = content;
    if(id) div.id = id;
    return div;
}

function resetData() {
    currentData = JSON.parse(JSON.stringify(defaultData));
    if(actionConsole) actionConsole.classList.remove('visible');
    renderSeries();
}

function showConsole(syntax, output) {
    if(!actionConsole) return;
    actionConsole.classList.remove('visible');
    
    // trigger reflow to reset animation
    void actionConsole.offsetWidth;
    
    consoleSyntax.textContent = syntax || '';
    consoleOutput.textContent = output || '';

    actionConsole.classList.add('visible');
}

// Ensure output formatted strings like pandas
function formatOutputStr(dataObj) {
    let out = '';
    for(let i=0; i<dataObj.data.length; i++){
        out += `${dataObj.index[i]}    ${dataObj.data[i]}\\n`;
    }
    out += `dtype: ${dataObj.dtype}`;
    return out;
}

// === Action Functions for the Buttons ===
const actionRegistry = {
    renderSeries: () => {
        showConsole("s = pd.Series([10, 20, 30, 40])", formatOutputStr(currentData));
        renderSeries();
    },

    createList: () => {
        currentData = { index: [0, 1, 2, 3], data: [10, 20, 30, 40], dtype: 'int64' };
        showConsole("s = pd.Series([10, 20, 30, 40])", formatOutputStr(currentData));
        renderSeries();
    },

    createDict: () => {
        currentData = { index: ['a', 'b', 'c'], data: [100, 200, 300], dtype: 'int64' };
        showConsole("s = pd.Series({'a': 100, 'b': 200, 'c': 300})", formatOutputStr(currentData));
        renderSeries();
    },

    createScalar: () => {
        currentData = { index: [0, 1, 2], data: [5, 5, 5], dtype: 'int64' };
        showConsole("s = pd.Series(5, index=[0, 1, 2])", formatOutputStr(currentData));
        renderSeries();
    },

    mathMultiply: () => {
        showConsole("s = s * 2", "=> Vectorized Multiplication applied.");
        currentData.data = currentData.data.map(x => x * 2);
        renderSeries();
        setTimeout(() => {
            const cells = document.querySelectorAll('[id^="cell-"]');
            cells.forEach(c => c.classList.add('anim-highlight'));
        }, 50);
    },

    mathAdd: () => {
        showConsole("s = s + 10", "=> Broadcasted Addition applied.");
        currentData.data = currentData.data.map(x => x + 10);
        renderSeries();
        setTimeout(() => {
            const cells = document.querySelectorAll('[id^="cell-"]');
            cells.forEach(c => c.classList.add('anim-highlight'));
        }, 50);
    },

    mathAddSeries: () => {
        // Only works visually best if we have numerical indices
        if(typeof currentData.index[0] !== 'number') {
            actionRegistry.createList(); // reset to list quickly
        }
        showConsole("other = pd.Series({0: 1, 1: 1})\\ns = s.add(other, fill_value=0)", "=> Label-aligned addition applied.");
        currentData.data[0] += 1;
        if(currentData.data.length > 1) currentData.data[1] += 1;
        
        renderSeries();
        setTimeout(() => {
            const c0 = document.getElementById('cell-0');
            const c1 = document.getElementById('cell-1');
            if(c0) c0.classList.add('anim-highlight');
            if(c1) c1.classList.add('anim-highlight');
        }, 50);
    },

    showHead: () => {
        const headData = {
            index: currentData.index.slice(0, 2),
            data: currentData.data.slice(0, 2),
            dtype: currentData.dtype
        };
        showConsole("s.head(2)", formatOutputStr(headData));
        renderSeries(headData);
    },

    showTail: () => {
        const tailData = {
            index: currentData.index.slice(-2),
            data: currentData.data.slice(-2),
            dtype: currentData.dtype
        };
        showConsole("s.tail(2)", formatOutputStr(tailData));
        renderSeries(tailData);
    },

    selectIndex: () => {
        showConsole("s[0]", `=> ${currentData.data[0]}`);
        renderSeries();
        setTimeout(() => {
            const cells = document.querySelectorAll('.series-cell');
            cells.forEach(c => c.style.opacity = '0.3');
            
            const cell = document.getElementById('cell-0');
            const idx = document.getElementById('idx-0');
            if(cell) { cell.style.opacity = '1'; cell.classList.add('anim-highlight'); }
            if(idx) { idx.style.opacity = '1'; idx.classList.add('anim-highlight'); }
        }, 50);
    },

    selectLabel: () => {
        // Make sure we have labels
        if(currentData.index[0] !== 'a') {
            currentData = { index: ['a', 'b', 'c'], data: [100, 200, 300], dtype: 'int64' };
        }
        showConsole("s['a']", `=> ${currentData.data[0]}`);
        renderSeries();
        setTimeout(() => {
            const cells = document.querySelectorAll('.series-cell');
            cells.forEach(c => c.style.opacity = '0.3');
            
            const cell = document.getElementById('cell-0');
            const idx = document.getElementById('idx-0');
            if(cell) { cell.style.opacity = '1'; cell.classList.add('anim-highlight'); }
            if(idx) { idx.style.opacity = '1'; idx.classList.add('anim-highlight'); }
        }, 50);
    },

    sliceSeries: () => {
        // Slice 1:3 gets index 1 and 2
        const sliceData = {
            index: currentData.index.slice(1, 3),
            data: currentData.data.slice(1, 3),
            dtype: currentData.dtype
        };
        showConsole("s[1:3]", formatOutputStr(sliceData));
        renderSeries();
        setTimeout(() => {
            const cells = document.querySelectorAll('.series-cell');
            cells.forEach(c => c.style.opacity = '0.3');
            
            for(let i=1; i<3; i++) {
                if(i < currentData.data.length) {
                    const cell = document.getElementById(`cell-${i}`);
                    const idx = document.getElementById(`idx-${i}`);
                    if(cell) { cell.style.opacity = '1'; cell.classList.add('anim-highlight'); }
                    if(idx) { idx.style.opacity = '1'; idx.classList.add('anim-highlight'); }
                }
            }
        }, 50);
    },

    showValuesAttr: () => {
        showConsole("s.values", `=> array([${currentData.data.join(', ')}], dtype=${currentData.dtype})`);
        renderSeries();
        setTimeout(() => {
            const indexCells = document.querySelectorAll('.series-index');
            const indexHeader = document.querySelector('.series-header:first-child');
            if(indexHeader) indexHeader.classList.add('anim-hide-column');
            indexCells.forEach(c => c.classList.add('anim-hide-column'));
            
            const valueCells = document.querySelectorAll('.series-cell:not(.series-index):not(.series-header)');
            const valueHeader = document.querySelectorAll('.series-header')[1];
            if(valueHeader) valueHeader.classList.add('anim-expand-column');
            valueCells.forEach(c => c.classList.add('anim-expand-column'));
        }, 50);
    },

    showIndexAttr: () => {
        let indexStr = currentData.index[0] === 'a' 
            ? `Index(['a', 'b', 'c'], dtype='object')`
            : `RangeIndex(start=0, stop=${currentData.index.length}, step=1)`;
            
        showConsole("s.index", `=> ${indexStr}`);
        renderSeries();
        setTimeout(() => {
            const valueCells = document.querySelectorAll('.series-cell:not(.series-index):not(.series-header)');
            const valueHeader = document.querySelectorAll('.series-header')[1];
            if(valueHeader) valueHeader.classList.add('anim-hide-column-right');
            valueCells.forEach(c => c.classList.add('anim-hide-column-right'));
            
            const indexCells = document.querySelectorAll('.series-index');
            const indexHeader = document.querySelector('.series-header:first-child');
            if(indexHeader) indexHeader.classList.add('anim-expand-column');
            indexCells.forEach(c => c.classList.add('anim-expand-column'));
        }, 50);
    },

    showDtypeShapeAttr: () => {
        showConsole("print(s.dtype)\\nprint(s.shape)\\nprint(s.empty)", `${currentData.dtype}\\n(${currentData.data.length},)\\nFalse`);
        renderSeries();
        setTimeout(() => {
            const cells = document.querySelectorAll('.series-cell');
            cells.forEach(c => c.classList.add('anim-highlight'));
        }, 50);
    },

    resetData: resetData
};

// Event Listeners
navItems.forEach(item => {
    item.addEventListener('click', () => {
        setTopic(item.dataset.topic);
    });
});

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
});

// Video Modal Event Listeners
const videoModal = document.getElementById('video-modal');
const openVideoBtn = document.getElementById('open-video-modal'); 
const closeVideoBtn = document.getElementById('close-video-modal');

if (openVideoBtn) {
    openVideoBtn.addEventListener('click', () => {
        videoModal.classList.add('active');
    });
}
if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => {
        videoModal.classList.remove('active');
    });
}
if (videoModal) {
    videoModal.addEventListener('click', (e) => {
        if(e.target === videoModal) {
            videoModal.classList.remove('active');
        }
    });
}

// Init
setTopic('creation');
