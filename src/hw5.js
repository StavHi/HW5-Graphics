import {OrbitControls} from './OrbitControls.js'

// Adding a way to get the folder of this current file
const baseUrl = new URL('.', import.meta.url).href;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

let score = 0;

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  // Court floor - just a simple brown surface
  const courtGeometry = new THREE.BoxGeometry(30, 0.2, 15);
  const textureLoader = new THREE.TextureLoader();
  const courtTexture = textureLoader.load(`${baseUrl}court_texture.jpg`); 

  const courtMaterial = new THREE.MeshPhongMaterial({ 
    map: courtTexture,
    specular: 0x111111,
    shininess: 50,
    flatShading: false,
    side: THREE.DoubleSide,
  });
  // const courtMaterial = new THREE.MeshPhongMaterial({ 
  //   color: 0xc68642,  // Brown wood color
  //   shininess: 50
  // });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  scene.add(court);
  
  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features
}


function createArc(x) {
  const fact = x / Math.abs(x);
  const ellipseGeometry = new THREE.EllipseCurve( 0, 0, fact * 7, fact * 7, Math.PI, 0, false, 0);

  // Get points on the curve
  const points = ellipseGeometry.getPoints(100);

  const movedPoints = points.map(current_point => new THREE.Vector3(current_point.y + x, 0, current_point.x))

  // Create geometry from points
  const arcGeometry = new THREE.BufferGeometry().setFromPoints(movedPoints);
  const arcMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  const arc = new THREE.Line(arcGeometry, arcMaterial);
  
  arc.position.set(0, 0.11, 0); 
  arc.receiveShadow = true;
  scene.add(arc);
}

function createCenterCircle() {
  // Adding white center circle

  const courtCenterCircleGeometry = new THREE.RingGeometry (3.3, 3.4, 100);
  // const courtCenterCircleGeometry = new THREE.CircleGeometry(3.5, 100);
  const courtCenterCircleMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,  // White color
    shininess: 50
  });
  const courtCenterCircle = new THREE.Mesh(courtCenterCircleGeometry, courtCenterCircleMaterial);
  courtCenterCircle.rotation.x = -Math.PI / 2;
  courtCenterCircle.position.set(0, 0.11, 0); 
  courtCenterCircle.receiveShadow = true;
  scene.add(courtCenterCircle);
}

function createCenterLine() {
    const centerLineGeometryCurve = new THREE.LineCurve3(
    new THREE.Vector3(0, 0, -7.5),
    new THREE.Vector3(0, 0, 7.5),
  );

  // Get points on the curve
  const points = centerLineGeometryCurve.getPoints(2);

  // Create geometry from points
  const centerLineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const centerLineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  const centerLine = new THREE.Line(centerLineGeometry, centerLineMaterial);
  // firstArcGeometryLine.rotation.x = -Math.PI / 2;
  centerLine.position.set(0, 0.11, 0); 
  // firstArc.receiveShadow = true;
  scene.add(centerLine);
}

function createBasketballCourtLines() {
  // Based on this: https://www.dimensions.com/element/basketball-court

  createCenterCircle();
  createArc(-15);
  createArc(15);
  createCenterLine();
}

function createPole(x, fact) {
    // Creating support structure. pole that touches the court.
  const supportStructurePoleGeometry  = new THREE.CylinderGeometry( 0.8, 0.8, 0.3, 30 );
  const supportStructurePoleMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x555555,  // gray color
    shininess: 0
  });
  const supportStructurePole = new THREE.Mesh(supportStructurePoleGeometry, supportStructurePoleMaterial);
  // supportStructureCourt.rotation.x = -Math.PI / 2;
  supportStructurePole.position.set(fact * x, 0.21, 0); 
  supportStructurePole.castShadow = true;
  supportStructurePole.receiveShadow = true;
  scene.add(supportStructurePole);

  // Creating support structure. pole that touches the court.
  const poleGeometry  = new THREE.CylinderGeometry( 0.2, 0.2, 10, 30 );
  const poleMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x555555,  // gray color
    shininess: 0
  });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  // supportStructureCourt.rotation.x = -Math.PI / 2;
  pole.position.set(fact * x, 4.91, 0); 
  pole.castShadow = true;
  pole.receiveShadow = true;
  scene.add(pole);
}

