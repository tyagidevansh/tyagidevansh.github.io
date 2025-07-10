let bgShader;
let smoothMouseX = 0;
let smoothMouseY = 0;

function preload() {
  bgShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  // Balanced mouse tracking - responsive but smooth
  smoothMouseX = lerp(smoothMouseX, mouseX / width, 0.04); // Increased from 0.02
  smoothMouseY = lerp(smoothMouseY, 1.0 - mouseY / height, 0.04);

  shader(bgShader);

  bgShader.setUniform("iResolution", [width, height]);
  bgShader.setUniform("iTime", frameCount * 0.01);
  bgShader.setUniform("iMouse", [smoothMouseX, smoothMouseY]);

  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
