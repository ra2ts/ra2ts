import { LandType } from '@/Engine/Map';
import { Palette, Terrain as TerrainContainer } from '@/Resources';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import PaletteSelector from '../PaletteSelector';
import RenderImage, { ImageFormat } from '../RenderImage';
import Unknown from './Unknown';
import { TerrainTileMaterial } from '@/Graphics'; 

export interface TerrainProps {
  data: Uint8Array;
}

export default function Terrain({ data }: TerrainProps): JSX.Element {
  const [file, setFile] = useState<null|TerrainContainer>(null);
  const [material, setMaterial] = useState<null|TerrainTileMaterial>(null);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  const [visibleElements, setVisibileElements] = useState<boolean[]>([]);
  useEffect(() => {
    try {
      const terrain = TerrainContainer.fromArray(data);
      setFile(terrain);
      if (selectedPalette !== null) {
        const material = new TerrainTileMaterial(terrain, selectedPalette);
        setMaterial(material);
        setVisibileElements(new Array(material.frames.length).fill(true));
      }
    } catch (e) {
      console.error(e);
      setFile(null);
      setMaterial(null);
    }
  }, [data, selectedPalette]);

  const onVisibilityToggle = useCallback((index: number) => {
    visibleElements[index] = !visibleElements[index];
    setVisibileElements([...visibleElements]);
  }, [visibleElements])

  if (file === null) {
    return <Unknown data={data}/>;
  }

  return <div>
    <PaletteSelector onChange={setSelectedPalette}/>
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div>
        <p><b>Width:</b> {file.blockWidth} cells</p>
        <p><b>Height:</b> {file.blockHeight} cells</p>
        <p><b>Cell Width:</b> {file.blockImageWidth}px</p>
        <p><b>Cell Height:</b> {file.blockImageHeight}px</p>
      </div>
      <div style={{position: 'relative', height: file.rect.height, width: file.rect.width, marginLeft: Math.min(600, Math.abs(file.rect.x)) + 10, marginTop: Math.min(300, Math.abs(file.rect.y)) }}>
        {file.tiles.map((tile, index) => (
          <React.Fragment key={index}>
            {selectedPalette !== null && material  && visibleElements[index] && <RenderImage
              data={material.frames[index]}
              style={{ left: material.getBounds(index).left, top: material.getBounds(index).top, position: 'absolute' }}
              width={material.getBounds(index).width}
              height={material.getBounds(index).height}
              palette={selectedPalette}
              title={`X: ${tile.x}\nY: ${tile.y}\nLand Type: ${LandType[tile.landType]}\n${JSON.stringify(material.getBounds(index))}`}
              format={ImageFormat.Canvas}
            />}
          </React.Fragment>
        ))}
      </div>
    </div>
    <Table>
      <Thead>
        <Tr>
          <Th></Th>
          <Th>X</Th>
          <Th>Y</Th>
          <Th>Height</Th>
          <Th>Extra Width</Th>
          <Th>Extra Height</Th>
          <Th>Extra X</Th>
          <Th>Extra Y</Th>
          <Th>Has Z Data</Th>
          <Th>Has Damage Data</Th>
          <Th>Slope Type</Th>
          <Th>Land Type</Th>
        </Tr>
      </Thead>
      <Tbody>
        {file.tiles.map((tile, index) => (
        <Tr key={index}>
          <Td><input type="checkbox" value="true" checked={visibleElements[index]} onChange={() => onVisibilityToggle(index)} /></Td>
          <Td>{tile.x}</Td>
          <Td>{tile.y}</Td>
          <Td>{tile.height}</Td>
          <Td>{tile.hasExtraData ? tile.extraWidth : 'N/A'}</Td>
          <Td>{tile.hasExtraData ? tile.extraHeight : 'N/A'}</Td>
          <Td>{tile.hasExtraData ? tile.extraX : 'N/A'}</Td>
          <Td>{tile.hasExtraData ? tile.extraY : 'N/A'}</Td>
          <Td>{tile.hasZData ? 'Yes' : 'No'}</Td>
          <Td>{tile.hasDamagedData ? 'Yes' : 'No'}</Td>
          <Td>{tile.slopeType}</Td>
          <Td>{LandType[tile.landType]}</Td>
        </Tr>
        ))}
      </Tbody>
    </Table>
  </div>;
}