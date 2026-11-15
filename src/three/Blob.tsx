import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Iridescent, noise-displaced "planet" with an orbit ring.
 * Pointer position bends the surface; `scroll` (0–1) spins and squashes it.
 */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

const vertex = /* glsl */ `
uniform float uTime; uniform float uDistort; uniform vec2 uMouse;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
${NOISE}
float field(vec3 p){
  return snoise(p*1.4+vec3(uTime*0.25, uTime*0.18, 0.0))*0.6 + snoise(p*3.2-uTime*0.3)*0.18;
}
void main(){
  vec3 p = position;
  float pull = max(0.0, dot(normalize(p.xy+0.0001), uMouse)) * length(uMouse);
  float n = field(p);
  vNoise = n;
  vec3 displaced = p + normal * (n * uDistort + pull * 0.18);
  // Approximate the displaced normal with neighbouring samples.
  vec3 t = normalize(cross(normal, vec3(0.0,1.0,0.0)) + 0.0001);
  vec3 b = normalize(cross(normal, t));
  float e = 0.01;
  vec3 pt = p + t*e; vec3 pb = p + b*e;
  vec3 dt = pt + normalize(pt) * (field(pt) * uDistort);
  vec3 db = pb + normalize(pb) * (field(pb) * uDistort);
  vec3 nrm = normalize(cross(dt - displaced, db - displaced));
  if (dot(nrm, normal) < 0.0) nrm = -nrm;
  vNormal = normalize(normalMatrix * nrm);
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`

const fragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uTime;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
void main(){
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
  vec3 light = normalize(vec3(0.6, 0.8, 0.9));
  float diff = max(dot(vNormal, light), 0.0);
  float bands = 0.5 + 0.5 * sin(vNoise * 9.0 + uTime * 0.6 + fres * 6.0);
  vec3 base = mix(uA, uB, bands);
  vec3 col = base * (0.35 + diff * 0.75) + uC * fres * 1.25;
  float spec = pow(max(dot(reflect(-light, vNormal), vView), 0.0), 40.0);
  col += spec * 0.6;
  gl_FragColor = vec4(col, 1.0);
}`

interface BlobProps {
  scroll?: React.MutableRefObject<number>
  colors?: [string, string, string]
  detail?: number
}

function Planet({ scroll, colors = ['#1b1b1b', '#d4ff3a', '#9a8cff'], detail = 64 }: BlobProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Group>(null)
  const group = useRef<THREE.Group>(null)
  const mouse = useRef(new THREE.Vector2())
  const target = useRef(new THREE.Vector2())
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistort: { value: 0.28 },
      uMouse: { value: new THREE.Vector2() },
      uA: { value: new THREE.Color(colors[0]) },
      uB: { value: new THREE.Color(colors[1]) },
      uC: { value: new THREE.Color(colors[2]) },
    }),
    [colors],
  )

  useEffect(() => {
    const move = (e: PointerEvent) => target.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useFrame((state, dt) => {
    const s = scroll?.current ?? 0
    mouse.current.lerp(target.current, 1 - Math.pow(0.001, dt))
    uniforms.uTime.value += dt
    uniforms.uMouse.value.copy(mouse.current)
    uniforms.uDistort.value = 0.24 + s * 0.35 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03
    if (group.current) {
      group.current.rotation.y += dt * 0.12
      group.current.rotation.x = mouse.current.y * 0.25 + s * 0.8
      group.current.rotation.z = -mouse.current.x * 0.15
      const sc = 1 - s * 0.25
      group.current.scale.setScalar(sc)
      group.current.position.y = s * 0.6
    }
    if (ring.current) ring.current.rotation.z += dt * 0.35
  })

  return (
    <group ref={group}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, detail]} />
        <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
      </mesh>
      <group rotation={[1.25, 0.2, -0.35]}>
        <group ref={ring}>
          <mesh>
            <torusGeometry args={[1.75, 0.008, 8, 200]} />
            <meshBasicMaterial color={colors[1]} />
          </mesh>
          <mesh position={[1.75, 0, 0]}>
            <sphereGeometry args={[0.06, 24, 24]} />
            <meshBasicMaterial color={colors[2]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default function Blob({ scroll, colors, className = '' }: BlobProps & { className?: string }) {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <div className={className} aria-hidden>
      <Canvas resize={{ offsetSize: true }} dpr={[1, mobile ? 1.5 : 2]} camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <Planet scroll={scroll} colors={colors} detail={mobile ? 40 : 72} />
      </Canvas>
    </div>
  )
}
