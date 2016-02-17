var camera, renderers = [], scenes = [], cameras = [];

window.onload = init;

function init() {

    // Add listeners
    window.addEventListener( 'resize', onWindowResize, false );

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

    createViewers();
    loadUrlParams();
    populateShapeSelectList();
    animate();

}

// render
function render() {
    for( var i = 0; i < 4; i++ ){
        renderers[i].render( scenes[i], cameras[i] );
    }
}

function createViewers(){

    var scene, renderer, controls;

    var containers = document.getElementById('container').children;

    for( var i = 0; i < 4; i++ ){

        var width = window.innerWidth / 2;
        var height = window.innerHeight / 2;

        // renderer
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( width, height );
        containers[i].appendChild(renderer.domElement);

        scene = new THREE.Scene();

        // ambient light
        var ambient = new THREE.AmbientLight(0x404040);
        scene.add(ambient);

        // directional light
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(-1, 0.5, 1);
        scene.add(directionalLight);

        // controls
        controls = new THREE.OrbitControls(camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, PAN: THREE.MOUSE.MIDDLE };

        renderers.push( renderer );
        scenes.push( scene );
        cameras.push( camera.clone() );

    }

}

// animate
function animate() {
    requestAnimationFrame(animate);
    setCameras();
    render();
}

/**
 * On window resize callback
 */
function onWindowResize() {
    for( var i = 0; i < 4; i++ ) {
        cameras[i].aspect = window.innerWidth / window.innerHeight;
        cameras[i].updateProjectionMatrix();
        renderers[i].setSize(window.innerWidth / 2, window.innerHeight / 2);
    }
}

/**
 * On window resize callback
 */
function setCameras() {
    for( var i = 0; i < 4; i++ ) {
        cameras[i].position.copy( camera.position );
        cameras[i].rotation.copy( camera.rotation );
        cameras[i].updateProjectionMatrix();
        renderers[i].setSize(window.innerWidth / 2, window.innerHeight / 2);
    }
}

/**
 * On load callback
 */
function onLoad( shape ) {

    var i, geometry, material, mesh, wireFrame, box, algorithm;

    for( i = 0; i < 4; i++ ){

        algorithm = algorithms[i];

        setShapeUtils(i);

        try {

            geometry = shape.makeGeometry();

        } catch( error ){

            console.timeEnd( algorithm );

            console.warn( algorithm + " failed: " + error.message );

        }

        material = new THREE.MeshBasicMaterial({color: 0xff0000});

        mesh = new THREE.Mesh(geometry, material);

        wireFrame = new THREE.WireframeHelper(mesh, 0xffffff);

        geometry.computeBoundingBox();

        box = geometry.boundingBox;

        mesh.position.copy(box.center().negate());

        camera.position.setZ(Math.abs(Math.max(box.max.x - box.min.x, box.max.y - box.min.y)) * 1.5);

        scenes[i].add(wireFrame);

        scenes[i].add(mesh);

    }

}