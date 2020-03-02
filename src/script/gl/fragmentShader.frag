precision mediump float;

#define PI 3.14159265359

uniform float uTrans;
uniform float uTime;
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

mat2 scale(vec2 _scale){
  return mat2(_scale.x,0.,
  0.,_scale.y);
}

mat2 rotate2d(float _angle){
  return mat2(cos(_angle),-sin(_angle),
  sin(_angle),cos(_angle));
}

void main(){
  vec2 p=(gl_FragCoord.xy*2.-uResolution)/min(uResolution.x,uResolution.y);
  
  float l=uTrans/length(abs(sin(p)));
  
  vec2 ratio=vec2(
    min((uResolution.x/uResolution.y)/(uImageResolution.x/uImageResolution.y),1.),
    min((uResolution.y/uResolution.x)/(uImageResolution.y/uImageResolution.x),1.)
  );
  
  vec2 uv=vec2(
    (vUv.x)*ratio.x+(1.-ratio.x)*.5,
    (vUv.y)*ratio.y+(1.-ratio.y)*.5
  );
  
  float amount=uTrans*.02;
  
  vec4 disp=texture2D(uDisp,vec2(.5,.5)+(uv-vec2(.5,.5)));
  
  float trans=clamp(2.*uTrans-disp.r,0.,1.);
  trans=trans=quarticInOut(trans);
  
  vec2 dispUI=uv*vec2(disp.r,disp.g);
  
  vec4 _texture1=texture2D(uTexture0,vec2(.5,.5)+(uv-vec2(.5))*scale(vec2(.5+sin((1.-trans)*.5))));
  vec4 _texture2=texture2D(uTexture1,vec2(.5,.5)+(uv-vec2(.5))*scale(vec2(1.-sin((1.-trans)*.5))));
  
  gl_FragColor=mix(_texture1,_texture2,quarticInOut(uTrans));
}

