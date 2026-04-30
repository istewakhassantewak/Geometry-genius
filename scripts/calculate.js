function getInputValueId(inputid) {
    const valueofid = document.getElementById(inputid).value;
    const valueidfloat = parseFloat(valueofid)
    return valueidfloat
}
function calculateTriangleArea() {
    const base = getInputValueId('triangle-base');

    const height = getInputValueId('triangle-height');

    const area = 0.5 * base * height;
    console.log(area);
    document.getElementById('triangle-area').innerText = area;
}
function calculateRectangleArea() {
    const width = getInputValueId('rectangle-width');
    const length = getInputValueId('rectangle-length');
    const area = width * length;
    document.getElementById('rectangle-area').innerText = area;
}
function calculateParallelogramArea() {
    const base = getInputValueId('Parallelogram-base');
    const height = getInputValueId('Parallelogram-height');
    const area = base * height;
    document.getElementById('Parallelogram-area').innerText = area;
}
function calculateRhombusArea() {
    const base = getInputValueId('Rhombus-base');
    const height = getInputValueId('Rhombus-height');
    const area = .5 * base * height;
    document.getElementById('Rhombus-area').innerText = area;
}
function calculatePentagonArea() {
    const base = getInputValueId('Pentagon-base');
    const height = getInputValueId('Pentagon-height');
    const area = .5 * base * height;
    document.getElementById('Pentagon-area').innerText = area;
}
function calculateEllipseArea() {
    const base = getInputValueId('Ellipse-base');
    const height = getInputValueId('Ellipse-height');
    const area = 3.14 * base * height;
    document.getElementById('Ellipse-area').innerText = area;
}