function createSupportArms(x, fact) { 
  // Creating support structure, arm that touches the board.
  const supportStructureArmGeometry = new THREE.CylinderGeometry( 0.15, 0.15, 2, 30 );
  const supportStructureArmMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x555555,  // Gray color
    shininess: 0
  });
  const supportStructureArm = new THREE.Mesh(supportStructureArmGeometry, supportStructureArmMaterial);
  supportStructureArm.rotation.z = degrees_to_radians(fact * 90);
  supportStructureArm.position.set(fact * (x - 0.95), 0.76 + 8, 0); 
  supportStructureArm.castShadow = true;
  supportStructureArm.receiveShadow = true;
  scene.add(supportStructureArm);

  // Creating support structure, arm that touches the board.
  const supportStructureArmGeometry2 = new THREE.CylinderGeometry( 0.15, 0.15, 2.2, 30 );
  const supportStructureArmMaterial2 = new THREE.MeshPhongMaterial({ 
    color: 0x555555,  // Gray color
    shininess: 0
  });
  const supportStructureArm2 = new THREE.Mesh(supportStructureArmGeometry2, supportStructureArmMaterial2);
  supportStructureArm2.rotation.z = degrees_to_radians(fact * 45);
  supportStructureArm2.position.set(fact * (x - 0.75), 0.98 + 7, 0); 
  supportStructureArm2.castShadow = true;
  supportStructureArm2.receiveShadow = true;
  scene.add(supportStructureArm2);
}

function addBorderHeight(board, boardGeometry, fact) {
  const borderGeometry = new THREE.BoxGeometry(3.5, 0.1, 0.5);
  const borderMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x2A2A2A,
   });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.rotation.copy(board.rotation);
  border.position.copy(board.position);
  border.position.z += fact * (-borderGeometry.parameters.depth / 2 - boardGeometry.parameters.depth / 2);
  border.receiveShadow = true;
  border.castShadow = true;
  scene.add(border);
}


function addBorderWidth(board, boardGeometry, fact) {
  const borderGeometry = new THREE.BoxGeometry(0.5, 0.1, 6.5);
  const borderMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x2A2A2A,
   });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.rotation.copy(board.rotation);
  border.rotation.y = degrees_to_radians(fact * 180);
  border.position.copy(board.position);
  border.position.y += fact * (-borderGeometry.parameters.width / 2 - boardGeometry.parameters.width / 2);
  border.receiveShadow = true;
  border.castShadow = true;
  scene.add(border);
}


function createBoard(x, fact) {

  const boardGeometry = new THREE.BoxGeometry(3, 0.1, 5.5);
  const boardMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,  // Brown wood color
    shininess: 0,
    transparent: true,
    opacity: 0.85
  });
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.rotation.z = degrees_to_radians(fact * 90);
  board.position.set(fact * (x - 2), 1.5 + 7, 0); 
  board.receiveShadow = true;
  board.castShadow = true;
  scene.add(board);

  addBorderHeight(board, boardGeometry, 1);
  addBorderHeight(board, boardGeometry, -1);
  addBorderWidth(board, boardGeometry, 1);
  addBorderWidth(board, boardGeometry, -1);

}


function createHoopRing(x, fact) {
    //Adding hoop's ring
  const ringGeometry = new THREE.TorusGeometry(0.75, 0.06, 16, 100);
  const ringMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFF8C00,  // Orange color
    shininess: 50
  });

  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.set(fact * (x - 2.85), 1.5 + 7, 0); 
  ring.rotation.x = degrees_to_radians(fact * 90);
  ring.receiveShadow = true;
  ring.castShadow = true;
  scene.add(ring);
  return {ring, ringGeometry};
}


