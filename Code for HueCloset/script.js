// -------------------- STATE --------------------

let wardrobe = JSON.parse(localStorage.getItem("wardrobe")) || [];

// -------------------- ADD GARMENT --------------------

addButton.addEventListener("click", () => {
  const file = imageInput.files[0];
  if (!file) return alert("Upload an image.");

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;

    img.onload = () => {
      const color = extractDominantColor(img);

      const item = {
        image: reader.result,
        type: garmentTypeSelect.value,
        warmth: assignWarmth(garmentTypeSelect.value),
        label: garmentTypeSelect.value,
        color: color
      };

      wardrobe.push(item);
      saveWardrobe();
      displayWardrobe();
    };
  };

  reader.readAsDataURL(file);
});

// -------------------- COLOR DETECTION --------------------

function extractDominantColor(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 80;
  canvas.height = 80;
  ctx.drawImage(img, 0, 0, 80, 80);

  const data = ctx.getImageData(0, 0, 80, 80).data;
  const buckets = {};

  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;

    const key = `${r},${g},${b}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }

  const dominant = Object.keys(buckets).reduce((a, b) =>
    buckets[a] > buckets[b] ? a : b
  );

  const [r, g, b] = dominant.split(",").map(Number);
  return { r, g, b };
}

// -------------------- DISPLAY --------------------

function displayWardrobe() {
  wardrobeDisplay.innerHTML = "";

  wardrobe.forEach(item => {
    const div = document.createElement("div");
    div.className = "wardrobe-item";

    const img = document.createElement("img");
    img.src = item.image;
    img.width = 80;

    const dot = document.createElement("div");
    dot.style.width = "12px";
    dot.style.height = "12px";
    dot.style.borderRadius = "50%";
    dot.style.background = `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})`;
    dot.style.marginTop = "5px";

    div.appendChild(img);
    div.appendChild(dot);

    wardrobeDisplay.appendChild(div);
  });
}

// -------------------- GENERATE OUTFIT --------------------

pairButton.addEventListener("click", () => {
  const temp = parseInt(temperatureInput.value);
  const mode = aestheticMode.value;

  if (wardrobe.length < 2) {
    return alert("Add at least two garments.");
  }

  let tops = wardrobe.filter(i => i.type === "top");
  let bottoms = wardrobe.filter(i => i.type === "bottom");

  if (!tops.length || !bottoms.length) {
    pairingResult.textContent = "Need at least one top and one bottom.";
    return;
  }

  // Temperature filtering
  tops = tops.filter(t => climateFilter(t, temp));
  bottoms = bottoms.filter(b => climateFilter(b, temp));

  if (!tops.length || !bottoms.length) {
    pairingResult.textContent = "No suitable outfit for this temperature.";
    return;
  }

  let best = null;
  let bestScore = -Infinity;

  tops.forEach(top => {
    bottoms.forEach(bottom => {
      const score = scoreOutfit(top, bottom, temp, mode);
      if (score > bestScore) {
        bestScore = score;
        best = { top, bottom };
      }
    });
  });

  displayOutfit(best.top, best.bottom, temp, mode);
});

// -------------------- SCORING --------------------

function scoreOutfit(top, bottom, temp, mode) {
  const a = rgbToHsl(top.color);
  const b = rgbToHsl(bottom.color);

  const hueDiff = Math.abs(a.h - b.h);
  const lightDiff = Math.abs(a.l - b.l);
  const satDiff = Math.abs(a.s - b.s);

  let harmony = 0;

  const complementary = Math.abs(180 - hueDiff);
  const analogous = Math.min(hueDiff, 360 - hueDiff);

  if (mode === "bold") {
    harmony = 100 - complementary;
  } else if (mode === "minimalist") {
    harmony = 100 - analogous;
  } else if (mode === "neutral") {
    harmony = 100 - satDiff * 100;
  } else {
    harmony = 100 - Math.min(complementary, analogous);
  }

  const contrast = lightDiff * 100;
  const climate = climateScoreCalc(temp, top, bottom);

  return harmony * 0.5 + contrast * 0.2 + climate * 0.3;
}

// -------------------- DISPLAY OUTFIT --------------------

function displayOutfit(top, bottom, temp, mode) {
  const a = rgbToHsl(top.color);
  const b = rgbToHsl(bottom.color);

  const hueDiff = Math.abs(a.h - b.h);
  const lightDiff = Math.abs(a.l - b.l);

  const harmony = 100 - Math.min(Math.abs(180 - hueDiff), hueDiff);
  const contrast = lightDiff * 100;
  const climate = climateScoreCalc(temp, top, bottom);

  updateMeter("harmonyMeter", harmony);
  updateMeter("contrastMeter", contrast);
  updateMeter("climateMeter", climate);

  const explanation = getExplanation(mode);

  pairingResult.innerHTML = `
    <div style="display:flex; gap:20px;">
      <div>
        <h3>Top</h3>
        <img src="${top.image}" width="100">
      </div>
      <div>
        <h3>Bottom</h3>
        <img src="${bottom.image}" width="100">
      </div>
    </div>

    <p><strong>Why it works:</strong> ${explanation}</p>
    <p>Hue difference: ${Math.round(hueDiff)}°</p>
  `;
}

function getExplanation(mode) {
  if (mode === "bold") {
    return "Uses complementary colors for strong contrast.";
  }
  if (mode === "minimalist") {
    return "Uses similar tones for a clean aesthetic.";
  }
  if (mode === "neutral") {
    return "Balances soft, low-saturation colors.";
  }
  return "Balances contrast and harmony for everyday style.";
}

// -------------------- METERS --------------------

function updateMeter(id, value) {
  const meter = document.getElementById(id);
  meter.style.width = Math.min(Math.max(value, 0), 100) + "%";
}

// -------------------- COLOR UTILS --------------------

function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h *= 60;
  }

  return { h, s, l };
}

// -------------------- CLIMATE --------------------

function assignWarmth(type) {
  if (type === "outerwear") return "warm";
  if (type === "top") return "medium";
  return "light";
}

function climateFilter(item, temp) {
  if (isNaN(temp)) return true;

  if (temp >= 70 && item.warmth === "warm") return false;
  if (temp <= 40 && item.warmth === "light") return false;

  return true;
}

function climateScoreCalc(temp, a, b) {
  if (isNaN(temp)) return 50;

  if (temp >= 70 && (a.warmth === "warm" || b.warmth === "warm"))
    return 40;

  if (temp <= 40 && (a.warmth === "light" || b.warmth === "light"))
    return 40;

  return 100;
}

// -------------------- STORAGE --------------------

function saveWardrobe() {
  localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
}

// -------------------- INIT --------------------

displayWardrobe();