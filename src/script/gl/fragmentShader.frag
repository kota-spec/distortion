precision mediump float;

#define PI 3.14159265359

uniform float uTrans;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uDisp;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

varying vec2 vUv;

float quarticInOut(float t){
  return t<.5
  ?+8.*pow(t,4.)
  :-8.*pow(t-1.,4.)+1.;
}

void main(){
  vec2 ratio=vec2(
    min((uResolution.x/uResolution.y)/(uImageResolution.x/uImageResolution.y),1.),
    min((uResolution.y/uResolution.x)/(uImageResolution.y/uImageResolution.x),1.)
  );
  
  vec2 uv=vec2(
    (vUv.x)*ratio.x+(1.-ratio.x)*.5,
    (vUv.y)*ratio.y+(1.-ratio.y)*.5
  );
  
  float amount=uTrans*.02;
  
  vec4 disp=texture2D(uDisp,vec2(.1,.5)+(vUv-vec2(.1,.5))*(.2+.8*(1.-uTrans)));
  
  float trans=clamp(2.*uTrans-disp.r*.4-vUv.x*.2,0.,1.);
  trans=trans=quarticInOut(trans);
  
  vec4 _texture1=texture2D(uTexture0,vec2(.5-.3*trans,.5)+(uv-vec2(.5))*(1.-.2*trans));
  vec4 _texture2=texture2D(uTexture1,vec2(.5+sin((1.-trans)*.1),.5)+(uv-vec2(.5)));
  gl_FragColor=mix(_texture1,_texture2,trans);
}