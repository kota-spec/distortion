import * as THREE from 'three';
import { TweenMax } from 'gsap';

import vertexShader from './gl/vertexShader.vert';
import fragmentShader from './gl/fragmentShader.frag';

/**
 ** 初期化開始
 */

// レンダラーの初期化
let renderer = new THREE.WebGLRenderer();

const id = document.getElementById('app').getAttribute('data-id');
const $$texts = document.querySelectorAll('.js-text');

// デモに使用する画像URL
const assetUrls = [
  './image/image.jpg',
  './image/lady.jpg',
  './image/ball.jpg',
  './image/canyon.jpg',
  `./image/disp1.jpg`,
  `./image/disp2.jpg`,
  `./image/disp3.jpg`
];

let canvas = renderer.domElement;
document.body.appendChild(canvas);

const width = window.innerWidth;
const height = window.innerHeight;

renderer.setSize(width, height);

let scene = new THREE.Scene();

let timer = 0;

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

let mat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: timer },
    uTrans: { value: obj.trans },
    uTexture0: { value: textureArr[0] },
    uTexture1: { value: textureArr[1] },
    uResolution: { value: new THREE.Vector2(width, height) },
    uImageResolution: { value: new THREE.Vector2(1600, 1027) },
    uDisp: { value: textureArr[4] }
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
  timer = timer + 0.01;

  mat.uniforms.uTrans.value = obj.trans;
  mat.uniforms.uTime.value = timer;
  mat.uniforms.uResolution.value = new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  );
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
}

function resize () {
  let size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  if (size > 450) size = 450;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', function () {
  resize();
});

$$texts.forEach((r, i) => {
  r.addEventListener('mouseenter', function () {
    if (i === 0) {
      mat.uniforms.uTexture1.value = textureArr[1];
      mat.uniforms.uDisp.value = textureArr[4];
    }

    if (i === 1) {
      mat.uniforms.uTexture1.value = textureArr[2];
      mat.uniforms.uDisp.value = textureArr[5];
    }

    if (i === 2) {
      mat.uniforms.uTexture1.value = textureArr[3];
      mat.uniforms.uDisp.value = textureArr[6];
    }
    TweenMax.killTweensOf(obj);
    TweenMax.to(obj, 0.8, { trans: 1 });
  });

  r.addEventListener('mouseleave', function () {
    TweenMax.killTweensOf(obj);
    TweenMax.to(obj, 0.5, { trans: 0 });
  });
});
