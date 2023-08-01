
let targetRotationX = 0.05;
let targetRotationY = 0.02;
let mouseX = 0, mouseXOnMouseDown = 0, mouseY = 0, mouseYOnMouseDown = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
const slowingFactor = 0.98;
const dragFactor = 0.0002;
function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false );
    document.addEventListener('mouseup', onDocumentMouseUp, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseYOnMouseDown = event.clientY - windowHalfY;
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotationX = ( mouseX - mouseXOnMouseDown ) * dragFactor;
    mouseY = event.clientY - windowHalfY;
    targetRotationY = ( mouseY - mouseYOnMouseDown ) * dragFactor;
}

function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
}

function main()
{
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#globe')});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // create earthGeometry
    const earthGeometry = new THREE.SphereGeometry(0.5,32,32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        // color:"#fef08a",
        map: new THREE.TextureLoader().load('texture/blue.jpg'),
        // bumpMap: new THREE.TextureLoader().load('texture/yellow_map.png'),
        displacementScale: 0.1, // Adjust the intensity of the displacement (bumpiness)

    });
    const displacementMap = new THREE.TextureLoader().load(
        'texture/displace_yellow.png'
        )
        // earthMaterial.displacementMap = displacementMap
    const earthMesh = new THREE.Mesh(earthGeometry,earthMaterial);
    scene.add(earthMesh);

    // set ambientlight
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);
    // set point light
    const pointerlight =  new THREE.PointLight(0xffffff,0.9);
    // set light position
    pointerlight.position.set(5,3,5);
    scene.add(pointerlight);

    // create cloudGeometry
    const cloudGeometry = new THREE.SphereGeometry(0.48, 64, 64);
        const cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('texture/grad.jpg'),
        // color: "#84cc16",
        displacementMap: new THREE.TextureLoader().load('texture/test.png'),
        displacementScale: 0.1, // Adjust the displacement scale as needed
        transparent: true,
    
      });
    const cloudMesh = new THREE.Mesh(cloudGeometry,cloudMaterial);
    scene.add(cloudMesh);

    // create starGeometry
    const starGeometry =  new THREE.SphereGeometry(5,64,64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('texture/galaxy.png'),
        side: THREE.BackSide
    });

    
      // Position the continent mesh slightly above the Earth mesh
    
    const starMesh = new THREE.Mesh(starGeometry,starMaterial);
    scene.add(starMesh);


    // Add the camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.7;
    const render = () => {
        targetRotationX += 0.00005; // Adjust the rotation speed as needed
        targetRotationY += 0.00002;
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
        cloudMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
        cloudMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
        targetRotationY = targetRotationY * slowingFactor;
        targetRotationX = targetRotationX * slowingFactor;
        renderer.render(scene,camera);
    }
    const animate = () =>{
        requestAnimationFrame(animate);
        render();
    }
    animate();
    document.addEventListener('mousedown', onDocumentMouseDown, false );
}
window.onload = main;