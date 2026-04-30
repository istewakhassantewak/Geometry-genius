function calculateRectangleArea() {
    const rectangleWidth = document.getElementById('rectangle-width').value;
    const width = parseFloat(rectangleWidth);
    const rectangleLength = document.getElementById('rectangle-length').value;
    const length = parseFloat(rectangleLength);
    const area = width * length;
    document.getElementById('rectangle-area').innerText = area;
}