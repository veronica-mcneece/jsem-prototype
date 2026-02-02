// ===== DOM ELEMENTS =====
const canvas = document.getElementById("colorWheel");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("hueSlider");

const baseColorBox = document.getElementById("baseColor");
const complementColorBox = document.getElementById("complementColor");
const explanationBox = document.createElement("p");
document.body.appendChild(explanationBox); // Display explanation below swatches

// ===== CANVAS SETUP =====
canvas.width = 360;   // Hue 0-359
canvas.height = 100;  // Lightness 0-100%
const hueWidth = canvas.width;
const lightHeight = canvas.height;

// ===== DRAW HSL GRID =====
function drawColorGrid() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < canvas.height; y++) {
    const lightness = 100 - (y / canvas.height) * 100; // top=white, bottom=black
    for (let x = 0; x < canvas.width; x++) {
      const hue = x; // 0-359
      const rgb = hslToRgb(hue, 100, lightness);
      const index = (y * canvas.width + x) * 4;
      data[index] = rgb.r;
      data[index + 1] = rgb.g;
      data[index + 2] = rgb.b;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// ===== HSL ↔ RGB HELPERS =====
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r=0,g=0,b=0;
  if(h<60) [r,g,b]=[c,x,0];
  else if(h<120) [r,g,b]=[x,c,0];
  else if(h<180) [r,g,b]=[0,c,x];
  else if(h<240) [r,g,b]=[0,x,c];
  else if(h<300) [r,g,b]=[x,0,c];
  else [r,g,b]=[c,0,x];
  return { r:Math.round((r+m)*255), g:Math.round((g+m)*255), b:Math.round((b+m)*255) };
}

// ===== UPDATE SWATCHES & EXPLANATION =====
function updateColors(hue) {
  hue = parseInt(hue);
  baseColorBox.style.backgroundColor = `hsl(${hue},100%,50%)`;
  const complementHue = (hue + 180) % 360;
  complementColorBox.style.backgroundColor = `hsl(${complementHue},100%,50%)`;

  // Explanation of color relationship
  explanationBox.innerText = `Base hue: ${hue}°. Complementary hue: ${complementHue}°.
Complementary colors are opposite each other on the color wheel. 
They create high contrast and vibrant visuals when paired together.`;
}

// ===== SLIDER CONTROL =====
slider.addEventListener("input", () => updateColors(slider.value));

// ===== GRID CLICK =====
canvas.addEventListener("click", function(event){
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  let x = Math.floor((event.clientX - rect.left) * scaleX);
  let y = Math.floor((event.clientY - rect.top) * scaleY);

  x = Math.max(0, Math.min(x, canvas.width-1));
  y = Math.max(0, Math.min(y, canvas.height-1));

  const pixel = ctx.getImageData(x,y,1,1).data;
  const hue = rgbToHsl(pixel[0], pixel[1], pixel[2]).h;
  updateColors(hue);
});

// ===== RGB → HSL =====
function rgbToHsl(r,g,b){
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0,l=(max+min)/2, s=0;
  if(max!==min){
    const d=max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d + (g<b?6:0); break;
      case g: h=(b-r)/d +2; break;
      case b: h=(r-g)/d +4; break;
    }
    h *= 60;
  }
  return {h:Math.round(h), s, l};
}

// ===== INITIALIZE =====
drawColorGrid();
updateColors(0);
