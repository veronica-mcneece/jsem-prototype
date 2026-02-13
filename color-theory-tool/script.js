// ===== DOM ELEMENTS =====
const slider = document.getElementById("hueSlider");
const palette = document.getElementById("palette");

// ===== PALETTE DATA =====
function getPalettes(h) {
  h = Math.round(h);

  return [
    {
      name: "Analogous",
      hues: [(h - 30 + 360) % 360, h, (h + 30) % 360],
      text: "Analogous palettes use neighboring hues, creating cohesion and visual calm."
    },
    {
      name: "Complementary",
      hues: [h, (h + 180) % 360],
      text: "Complementary colors sit opposite each other, producing high contrast and visual tension."
    },
    {
      name: "Triadic",
      hues: [h, (h + 120) % 360, (h + 240) % 360],
      text: "Triadic palettes balance contrast and harmony using evenly spaced hues."
    }
  ];
}

// ===== RENDER =====
function renderPalettes(hue) {
  palette.innerHTML = "";

  getPalettes(hue).forEach(p => {
    const group = document.createElement("section");
    group.className = "palette-group";

    const title = document.createElement("h3");
    title.textContent = p.name;
    group.appendChild(title);

    const row = document.createElement("div");
    row.className = "swatch-row";

    p.hues.forEach(h => {
      const swatch = document.createElement("div");
      swatch.className = "palette-swatch";
      swatch.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
      row.appendChild(swatch);
    });

    const caption = document.createElement("p");
    caption.className = "palette-text";
    caption.textContent = p.text;

    group.appendChild(row);
    group.appendChild(caption);
    palette.appendChild(group);
  });
}

// ===== INTERACTION =====
slider.addEventListener("input", e => {
  renderPalettes(e.target.value);
});

// ===== INIT =====
renderPalettes(0);
