
var leaves = 1200;
var planes = [];
var backcolor = (0xbfe3dd);
var object2 = 0;
var speed = 0;
var speed2 = 0;
var clouds = []
var intensity = 2;
var cloud = 10
function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 250;
  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( backcolor );

  scene.add( camera );
  renderer = new THREE.WebGLRenderer();

  var hemiLight = new THREE.HemisphereLight(backcolor, 0x444444, intensity)
  hemiLight.position.set (0, 20, 0);
  scene.add(hemiLight)

  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	scene.add( dirLight );

  ssaoPass = new THREE.SSAOPass( scene, camera, window.innerWidth, window.innerHeight );
	ssaoPass.kernelRadius = 16;
	ssaoPass.renderToScreen = true;

  effectComposer = new THREE.EffectComposer( renderer );
	effectComposer.addPass( ssaoPass );
  // model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  var onError = function () { };
  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
  new THREE.MTLLoader()
    .setPath( 'textures/' )
    .load( 'city.mtl', function ( materials ) {
      materials.preload();
      new THREE.OBJLoader()
        .setMaterials( materials )
        .setPath( 'models/' )
        .load( 'city.obj', function ( object ) {
          object.position.z = 120;
          object.castShadow = true;
          object.recieveShadow = true;
          scene.add( object );
        }, onProgress, onError );
    } );

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
      clouds.push( object2 );

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
  var obj = { sunset:function(){
    scene.background = new THREE.Color (0xdc9d57)
    hemiLight.color = new THREE.Color(0xdc9d57)
    hemiLight.intensity = 1
  }
};
  var obj2 = { noon:function(){
    scene.background = new THREE.Color (0xbfe3dd)
    hemiLight.color = new THREE.Color(0xbfe3dd)
    hemiLight.intensity = 2
    console.log("clicked")
  }
};
  var obj3 = { night:function(){
    scene.background = new THREE.Color (0x0)
    hemiLight.color = new THREE.Color(0x0)
    hemiLight.intensity = 0.3
    console.log("clicked")
  }
};

  var folder1 = panel.addFolder( 'Weather' );
  var folder2 = panel.addFolder( 'Time of Day' );

  settings = {
    'Rain': true,
    'Color': backcolor,
    'Wind Speed': speed,
    'Light': intensity
  };

  folder1.add( settings, 'Rain' ).onChange( showModel );
  folder1.addColor(settings, 'Color').onChange (updateColor)
  folder1.add(settings,"Wind Speed", -5, 5).onChange(updateSpeed)
  folder1.add(settings,"Light", 0, 2).onChange(updateLight)
  folder1.open();

  folder2.add(obj,"sunset")
  folder2.add(obj2, "noon")
  folder2.add(obj3, "night")
  folder2.open();

  function updateLight(intensity) {
    hemiLight.intensity = intensity
  }

  function updateSpeed(speed) {
    console.log(speed)
    speed2 = speed
  }

  function showModel( visibility ) {

    object2.visible = visibility;

    planes.forEach(function(c,i){
      var plane = planes[ i ];
      plane.visible = visibility
    })

  }

  function updateColor(backcolor) {
    scene.background = new THREE.Color( backcolor );
    hemiLight.color = new THREE.Color(backcolor)
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
  ssaoPass.setSize( window.innerWidth, window.innerHeight );
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
    plane.position.x += speed2;
    if ( plane.position.y < 0 ){
      plane.position.y += 35;
  }
    if (plane.position.x < -50){
      plane.position.x += 100
    } else if (plane.position.x > 50){
      plane.position.x -= 100
    }
  })

//  clouds.forEach(function(c,i){
//    object2.position.x += speed2 / 3
//    if (object2.position.x < -50){
//      object2.position.x += 100
//    } else if (object2.position.x > 50){
//      object2.position.x -= 100
//    }
//  })

  renderer.render( scene, camera );
}
init();
animate();
