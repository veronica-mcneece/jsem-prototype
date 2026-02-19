const wardrobe = [];

const imageInput = document.getElementById("imageInput");
const garmentTypeSelect = document.getElementById("garmentType");
const addButton = document.getElementById("addButton");
const wardrobeDisplay = document.getElementById("wardrobeDisplay");
const pairButton = document.getElementById("pairButton");
const pairingResult = document.getElementById("pairingResult");
const temperatureInput = document.getElementById("temperatureInput");
const aestheticMode = document.getElementById("aestheticMode");

// -------------------- ADD GARMENT --------------------

addButton.addEventListener("click", () => {
  const file = imageInput.files[0];
  if (!file) return alert("Upload an image.");

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;

    img.onload = () => {
      const dominantColor = extractDominantColor(img);

      wardrobe.push({
        image: reader.result,
        type: garmentTypeSelect.value,
        warmth: assignWarmth(garmentTypeSelect.value),
        label: garmentTypeSelect.value,
        color: dominantColor
      });

      displayWardrobe();
    };
  };

  reader.readAsDataURL(file);
});

// -------------------- AI DOMINANT COLOR (K-MEANS LIGHT VERSION) --------------------

function extractDominantColor(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 80;
  canvas.height = 80;
  ctx.drawImage(img, 0, 0, 80, 80);

  const data = ctx.getImageData(0, 0, 80, 80).data;
  const pixels = [];

  for (let i = 0; i < data.length; i += 16) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  let centroid = pixels[Math.floor(Math.random() * pixels.length)];

  for (let iteration = 0; iteration < 5; iteration++) {
    let r = 0, g = 0, b = 0;

    pixels.forEach(p => {
      r += p[0];
      g += p[1];
      b += p[2];
    });

    centroid = [
      r / pixels.length,
      g / pixels.length,
      b / pixels.length
    ];
  }

  return {
    r: Math.round(centroid[0]),
    g: Math.round(centroid[1]),
    b: Math.round(centroid[2])
  };
}

// -------------------- DISPLAY --------------------

function displayWardrobe() {
  wardrobeDisplay.innerHTML = "";

  wardrobe.forEach(item => {
    const div = document.createElement("div");
    div.className = "wardrobe-item";

    const img = document.createElement("img");
    img.src = item.image;

    div.appendChild(img);
    wardrobeDisplay.appendChild(div);
  });
}

// -------------------- PAIRING --------------------

pairButton.addEventListener("click", () => {
  if (wardrobe.length < 2) return alert("Add at least two garments.");

  const temp = parseInt(temperatureInput.value);
  const mode = aestheticMode.value;

  const filtered = wardrobe.filter(item => climateFilter(item, temp));

  if (filtered.length < 2) {
    return alert("Not enough climate appropriate garments.");
  }

  const base = filtered[0];
  const candidate = filtered[1];

  generateOutfit(base, candidate, temp, mode);
});

// -------------------- OUTFIT LOGIC --------------------

function generateOutfit(a, b, temp, mode) {
  const aHSL = rgbToHsl(a.color);
  const bHSL = rgbToHsl(b.color);

  const hueDiff = Math.abs(aHSL.h - bHSL.h);
  const lightDiff = Math.abs(aHSL.l - bHSL.l);

  let harmonyScore = 0;
  let contrastScore = 0;

  if (mode === "minimalist") {
    harmonyScore = 100 - hueDiff;
  } else if (mode === "bold") {
    harmonyScore = hueDiff;
  } else if (mode === "neutral") {
    harmonyScore = 100 - Math.abs(aHSL.s - bHSL.s) * 100;
  } else {
    harmonyScore = 100 - Math.abs(90 - hueDiff);
  }

  contrastScore = lightDiff * 100;

  const climateScore = climateScoreCalc(temp, a, b);

  updateMeter("harmonyMeter", harmonyScore);
  updateMeter("contrastMeter", contrastScore);
  updateMeter("climateMeter", climateScore);

  pairingResult.innerHTML = `
    <strong>${a.label} works with ${b.label}</strong>
    <p>
      Their hue difference of ${Math.round(hueDiff)}° creates 
      ${mode} harmony.
    </p>
    <p>
      The ${a.label} supports the ${b.label} without visual conflict.
    </p>
  `;
}

// -------------------- METERS --------------------

function updateMeter(id, value) {
  const meter = document.getElementById(id);
  meter.style.width = Math.min(value, 100) + "%";
}

// -------------------- COLOR UTILS --------------------

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b);
  const min = Math.min(r,g,b);
  let h=0,s,l=(max+min)/2;

  if(max!==min){
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){
      case r:h=(g-b)/d;break;
      case g:h=(b-r)/d+2;break;
      case b:h=(r-g)/d+4;break;
    }
    h*=60;
  }
  return {h,s,l};
}

// -------------------- CLIMATE --------------------

function assignWarmth(type){
  if(type==="outerwear") return "warm";
  if(type==="top") return "medium";
  return "light";
}

function climateFilter(item,temp){
  if(isNaN(temp)) return true;
  if(temp>=70 && item.warmth==="warm") return false;
  if(temp<=40 && item.warmth==="light") return false;
  return true;
}

function climateScoreCalc(temp,a,b){
  if(isNaN(temp)) return 50;
  if(temp>=70 && (a.warmth==="warm"||b.warmth==="warm")) return 20;
  if(temp<=40 && (a.warmth==="light"||b.warmth==="light")) return 20;
  return 100;
}
