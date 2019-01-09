//Global variables
var scene, camera, renderer;
var geometry, material, mesh;

function init(){
  // Create an empty scene --------------------------
  scene = new THREE.Scene();

  // Create a basic perspective camera --------------
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000 );

  // Create a renderer with Antialiasing ------------
  renderer = new THREE.WebGLRenderer({antialias:true});

  // Configure renderer clear color
  renderer.setClearColor("#000000");

  // Configure renderer size
  renderer.setSize( window.innerWidth, window.innerHeight );


  var textureLoader = new THREE.TextureLoader( manager );

  var texture = textureLoader.load( 'build/download.jpeg' );

  var manager = new THREE.LoadingManager( loadModel );

  function loadModel() {

    object.traverse( function ( child ) {

      if ( child.isMesh ) child.material.map = texture;

    } );

    object.position.z = -400;
    object.scale.set(10,10,10)
    object.position.y = 50;
    object.rotation.y = 90
    scene.add( object );

  }

  var loader = new THREE.OBJLoader( manager );

  loader.load( 'build/cloud.obj', function ( obj ) {

    object = obj;

  })

  // Append Renderer to DOM
  document.body.appendChild( renderer.domElement );
}

function createPanel() {

  var panel = new dat.GUI( { width: 310 } );

  var folder1 = panel.addFolder( 'Visibility' );

  settings = {
    'show model': true
  };
  folder1.add( settings, 'show model' ).onChange( showModel );
  folder1.open();


  function showModel( visibility ) {

    object.visible = visibility;

  }
}
function geometry(){
  // Configure lights -------------------------------
  var light1 = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light1);

  var light2 = new THREE.PointLight(0xffffff, 0.5);
  scene.add(light2);

  // Create a Cube Mesh with basic material ---------
  var geometry = new THREE.BoxGeometry(100, 100, 100);

  var geometry2 = new THREE.SphereGeometry(100, 100, 100);

  var material = new THREE.MeshPhongMaterial({shininess: 1});

  mesh2 = new THREE.Mesh( geometry2, material );
  mesh2.position.z = -1000;
  mesh2.position.y = 200

  mesh = new THREE.Mesh( geometry, material );
  mesh.position.z = -1000;
// ------------------------------------------------

// Add mesh to scene
scene.add( mesh);
}




// Render Loop
function render() {
  requestAnimationFrame( render );
  // Render the scene
  renderer.render(scene, camera);
};
createPanel();
init();
geometry();
render();
