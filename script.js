import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { GodRaysFakeSunShader, GodRaysDepthMaskShader, GodRaysCombineShader, GodRaysGenerateShader } from 'three/addons/shaders/GodRaysShader.js';
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);
// import { GodRaysFakeSunShader, GodRaysDepthMaskShader, GodRaysCombineShader, GodRaysGenerateShader } from 'three/addons/shaders/GodRaysShader.js';
// import { Timeline } from 'gsap/gsap-core';
import { EffectComposer, EffectPass, GodRaysEffect, RenderPass } from 'postprocessing';
// import { EffectComposer, EffectPass, GodRaysEffect, RenderPass } from '/node_modules/postprocessing/build/postprocessing.min.js';



const canvas = document.querySelector('.webgl');
let mouseX= 0;
let mouseY=0;

let targetX=0;
let targetY=0;
const windowX= window.innerWidth/ 2;
const windowY= window.innerHeight/2;

function onDocumentMouseMove(event){
  mouseX= (event.clientX - windowX);
  mouseY = (event.clientY-windowY);
}
const gui = new dat.GUI();
const sizes = {
    width:window.innerWidth,
    height:window.innerHeight,
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, sizes.width / sizes.height, 0.1, 1000 );
// camera.position.set(0,-.43,2);
camera.position.set(1,0.19,2);
// camera.rotation.set(0.06,0.06,1);
// camera.rotation.y=0.06;
// camera.rotation.x=0;
// camera.rotation.setY=.11;
// camera.rotation.z=0;

const tLoader = new THREE.TextureLoader();
let spotMap= tLoader.load('./textures/fbm_tex.jpg');
let cloudParticles=[];

tLoader.load('./textures/Smoke-Transparent.png',function(texture){
let cloudGeo = new THREE.PlaneGeometry(2,2);
let cloudMaterial =new THREE.MeshLambertMaterial({
    map:texture,
    transparent:true,
    opacity:.3,
    alphaTest:0.1,
    
    // opacity:0,
    color:0xffffff,
})
for(let i=0; i<5; i++){
    let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
    cloud.position.set(
        -Math.random()/2.2,
        -1,
        -Math.random()/.2
    );
    console.log(cloud.position.z);
    cloud.rotation.x =.16;
    
    cloud.rotation.z=Math.random()*200;
    cloudParticles.push(cloud);
    // scene.add(cloud);

}
});
let spec =tLoader.load('./textures/spec trans.png');
const particlesGeometry = new THREE.BufferGeometry;
const particleCount = 3000;
const particlesMaterial = new THREE.PointsMaterial({
    size:0.015,
    // color:'gold',
    color:0xFFE569,
    transparent:true,
    alphaTest:.1,
    opacity:0.2,
    // map:spec,
});

const posArray =new Float32Array(particleCount*2);

for(let i=0; i<particleCount*2;i++){
    // posArray[i] = Math.random()*5;
    // posArray[i+1]= Math.random();
    posArray[i]=(Math.random()-0.5)*15;
    // posArray[i+1]=-(Math.random()-0.5)*15;
    // posArray[i+2]=-(Math.random()-0.5)*15;

}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray,3));

const particlesMesh = new THREE.Points(particlesGeometry,particlesMaterial);
scene.add(particlesMesh);

  



const renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.background=new THREE.Color(0x121212);
scene.fog= new THREE.FogExp2(0xffffff,0.001);
// scene.fog= new THREE.Fog(0xffffff,0.001,20);
scene.add(camera);
// const controls = new OrbitControls(camera, canvas);
// controls.update();
   
    const light = new THREE.DirectionalLight(0x704214,0);
    const aLight = new THREE.AmbientLight(0xffffff,0.01);
    const spotLight = new THREE.SpotLight( 0x704214 ,20);
    spotLight.penumbra=0.9;
    // spotLight.map=spotMap;
    spotLight.distance=4;
    spotLight.angle=0.5;
    spotLight.decay=0;
    spotLight.position.set(1.5,1.5,.1);
    // spotLight.position.z=-1;

    const spotLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( spotLightHelper,aLight );
    
    gui.add(spotLight.position,'x',-1,9).name('slight p x');
    gui.add(spotLight.position,'y',-4,9).name('slight p y');
    gui.add(spotLight.position,'z',-2,4).name('slight p z');
    gui.add(spotLight,'distance',-2,4).name('slight d ');
    // gui.add(spotLight.rotation,'y',-5,5).name('slight r y');
    // gui.add(spotLight.rotation,'x',-5,5).name('slight r x');
    gui.add(camera.position,'x',-1,4).name('camera p x');
    gui.add(camera.position,'y',-3,4).name('camera p y');
    gui.add(camera.position,'z',-2,3).name('camera p z');
    gui.add(camera.rotation,'x',-1,1).name('camera r x');
    gui.add(camera.rotation,'y',-1,1).name('camera r y');
    gui.add(camera.rotation,'z',-1,1).name('camera r z');
