const chooseImg = document.querySelector(".chooseImg"),
    fileDialog = document.querySelector("input[type = file]"),
    imgcontainer = document.querySelector(".img"),
    filterbtns = Array(...document.querySelectorAll(".filters button")),
    title = document.querySelector(".range p .title"),
    valueRange = document.querySelector(".range p .valueRange"),
    rangeSlider = document.querySelector(".range #range"),
    container = document.querySelector(".container"),
    rotateFlipsBtns = document.querySelectorAll(".rotateFlipBtns button"),
    resetBtn = document.querySelector(".resetFilters"),
    saveBtn = document.querySelector(".saveImg");



let brightness = 100, saturation = 100, inversion = 0, grayscale = 0, rotate = 0, flipX = 1, flipY = 1;

function applayFilters() {
    const img = document.querySelector("img");
    img.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}) grayscale(${grayscale})`;
    img.style.transform = `rotate(${rotate}deg) scaleX(${flipX}) scaleY(${flipY})`

}

filterbtns.forEach((btn) => {
    btn.onclick = () => {
        filterbtns.forEach(btn => {
            btn.classList.remove("active");
        })
        btn.classList.add("active");
        title.textContent = btn.textContent;

        if (btn.classList.contains("brightness")) {
            rangeSlider.max = 200;
            rangeSlider.step = 1;
            valueRange.textContent = `${brightness}%`;
            rangeSlider.value = brightness;
        }
        else if (btn.classList.contains("saturation")) {
            rangeSlider.max = 200;
            rangeSlider.step = 1;
            valueRange.textContent = `${saturation}%`;
            rangeSlider.value = saturation;
        }
        else if (btn.classList.contains("inversion")) {
            rangeSlider.max = 1;
            rangeSlider.step = 1 / 10;
            valueRange.textContent = `${inversion}`;
            rangeSlider.value = inversion;

        }
        else if (btn.classList.contains("grayscale")) {
            rangeSlider.max = 1;
            rangeSlider.step = 1 / 10;
            valueRange.textContent = `${grayscale}`;
            rangeSlider.value = grayscale;

        }
    }
});


const updateSlider = function () {
    let selectedFilter = document.querySelector(".filters .active");

    if (selectedFilter.classList.contains("brightness")) {
        valueRange.textContent = `${rangeSlider.value}%`;
        brightness = rangeSlider.value
    }
    else if (selectedFilter.classList.contains("saturation")) {
        valueRange.textContent = `${rangeSlider.value}%`;
        saturation = rangeSlider.value;
    }
    else if (selectedFilter.classList.contains("inversion")) {
        valueRange.textContent = `${rangeSlider.value}`;
        inversion = rangeSlider.value;
    }
    else if (selectedFilter.classList.contains("grayscale")) {
        valueRange.textContent = `${rangeSlider.value}`;
        grayscale = rangeSlider.value;
    }
    applayFilters();
}


function rotateAndFlip(btn) {
    if (btn.className === "rotateLeft") {
        rotate -= 90
    }
    else if (btn.className === "rotateRight") {
        rotate += 90
    }
    else if (btn.className === "flipLeft") {
        flipX = flipX === 1 ? -1 : 1;
    }
    else if (btn.className === "flipRight") {
        flipY = flipY === 1 ? -1 : 1;
    }
    applayFilters()

}


function resetFilters() {
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0, rotate = 0, flipX = 1, flipY = 1;
    filterbtns[0].click();
    applayFilters();

}


function addImage(e) {
    const imgSrc = URL.createObjectURL(e.target.files[0]);
    imgcontainer.innerHTML = `<img src="${imgSrc}" alt="img">`;
    container.classList.remove("disabled");
    check();
}



function check() {
    filterbtns.forEach(btn => {
        if (!container.classList.contains("disabled")) {
            btn.removeAttribute("disabled");
            rangeSlider.removeAttribute("disabled");
            resetBtn.removeAttribute("disabled");
            saveBtn.removeAttribute("disabled");
        }
    });

    rotateFlipsBtns.forEach(btn => {
        if (!container.classList.contains("disabled")) {
            btn.removeAttribute("disabled");
        }
    });
}
// ============================================================= //
// lets work on save image
function saveImage() {
    const img = document.querySelector("img");
    const canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.translate(canvas.width / 2, canvas.height / 2)
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
        
    }
    ctx.scale(flipX, flipY)
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}) grayscale(${grayscale})`;
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
    const anchor = document.createElement("a");
    anchor.download = "image.png";
    let canvasUrl = canvas.toDataURL();
    anchor.href = canvasUrl;
    document.body.appendChild(anchor);
    resetBtn.click();
    saveBtn.textContent = `saving...`
    setTimeout(() => {
        anchor.click()
        saveBtn.textContent = `save image`
        document.body.removeChild(anchor);
    }, 500)

}
chooseImg.addEventListener("click", () => fileDialog.click());

fileDialog.onchange = (e) => addImage(e);

rangeSlider.addEventListener("input", updateSlider);

rotateFlipsBtns.forEach((btn) => btn.addEventListener("click", () => rotateAndFlip(btn)));

resetBtn.addEventListener("click", resetFilters);

saveBtn.addEventListener("click", saveImage);