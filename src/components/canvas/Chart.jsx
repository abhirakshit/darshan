import {useGLTF} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useRef} from "react";

function AstrologyChart() {
  const groupRef = useRef();

  // Rotate the group of boxes to animate
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.001;
    }
  });

  const houses = [];
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12;
    const x = Math.sin(angle) * 5;
    const y = Math.cos(angle) * 5;
    houses.push(
      <boxGeometry
        key={i}
        args={[1, 1, 0.1]} // Box dimensions
        position={[x, y, 0]}
        rotation={[0, 0, angle]}
      >
        <meshBasicMaterial attach="material" color={'hsl(' + (i * 30) % 360 + ', 100%, 50%)'}/>
      </boxGeometry>
    );
  }

  return <mesh>
    <boxGeometry/>
    <meshStandardMaterial/>
  </mesh>
}

export function Chart(props) {
  const {scene} = useGLTF('/duck.glb')

  // useFrame((state, delta) => (scene.rotation.y += delta))


  // return <primitive object={scene} {...props} />
  return AstrologyChart()
  // return <mesh>
  //   <boxGeometry/>
  //   <meshStandardMaterial/>
  // </mesh>
}
