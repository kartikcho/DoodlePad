const DEFAULT_CANVAS_WIDTH = 1080;
const DEFAULT_CANVAS_HEIGHT = 720;

let elFileInput = document.getElementById("elFileInput");
let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");
let preloadImage = document.getElementById("preloadImage");
let elExport = document.getElementById("elExport");
let elCanvasWidth = document.querySelector('#elCanvasWidth');
let elCanvasHeight = document.querySelector('#elCanvasHeight');

// Initialization method
function init() {
    // set default canvas size
    elCanvasWidth.value = DEFAULT_CANVAS_WIDTH;
    elCanvasHeight.value = DEFAULT_CANVAS_HEIGHT;
    canvas.width = DEFAULT_CANVAS_WIDTH;
    canvas.height = DEFAULT_CANVAS_HEIGHT;

    intialBrushSize()
}
init();

// Open file option
elFileInput.onchange = function() {
    preload_file(this.files);
    draw_preload_to_canvas(ctx, preloadImg);
}

function preload_file(fileList) {
    let file = null;
    let last_selected_file = fileList.length - 1;
    if (fileList[last_selected_file].type.match(/^image\//)) {
        file = fileList[last_selected_file];
    }
    if (file !== null) {
        preloadImg.src = URL.createObjectURL(file);
    }
}

function draw_preload_to_canvas(ctx, preloadImg) {
    preloadImg.onload = function() {
        ctx.drawImage(preloadImg, 5, 5);
    }
}

// Drawing option
const mouse = {
    down: false,
    lastPosition: { x: 0, y: 0 },
    color: '#000000', // default brush color
    brushSize: 1, // default brush size
}

canvas.addEventListener("mousedown", () => {
    mouse.down = true
})

canvas.addEventListener("mouseup", () => {
    mouse.down = false
})

canvas.addEventListener("mousemove", e => {
    if (mouse.down) {
        ctx.beginPath()
        ctx.moveTo(mouse.lastPosition.x, mouse.lastPosition.y)
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.strokeStyle = mouse.color
        ctx.lineWidth = mouse.brushSize
        ctx.stroke()
    }
    mouse.lastPosition.x = e.offsetX
    mouse.lastPosition.y = e.offsetY
})

// Export option (crude)
elExport.onclick = function() {
    download_url(get_canvas_data_url('png'));
}

function download_url(URL) {
    // downloads url by using a temporary link element
    let link = document.createElement('a');
    link.href = URL;
    link.download = URL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function get_canvas_data_url(fileType) {
    switch (fileType) {
        case "png":
            return canvas.toDataURL('image/png');
        case "jpg":
            return canvas.toDataURL('image/jpg');
    }
}

// Color picker
let colors = document.querySelectorAll('.color-picker button')
colors.forEach(button => {
    let color = button.style['background-color']
    button.addEventListener("click", () => {
        mouse.color = color
    })
})

// // Intial brush size
function intialBrushSize() {
    var slider = document.getElementById("change-brush-size");
    var output = document.getElementById("display-brush-size");
    output.innerHTML = slider.value;
}

// Brush size on change
document.querySelector('#change-brush-size').addEventListener("input", e => {
    let brushSize = parseInt(e.target.value)
    mouse.brushSize = brushSize
    document.querySelector('#display-brush-size').innerHTML = brushSize
})

// Canvas resize
let W = canvas.width;
let H = canvas.height;
elCanvasWidth.onchange = function() {
    let imageData = ctx.getImageData(0, 0, W, H);
    canvas.width = this.value;
    ctx.putImageData(imageData, 0, 0);
}

elCanvasHeight.onchange = function() {
    let imageData = ctx.getImageData(0, 0, W, H);
    canvas.height = this.value;
    ctx.putImageData(imageData, 0, 0);
}