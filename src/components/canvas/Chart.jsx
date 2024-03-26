'use client'

import {Plane, Text, useGLTF} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useRef} from "react";
import * as THREE from "three"
import {find} from "lodash"


const defaultHouseColor = `#eed677`
const HOUSE_NAMES_NUM_MAPPING = [
  {num: 1, name: "Ar", imageName: ''},
  {num: 2, name: "Ta", imageName: ''},
  {num: 3, name: "Ge", imageName: ''},
  {num: 4, name: "Ca", imageName: ''},
  {num: 5, name: "Le", imageName: ''},
  {num: 6, name: "Vi", imageName: ''},
  {num: 7, name: "Li", imageName: ''},
  {num: 8, name: "Sc", imageName: ''},
  {num: 9, name: "Sa", imageName: ''},
  {num: 10, name: "Cp", imageName: ''},
  {num: 11, name: "Aq", imageName: ''},
  {num: 12, name: "Pi", imageName: ''},
]
const sampleD1 = [
  {"name": "Asc", "nameShort": "As", "placement": "Scorpio", "placementShort": "Sc", "degree": 22, "minute": 25, "second": 33},
  {"name": "Sun", "nameShort": "Su", "placement": "Aquarius", "placementShort": "Aq", "degree": 8, "minute": 28, "second": 31},
  {"name": "Moon", "nameShort": "Mo", "placement": "Libra", "placementShort": "Li", "degree": 14, "minute": 32, "second": 32},
  {"name": "Mars", "nameShort": "Ma", "placement": "Aquarius", "placementShort": "Aq", "degree": 6, "minute": 36, "second": 17},
  {"name": "Mercury", "nameShort": "Me", "placement": "Taurus", "placementShort": "Ta", "degree": 8, "minute": 36, "second": 4},
  {"name": "Jupiter", "nameShort": "Ju", "placement": "Virgo", "placementShort": "Vi", "degree": 4, "minute": 29, "second": 45},
  {"name": "Venus", "nameShort": "Ve", "placement": "Cancer", "placementShort": "Ca", "degree": 7, "minute": 5, "second": 56},
  {"name": "Saturn", "nameShort": "Sa", "placement": "Libra", "placementShort": "Li", "degree": 19, "minute": 53, "second": 49},
  {"name": "Rahu", "nameShort": "Ra", "placement": "Cancer", "placementShort": "Ca", "degree": 7, "minute": 48, "second": 12},
  {"name": "Ketu", "nameShort": "Ke", "placement": "Taurus", "placementShort": "Ta", "degree": 0, "minute": 0, "second": 47}
]

const getHouseName = (num) => {
  return find(HOUSE_NAMES_NUM_MAPPING, {num}).name
}

const getHouseNum = (name) => {
  return find(HOUSE_NAMES_NUM_MAPPING, {name}).num
}

const getHouseNumber = (num) => {
  // console.log(num, totalHouses)
  if (num <= 12)
    return num
  return (num + totalHouses) % 12
}

const HouseNameAndNumber = ({radius, ascendantNumber = 1}) => {
  const numbers = Array.from({length: 12}, (_, i) => i + 1);

  return (
    <>
      {
        numbers.map((number, index) => {
          // Calculate the offset based on the top number
          // We subtract the offset because a higher top number means we rotate clockwise
          const offset = (ascendantNumber - 1) * (Math.PI / 6);
          // Adjust the angle for each number based on the top number
          const angle = Math.PI / 2 + index * (Math.PI / 6) - offset;
          const position = [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];

          const string = getHouseName(number) + `(${number})`
          return (
            <Text
              key={number}
              position={position}
              fontSize={0.1}
              color="#000"
              anchorX="center"
              anchorY="middle"
              wireframe={true}
            >
              {string}
            </Text>
          );
        })}
    </>
  );
};

function House(props) {
  const {houseIndex, totalHouses, iconTexture, radius, innerRadius, ascendantNumber} = props;

  // Gap calculation
  const gapAngle = 0.02; // the angular size of the gap (in radians)
  const angleStep = (Math.PI * 2 - totalHouses * gapAngle) / totalHouses;
  const startAngle = houseIndex * (angleStep + gapAngle);
  const endAngle = startAngle + angleStep;

  // Calculate vertices for the triangle
  const vertices = [];
  vertices.push(innerRadius * Math.cos(startAngle), innerRadius * Math.sin(startAngle), 0); // Adjusted inner vertex
  vertices.push(radius * Math.cos(startAngle), radius * Math.sin(startAngle), 0); // Start point on the circumference
  vertices.push(radius * Math.cos(endAngle), radius * Math.sin(endAngle), 0); // End point on the circumference
  vertices.push(innerRadius * Math.cos(endAngle), innerRadius * Math.sin(endAngle), 0); // Adjusted inner vertex

  // Create the geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex([0, 1, 2, 2, 3, 0]); // Define the faces of the quad
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const houseRef = useRef();
  const houseSelected = (index) => {
    console.log("Clicked: ", index)
    if (houseRef.current) {
      houseRef.current.material.color.setHex(0xff0000)
    }
  }

  const houseDeselect = (index) => {
    // console.log('deselct', index)
    if (houseRef.current) {
      houseRef.current.material.color.setHex(0xeed677)
    }
  }

  return (
    <mesh ref={houseRef} geometry={geometry}
          onClick={(e) => houseSelected(getHouseNumber(houseIndex + ascendantNumber))}
          onPointerMissed={(e) => houseDeselect(getHouseNumber(houseIndex + ascendantNumber))}
      // onPointerOver={(e) => {
      //   console.log('over', getHouseNumber(houseIndex))
      // }}
      // onPointerOut={(e) => console.log('out', getHouseNumber(houseIndex))}
    >
      <meshBasicMaterial color={defaultHouseColor} side={THREE.DoubleSide}/>
    </mesh>
  );
}

const PlanetPlacement = ({radius, ascendantNumber, chartInfo}) => {


  return (
    <>
    </>
  )
}

const getAscendantHouseInChart = (chartInfo) => {
  const placementAsc = find(chartInfo, {name: 'Asc'}).placementShort
  return getHouseNum(placementAsc)
}

const totalHouses = 12;
const targetAngle = 75 * (Math.PI / 180); //Rotate by 15 degrees
const radius = 1.5; // radius of the pizza
const innerRadius = 0.2; // small radius to create a gap at the center
const numbersRadius = radius + .1; // Radius for the numbers, slightly outside the houses

function ChartBase() {
  const ref = useRef();
  const ascendantNumber = getAscendantHouseInChart(sampleD1)
  // console.log("Asc", ascendantNumber)
  return (
    <group>
      <group ref={ref} rotation={[0, 0, targetAngle]}>
        {[...Array(totalHouses).keys()].map((index) => (
          <House key={index} houseIndex={index} totalHouses={totalHouses} radius={radius} innerRadius={innerRadius}
                 ascendantNumber={ascendantNumber}/>
        ))}
      </group>
      <HouseNameAndNumber radius={numbersRadius} ascendantNumber={ascendantNumber}/>
      <PlanetPlacement radius={numbersRadius} ascendantNumber={ascendantNumber} chartInfo={sampleD1}/>
    </group>

  );
}

export function Chart(props) {
  const {scene} = useGLTF('/duck.glb')

  // useFrame((state, delta) => (scene.rotation.y += delta))


  // return <primitive object={scene} {...props} />
  return ChartBase()
}
