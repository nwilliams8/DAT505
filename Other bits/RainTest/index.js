
var leaves = 1200;
var planes = [];
function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 250;
  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x0 );

  scene.add( camera );
  renderer = new THREE.WebGLRenderer();

  var light = new THREE.AmbientLight(0xffffff, 1)
  scene.add(light)

  // model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  var onError = function () { };

    var manager = new THREE.LoadingManager( loadModel );

    var textureLoader = new THREE.TextureLoader( manager );

    var texture = textureLoader.load( 'textures/water.jpg' );

    var loader = new THREE.OBJLoader( manager );

    function loadModel() {

      object2.traverse( function ( child ) {

        if ( child.isMesh ) child.material.map = texture;

      } );
      object2.position.z = 120;
      object2.position.x = 10;
      object2.position.y = 35;
      object2.rotation.y = Math.PI / 2;
      object2.scale.x = 3;
      object2.scale.y = 3;
      object2.scale.z = 3;
      scene.add( object2 );

    }

    loader.load( 'models/cloud.obj', function ( obj2 ) {

        object2 = obj2;

    })
    var planePiece = new THREE.PlaneBufferGeometry( 0.5, 0.5, 0.5, 0.5 );
    var planeMat = new THREE.MeshPhongMaterial( {
        color: 0x33fff9,
        shininess: 0.5,
        specular: 0xffffff,
        side: THREE.DoubleSide
      } );
    var rand = Math.random;
    for ( var i = 0; i < leaves; i ++ ) {
      var plane = new THREE.Mesh( planePiece, planeMat );
      plane.rotation.set( rand(), rand(), rand() );
      plane.rotation.dx = rand() * 0.1;
      plane.rotation.dy = rand() * 0.1;
      plane.rotation.dz = rand() * 0.1;
      plane.position.set( rand() * 100 -55, rand() * 100 +12 , rand() * 80 + 70 );
      plane.position.dx = ( rand() - 0.5 );
      plane.position.dz = ( rand() - 0.5 );
      scene.add( plane );
      planes.push( plane );
    }



  var panel = new dat.GUI( { width: 310 } );
  var folder1 = panel.addFolder( 'Weather' );

  settings = {
    'Rain': true,
  };

  folder1.add( settings, 'Rain' ).onChange( showModel );
  folder1.open();




  function showModel( visibility ) {

    object2.visible = visibility;

    planes.forEach(function(c,i){
      var plane = planes[ i ];
      plane.visible = visibility
    })

  }

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  //
  window.addEventListener( 'resize', onWindowResize, false );
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 0, 120 );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
  requestAnimationFrame( animate );
  render();
}
function render() {
  planes.forEach(function(c,i){
    plane = planes[ i ];
    plane.rotation.x += plane.rotation.dx;
    plane.rotation.y += plane.rotation.dy;
    plane.rotation.z += plane.rotation.dz;
    plane.position.y -= 2;
    if ( plane.position.y < 0 ){
      plane.position.y += 35;
  }
  })

  renderer.render( scene, camera );
}
init();
animate();
