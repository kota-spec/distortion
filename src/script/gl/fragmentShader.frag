precision mediump float;

uniform float uTrans;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uDisp;

varying vec2 vUv;

float quarticInOut(float t){
  return t<.5
  ?+8.*pow(t,4.)
  :-8.*pow(t-1.,4.)+1.;
}

void main(){
  // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/gl_FragCoord.xhtml
  
  vec4 disp=texture2D(uDisp,vec2(0.,.5)+(vUv-vec2(0.,.5))*(.2+.8*(1.-uTrans)));
  float trans=clamp(1.6*uTrans-disp.r*.4-vUv.x*.2,0.,1.);
  trans=quarticInOut(trans);
  vec4 color0=texture2D(uTexture0,vec2(.5-.3*trans,.5)+(vUv-vec2(.5))*(1.-.2*trans));
  vec4 color1=texture2D(uTexture1,vec2(.5+sin((1.-trans)*.1),.5)+(vUv-vec2(.5))*(.9+.1*trans));
  
  gl_FragColor=mix(color0,color1,trans);
}