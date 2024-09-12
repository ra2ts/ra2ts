import { Palette } from '@/Resources';
import { Shp as ShpContainer } from '@/Resources/Shp';
import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PaletteSelector from '../PaletteSelector';
import RenderImage from '../RenderImage';

export interface ShpProps {
  data: Uint8Array;
}

export default function Shp({ data }: ShpProps): JSX.Element {
  const [file, setFile] = useState<null|ShpContainer>(null);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  useEffect(() => {
    setFile(ShpContainer.fromArray(data));
  }, [data]);
  if (file === null) {
    return <></>;
  }

  return <div>
    <PaletteSelector onChange={setSelectedPalette}/>
    <p><b>Width:</b> {file.fullWidth}</p>
    <p><b>Height:</b> {file.fullHeight}</p>
    <p><b>Frames:</b> {file.frames.length}</p>
    <table>
      <thead>
        <tr>
          <th>index</th>
          <th>xPos</th>
          <th>yPos</th>
          <th>width</th>
          <th>height</th>
          <th>offset</th>
          <th>length</th>
          <th>Compressed</th>
        </tr>
      </thead>
      <tbody>
        {file.frames.map((frame, i) => <tr key={i}>
          <td>{i}</td>
          <td>{frame.xPos}</td>
          <td>{frame.yPos}</td>
          <td>{frame.width}</td>
          <td>{frame.height}</td>
          <td>{frame.offset.toString(16)}</td>
          <td>{frame.data.length}</td>
          <td>{frame.isCompressed ? 'Compressed' : 'Not Compressed'}</td>
          <td>{selectedPalette !== null && <RenderImage data={frame.data} width={frame.width} height={frame.height} palette={selectedPalette}/>}</td>
        </tr>)}
      </tbody>
    </table>
    
  </div>;
}