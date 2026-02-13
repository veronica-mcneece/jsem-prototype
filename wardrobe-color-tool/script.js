// -------------------- DATA --------------------

const wardrobe = [];

const imageInput = document.getElementById("imageInput");
const garmentTypeSelect = document.getElementById("garmentType");
const addButton = document.getElementById("addButton");
const wardrobeDisplay = document.getElementById("wardrobeDisplay");
const pairButton = document.getElementById("pairButton");
const pairingResult = document.getElementById("pairingResult");

// -------------------- ADD GARMENT --------------------

addButton.addEventListener("click", () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Please upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;

    img.onload = () => {
      const color = extractAverageColor(img);

      wardrobe.push({
        image: reader.result,
        type: garmentTypeSelect.value,
        color
      });

      displayWardrobe();
    };
  };

  reader.readAsDataURL(file);
});

// -------------------- COLOR EXTRACTION --------------------

function extractAverageColor(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 60;
  canvas.height = 60;
  ctx.drawImage(img, 0, 0, 60, 60);

  const data = ctx.getImageData(0, 0, 60, 60).data;

  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const saturation = max - min;

    if (saturation < 20) continue;

    r += red;
    g += green;
    b += blue;
    count++;
  }

  if (count === 0) {
    return { r: 128, g: 128, b: 128 };
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  };
}

// -------------------- DISPLAY WARDROBE --------------------

function displayWardrobe() {
  wardrobeDisplay.innerHTML = "";

  wardrobe.forEach(item => {
    const div = document.createElement("div");
    div.className = "wardrobe-item";

    const img = document.createElement("img");
    img.src = item.image;

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor =
      `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})`;

    div.appendChild(img);
    div.appendChild(colorBox);
    wardrobeDisplay.appendChild(div);
  });
}

// -------------------- PAIRING --------------------

pairButton.addEventListener("click", () => {
  if (wardrobe.length < 2) {
    alert("Add at least two garments.");
    return;
  }

  const base = wardrobe[0];
  const baseHSL = rgbToHsl(base.color);
  const candidates = wardrobe.slice(1);

  let bestMatch = null;
  let bestScore = -Infinity;

  candidates.forEach(item => {
    const score = compatibilityScore(
      baseHSL,
      rgbToHsl(item.color)
    );

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  });

  showPairing(base, bestMatch);
});

// -------------------- COLOR THEORY --------------------

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
      case r:
        h = (g - b) / d;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return { h, s, l };
}

function compatibilityScore(a, b) {
  const hueDiff = Math.abs(a.h - b.h);
  const hueScore = 180 - Math.abs(180 - hueDiff);
  const lightnessScore = Math.abs(a.l - b.l) * 100;

  return hueScore + lightnessScore;
}

// -------------------- THEORY CHECK (NEW LOGIC) --------------------

function detectClash(aHSL, bHSL) {
  const hueDiff = Math.abs(aHSL.h - bHSL.h);
  const lightnessDiff = Math.abs(aHSL.l - bHSL.l);
  const satDiff = Math.abs(aHSL.s - bHSL.s);

  // Vibrating complements
  if (hueDiff > 150 && aHSL.s > 0.6 && bHSL.s > 0.6) {
    return {
      type: "Vibrating Complements",
      reason: "Simultaneous Contrast: Opposites compete for photoreceptors.",
      effect: "Edges may glow or visually vibrate, causing eye strain."
    };
  }

  // Value dead-end
  if (lightnessDiff < 0.1) {
    return {
      type: "Value Dead-End",
      reason: "Low Luminance Contrast: Similar brightness levels.",
      effect: "Shapes visually blend together."
    };
  }

  // Muddy discord
  if (satDiff > 0.5) {
    return {
      type: "Saturation Conflict",
      reason: "Pure color paired with muted/earth tone.",
      effect: "One garment may appear washed out or dirty."
    };
  }

  // Near-miss
  if (hueDiff < 25 && hueDiff > 5 && satDiff < 0.2) {
    return {
      type: "Near-Miss Analogous Tension",
      reason: "Too close for contrast, too far to match.",
      effect: "Feels slightly accidental."
    };
  }

  return null;
}

// -------------------- OUTPUT --------------------

function showPairing(a, b) {
  const aHSL = rgbToHsl(a.color);
  const bHSL = rgbToHsl(b.color);

  const clash = detectClash(aHSL, bHSL);

  if (clash) {
    pairingResult.innerHTML = `
      <p><strong>⚠️ Potential Clash Detected: ${clash.type}</strong></p>
      <p><em>Why:</em> ${clash.reason}</p>
      <p><em>Visual Effect:</em> ${clash.effect}</p>
      <p>
        This pairing may feel visually tense rather than harmonious.
      </p>
    `;
    return;
  }

  const hueDiff = Math.abs(aHSL.h - bHSL.h);
  const lightnessDiff = Math.abs(aHSL.l - bHSL.l);

  let harmonyText = "";

  if (hueDiff > 150) {
    harmonyText = "Balanced Complementary: Opposites create strong but intentional contrast.";
  } else if (hueDiff > 60) {
    harmonyText = "Triadic/High Contrast Harmony: Distinct but balanced hues.";
  } else {
    harmonyText = "Analogous/Monochromatic Harmony: Related hues create cohesion.";
  }

  pairingResult.innerHTML = `
    <p><strong>✅ Why this pairing works:</strong></p>
    <p>${harmonyText}</p>
    <p>
      The brightness difference helps maintain clarity between garments.
    </p>
    <p>
      This pairing was generated using only colors found in your wardrobe.
    </p>
  `;
}
