import * as THREE from 'three';
import { TweenMax } from 'gsap';

import vertexShader from './gl/vertexShader.vert';
import fragmentShader from './gl/fragmentShader.frag';

// デモに使用する画像URL
const assetUrls = [
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/water.jpg',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/water2.jpg',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/disp.jpg'
];

/**
 ** 初期化開始
 */

// レンダラーの初期化
let renderer = new THREE.WebGLRenderer();
let canvas = renderer.domElement;
document.body.appendChild(canvas);

let scene = new THREE.Scene();

let obj = { trans: 0 };
var cnt = 0;

let textureArr = [];

// カメラの初期化
let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
camera.position.z = 1;

// テクスチャの初期化
assetUrls.forEach((url, index) => {
  let img = new Image();

  let texture = new THREE.Texture();
  texture.flipY = false;
  textureArr.push(texture);

  img.onload = function (_index, _img) {
    let texture = textureArr[_index];
    texture.image = _img;
    texture.needsUpdate = true;

    cnt++;
    if (cnt == 3) start();
  }.bind(this, index, img);

  img.crossOrigin = 'Anonymous';
  img.src = url;
});

let mat = new THREE.RawShaderMaterial({
  uniforms: {
    uTrans: { value: obj.trans },
    uTexture0: { value: textureArr[0] },
    uTexture1: { value: textureArr[1] },
    uDisp: { value: textureArr[2] }
  },
  vertexShader,
  fragmentShader
});

let geo = new THREE.PlaneGeometry(2, 2);
let mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

resize();

function start () {
  loop();
}

function loop () {
  mat.uniforms.uTrans.value = obj.trans;
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
}

function resize () {
  let size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  if (size > 450) size = 450;
  renderer.setSize(size, size);
}

window.addEventListener('resize', function () {
  resize();
});

canvas.addEventListener('mouseenter', function () {
  TweenMax.killTweensOf(obj);
  TweenMax.to(obj, 1.5, { trans: 1 });
});

canvas.addEventListener('mouseleave', function () {
  TweenMax.killTweensOf(obj);
  TweenMax.to(obj, 1.5, { trans: 0 });
});