function createRingNet(ring, ringGeometry) {
  // Adding nets
  const lineLength = 1.55;
  const numNetLines = 16;
  const lowerRingRadiusUpperRingRadiusDiff = 0.2
  for (let i=0; i < numNetLines; i++) {
    const angle = (i / numNetLines) * 2 * Math.PI;
    const vect1 = new THREE.Vector3(ring.position.x + ringGeometry.parameters.radius * Math.cos(angle),
                                    ring.position.y,
                                    ring.position.z + ringGeometry.parameters.radius * Math.sin(angle));
    const vect2 = new THREE.Vector3(ring.position.x + (ringGeometry.parameters.radius - 
                                    lowerRingRadiusUpperRingRadiusDiff) * Math.cos(angle),
                                    ring.position.y - lineLength,
                                    ring.position.z + (ringGeometry.parameters.radius - 
                                    lowerRingRadiusUpperRingRadiusDiff) * Math.sin(angle));
    const lineNetGeometryCurve = new THREE.LineCurve3(vect1, vect2);
      // Get points on the curve
    const points = lineNetGeometryCurve.getPoints(2);

    // Create geometry from points
    const lineNetGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineNetMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff
    });
    const lineNet = new THREE.Line(lineNetGeometry, lineNetMaterial);
    lineNet.receiveShadow = true;
    lineNet.castShadow = true;
    // firstArc.receiveShadow = true;
    scene.add(lineNet);
  }
}

function createBasketballHook(x, fact) {
  createPole(x, fact);
  createSupportArms(x, fact);
  createBoard(x, fact);
  const {ring, ringGeometry} = createHoopRing(x, fact);
  createRingNet(ring, ringGeometry);
}

function createRingLine(radius, segments = 300) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    points.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return geometry;
}

function addSingleSeam(ball, ballGeometry, rotation) {
  const seamLineGeometry = createRingLine(ballGeometry.parameters.radius);
  const seamMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const ring = new THREE.Line(seamLineGeometry, seamMaterial);
  ring.rotation.copy(rotation);
  ball.add(ring);
}


function addSeams(ball, ballGeometry) {
  addSingleSeam(ball, ballGeometry, new THREE.Euler(0, Math.PI / 2, 0));
  addSingleSeam(ball, ballGeometry, new THREE.Euler(0, 0, Math.PI / 2));
  addSingleSeam(ball, ballGeometry, new THREE.Euler(0, 0, -Math.PI / 4));
  addSingleSeam(ball, ballGeometry, new THREE.Euler(0, 0, Math.PI / 4));
  }

function createBaskeballBall() {
  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 16);
  const textureLoader = new THREE.TextureLoader();
  const ballTexture = textureLoader.load(`${baseUrl}texture.jpg`); 

  const ballMaterial = new THREE.MeshPhongMaterial({ 
    map: ballTexture,
    specular: 0x111111,
    shininess: 10,
    flatShading: false,
    side: THREE.DoubleSide,
  });

  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0, 0.61, 0);
  ball.receiveShadow = true;
  ball.castShadow = true;
  ball.rotation.y = Math.PI / 4;
  scene.add(ball);

  addSeams(ball, ballGeometry);
}

// Create all elements
createBasketballCourt();
createBasketballCourtLines();
createBasketballHook(14, 1);
createBasketballHook(14, -1);
createBaskeballBall();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

function createInstructionDisplay() {
  // Instructions display
  const instructionsElement = document.createElement('div');
  instructionsElement.style.position = 'absolute';
  instructionsElement.style.bottom = '2%';
  instructionsElement.style.left = '1%';
  instructionsElement.style.color = 'white';
  instructionsElement.style.fontSize = '16px';
  instructionsElement.style.fontFamily = 'Arial, sans-serif';
  instructionsElement.style.textAlign = 'left';
  instructionsElement.innerHTML = `
    <h3>Controls:</h3>
    <p>O - Toggle orbit camera</p>
  `;
  document.body.appendChild(instructionsElement);
}


function createScoreDisplay(){
  // Score display
  const scoreElement = document.createElement('div');
  scoreElement.style.position = 'absolute';
  scoreElement.style.top = '2%';
  scoreElement.style.left = '1%';
  scoreElement.style.color = '#FFD580';
  scoreElement.style.fontSize = '16px';
  scoreElement.style.fontFamily = 'Arial, sans-serif';
  scoreElement.style.textAlign = 'left';
  scoreElement.innerHTML = `
    <h3>Score: ${score}</h3>
  `;
  document.body.appendChild(scoreElement);
}

createInstructionDisplay();
createScoreDisplay();


// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

animate();

