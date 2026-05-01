const shapeConfig = {
    triangle: {
        name: 'Triangle',
        inputs: ['triangle-base', 'triangle-height'],
        labels: ['base', 'height'],
        formula: '0.5 × base × height',
        compute: ({ triangleBase, triangleHeight }) => 0.5 * triangleBase * triangleHeight,
        resultId: 'triangle-area',
        metadata: 'Use positive numbers for base and height.',
    },
    rectangle: {
        name: 'Rectangle',
        inputs: ['rectangle-width', 'rectangle-length'],
        labels: ['width', 'length'],
        formula: 'width × length',
        compute: ({ rectangleWidth, rectangleLength }) => rectangleWidth * rectangleLength,
        resultId: 'rectangle-area',
        metadata: 'Width and length must both be positive values.',
    },
    parallelogram: {
        name: 'Parallelogram',
        inputs: ['parallelogram-base', 'parallelogram-height'],
        labels: ['base', 'height'],
        formula: 'base × height',
        compute: ({ parallelogramBase, parallelogramHeight }) => parallelogramBase * parallelogramHeight,
        resultId: 'parallelogram-area',
        metadata: 'Height is perpendicular to the base.',
    },
    rhombus: {
        name: 'Rhombus',
        inputs: ['rhombus-d1', 'rhombus-d2'],
        labels: ['diagonal 1', 'diagonal 2'],
        formula: '0.5 × diagonal 1 × diagonal 2',
        compute: ({ rhombusD1, rhombusD2 }) => 0.5 * rhombusD1 * rhombusD2,
        resultId: 'rhombus-area',
        metadata: 'Diagonals must be positive and measured in centimeters.',
    },
    pentagon: {
        name: 'Pentagon',
        inputs: ['pentagon-perimeter', 'pentagon-apothem'],
        labels: ['perimeter', 'apothem'],
        formula: '0.5 × perimeter × apothem',
        compute: ({ pentagonPerimeter, pentagonApothem }) => 0.5 * pentagonPerimeter * pentagonApothem,
        resultId: 'pentagon-area',
        metadata: 'Use the full perimeter and apothem of the pentagon.',
    },
    ellipse: {
        name: 'Ellipse',
        inputs: ['ellipse-a', 'ellipse-b'],
        labels: ['semi-major axis', 'semi-minor axis'],
        formula: 'π × a × b',
        compute: ({ ellipseA, ellipseB }) => Math.PI * ellipseA * ellipseB,
        resultId: 'ellipse-area',
        metadata: 'Use semi-axis lengths for a and b.',
    },
};

const appState = {
    activeShape: null,
    activity: [],
};

const latestCalculation = {
    shapeKey: null,
    area: null,
};

function clearInputStates() {
    document.querySelectorAll('.card-input').forEach((input) => {
        input.classList.remove('border-rose-500', 'ring-1', 'ring-rose-300', 'bg-rose-50');
    });
    const message = document.getElementById('panel-message');
    if (message) {
        message.textContent = '';
    }
}

function getInputValue(inputId) {
    const raw = document.getElementById(inputId)?.value.trim();
    const value = parseFloat(raw);
    return Number.isFinite(value) ? value : null;
}

function buildResultText(shapeKey, area) {
    if (area === null || Number.isNaN(area)) {
        return 'Invalid input';
    }
    return `${Number(area.toFixed(2)).toLocaleString()} cm²`;
}