light.castShadow=true;
spotLight.castShadow = true;
const geometry = new THREE.BoxGeometry(10.5,0.1,5.5);
const material = new THREE.MeshLambertMaterial({color:0x3c3c3c,transparent:true,opacity:1,map:spotMap});

const mesh = new THREE.Mesh(geometry,material);
mesh.receiveShadow=true;
mesh.position.set(-.1,-1.25,-.44);
    scene.add(light,spotLight,light);
    gui.add(light.position,'x',-5,5).name('Dlight p x');
    gui.add(light.position,'y',-5,5).name('Dlight p y');
    gui.add(light.position,'z',-5,5).name('Dlight p z');
const gLoader = new GLTFLoader();
let hor;
gLoader.load('./3d/horse.glb',function(gltf){
    hor = gltf.scene;
    scene.add(hor);
    
    hor.scale.set(.03,.03,.03);
    
    // hor.position.set(-.1,-.6,-.5);
    // hor.position.set(0.04,-0.69,-0.24);
    hor.position.set(-0.396,-0.56,0.04);
    
  
    hor.children[0].children[0].children[0].material=new THREE.MeshPhysicalMaterial({color:0xe0E9D6,map:spotMap,roughness:0.5,metalness:.5,reflectivity:2});
    hor.children[0].children[0].children[0].castShadow=true;
    hor.children[0].children[0].children[0].receiveShadow=true;
    console.log(hor.children[0]);
    
    gui.add(hor.position,'x',-3,2).name('horse p x');
    gui.add(hor.position,'y',-1,1).name('horse p y');
    gui.add(hor.position,'z',-1,1).name('horse p z');
    
    hor.rotation.y=1.5;

    // let tl = new gsap.timeline({
    //     repeat:-1,
    //     yoyo:true,
    // })
    // tl
    // .to(hor.rotation,{
    //     y:'1.55',
    //     x:'.01',
    //     duration:5,
    //     ease:'none'
    // })
    // .to(hor.rotation,{
    //     y:'1.45',
    //     x:'-.01',
    //     duration:5,
    //     ease:'none'
    // })

    
    
   
})


//godrays 

const circGeo = new THREE.CircleGeometry(1.5,50);
// const sphGeo = new THREE.SphereGeometry( 15, 32, 16 ); 
const circMat =new THREE.MeshBasicMaterial({color:0xffccaa,side:THREE.DoubleSide});
const circle = new THREE.Mesh(circGeo,circMat);
circle.position.set(0,0.48,-2.2);
circle.position.set(-1.4,0.75,-.7);
circle.scale.x=1;
scene.add(circle);
let godraysEffect = new GodRaysEffect(camera,circle,{
    resolutionScale:.3,
    decay:.75,
    density:1.5,
    weight:.5,
    samples: 100
});
gui.add(circle.position,'x',-5,5).name('sun p x');
gui.add(circle.position,'y',-5,5).name('sun p y');
gui.add(circle.position,'z',-10,5).name('sun p z');
let renderPass = new RenderPass(scene,camera);
let effectPass = new EffectPass(camera,godraysEffect);
effectPass.renderToScreen=true;

let composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);
document.addEventListener('mousemove',onDocumentMouseMove)




window.addEventListener('resize',function(){
sizes.width=window.innerWidth;
sizes.height=window.innerHeight;
camera.aspect= (sizes.width/sizes.height);
    renderer.setSize(sizes.width,sizes.height);
    renderer.setPixelRatio(this.devicePixelRatio);
    
    camera.updateProjectionMatrix();
})

// console.log(spotLightHelper);
function animate() {
	requestAnimationFrame( animate );
	// renderer.render( scene, camera );
    composer.render(0.1);
    camera.updateProjectionMatrix();
    cloudParticles.forEach(p =>{
        p.rotation.x -=.0009;
        p.rotation.z -=.0005;
    })

// spotLight.distance.needsUpdate=true;
    // controls.update();
    // mesh.rotation.x+=0.01;
    // mesh.rotation.y-=0.01;
    // mesh.rotation.z+=0.01;
    const time = performance.now() / 3000;
    particlesMesh.rotation.x = (time)/-30;
    camera.rotation.y= -mouseX*0.0000055 ;
    camera.rotation.x= -mouseY*0.0000055 ;
    circle.rotation.z+=0.001;
    hor.rotation.y= 1.5+ ((mouseX*0.00002));
    
}
animate();