function updateSidebar(shapeKey, area, inputs) {
    const shape = shapeConfig[shapeKey];
    const panelShapeName = document.getElementById('panel-shape-name');
    const panelResult = document.getElementById('panel-result');
    const panelMetadata = document.getElementById('panel-metadata');
    const panelActivity = document.getElementById('panel-activity');

    appState.activeShape = shapeKey;
    appState.activity.unshift({
        label: shape.name,
        formula: shape.formula,
        value: buildResultText(shapeKey, area),
        inputs,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    if (appState.activity.length > 5) {
        appState.activity.pop();
    }

    panelShapeName.innerText = shape.name;
    panelResult.innerText = buildResultText(shapeKey, area);
    panelMetadata.innerText = `${shape.formula}. ${shape.metadata}`;
    document.getElementById('panel-formula').innerText = shape.formula;
    const panelMessage = document.getElementById('panel-message');
    if (panelMessage) {
        panelMessage.textContent = '';
    }
    panelActivity.innerHTML = appState.activity
        .map(
            (entry) => `<li class="rounded-3xl bg-white p-3 shadow-sm"><strong class="text-slate-900">${entry.label}</strong><span class="block text-sm text-slate-500">${entry.value}</span><span class="block mt-1 text-xs text-slate-400">${entry.time}</span></li>`,
        )
        .join('');

    latestCalculation.shapeKey = shapeKey;
    latestCalculation.area = area;

    openPanel();
}

function showError(shapeKey, message, invalidIds = []) {
    const panelMetadata = document.getElementById('panel-metadata');
    const panelResult = document.getElementById('panel-result');
    const panelShapeName = document.getElementById('panel-shape-name');
    const panel = document.getElementById('calculation-panel');
    const panelMessage = document.getElementById('panel-message');

    const shape = shapeConfig[shapeKey];
    if (panelShapeName) panelShapeName.innerText = shape.name;
    if (panelResult) panelResult.innerText = '—';
    if (panelMetadata) panelMetadata.innerText = 'Please enter valid positive numbers for each field.';
    if (panelMessage) panelMessage.textContent = message;

    clearInputStates();
    invalidIds.forEach((inputId) => {
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.add('border-rose-500', 'ring-1', 'ring-rose-300', 'bg-rose-50');
        }
    });

    if (panel) {
        openPanel();
    }
}

function openPanel() {
    const panel = document.getElementById('calculation-panel');
    const backdrop = document.getElementById('panel-backdrop');
    if (!panel) return;

    panel.classList.remove('hidden', 'translate-x-full');
    if (backdrop) {
        backdrop.classList.remove('hidden');
    }
}

function toCamelCase(inputId) {
    return inputId
        .split('-')
        .map((segment, index) =>
            index === 0 ? segment : `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`,
        )
        .join('');
}

function handleCalculate(shapeKey) {
    const shape = shapeConfig[shapeKey];
    if (!shape) return;

    const values = {};
    const inputs = [];
    let valid = true;
    const invalidIds = [];

    clearInputStates();

    shape.inputs.forEach((inputId, index) => {
        const value = getInputValue(inputId);
        const key = toCamelCase(inputId);
        values[key] = value;
        inputs.push(`${shape.labels[index]}: ${value === null ? 'invalid' : value}`);
        if (value === null || value <= 0) {
            valid = false;
            invalidIds.push(inputId);
        }
    });

    const computedArea = valid ? shape.compute(values) : null;

    const resultNode = document.getElementById(shape.resultId);
    if (resultNode) {
        resultNode.innerText = valid ? Number(computedArea.toFixed(2)).toLocaleString() : '—';
    }

    if (!valid) {
        showError(shapeKey, 'Please correct highlighted fields.', invalidIds);
        return;
    }

    updateSidebar(shapeKey, computedArea, inputs);
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('nav-toggle');
    const expanded = menu.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', expanded.toString());
}

function closePanel() {
    const panel = document.getElementById('calculation-panel');
    const backdrop = document.getElementById('panel-backdrop');
    if (!panel) return;

    if (window.innerWidth <= 1023) {
        panel.classList.add('hidden', 'translate-x-full');
        if (backdrop) {
            backdrop.classList.add('hidden');
        }
    }
}

function copyResult() {
    if (!latestCalculation.shapeKey || latestCalculation.area === null) {
        const panelMessage = document.getElementById('panel-message');
        if (panelMessage) {
            panelMessage.textContent = 'No result available to copy yet.';
        }
        return;
    }

    const text = `${shapeConfig[latestCalculation.shapeKey].name} area: ${Number(latestCalculation.area.toFixed(2)).toLocaleString()} cm²`;
    const panelMessage = document.getElementById('panel-message');
    const showCopySuccess = () => {
        if (panelMessage) {
            panelMessage.textContent = 'Result copied to clipboard.';
        }
    };
    const showCopyFailure = () => {
        if (panelMessage) {
            panelMessage.textContent = 'Clipboard copy failed. Please copy the text manually.';
        }
    };

    const fallbackCopy = () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess();
            } else {
                showCopyFailure();
            }
            return successful;
        } catch (error) {
            showCopyFailure();
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopySuccess).catch(() => {
            fallbackCopy();
        });
    } else {
        fallbackCopy();
    }
}

function resetInputs() {
    document.querySelectorAll('.card-input').forEach((input) => {
        input.value = '';
        input.classList.remove('border-rose-500', 'ring-1', 'ring-rose-300', 'bg-rose-50');
    });
    document.querySelectorAll('[id$="-area"]').forEach((span) => {
        span.textContent = '—';
    });
    latestCalculation.shapeKey = null;
    latestCalculation.area = null;
    appState.activity = [];
    clearInputStates();
    const panelShapeName = document.getElementById('panel-shape-name');
    const panelResult = document.getElementById('panel-result');
    const panelMetadata = document.getElementById('panel-metadata');
    const panelFormula = document.getElementById('panel-formula');
    const panelActivity = document.getElementById('panel-activity');
    if (panelShapeName) panelShapeName.innerText = 'No shape selected';
    if (panelResult) panelResult.innerText = '—';
    if (panelMetadata) panelMetadata.innerText = '';
    if (panelFormula) panelFormula.innerText = 'No formula selected';
    if (panelActivity) panelActivity.innerHTML = '';
    closePanel();
}

function setupListeners() {
    document.getElementById('nav-toggle')?.addEventListener('click', toggleMobileMenu);
    document.getElementById('close-panel')?.addEventListener('click', closePanel);
    document.getElementById('copy-result')?.addEventListener('click', copyResult);
    document.getElementById('reset-inputs')?.addEventListener('click', resetInputs);

    document.querySelectorAll('.calculate-button').forEach((button) => {
        button.addEventListener('click', () => {
            const shapeKey = button.dataset.shape;
            handleCalculate(shapeKey);
        });
    });

    document.querySelectorAll('.card-input').forEach((input) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const shapeKey = input.closest('[data-shape]')?.dataset.shape;
                if (shapeKey) {
                    handleCalculate(shapeKey);
                }
            }
        });

        input.addEventListener('input', () => {
            input.classList.remove('border-rose-500', 'ring-1', 'ring-rose-300', 'bg-rose-50');
            const panelMessage = document.getElementById('panel-message');
            if (panelMessage) {
                panelMessage.textContent = '';
            }
        });
    });

    document.addEventListener('click', (event) => {
        const panel = document.getElementById('calculation-panel');
        const isClickInsidePanel = panel?.contains(event.target);
        const isOpen = panel && !panel.classList.contains('hidden');

        if (!isClickInsidePanel && isOpen && window.innerWidth <= 1023) {
            const target = event.target;
            if (!target.closest('#nav-toggle') && !target.closest('#mobile-menu')) {
                closePanel();
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', setupListeners);
