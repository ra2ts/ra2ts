import React, { useState, useEffect } from 'react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import { Palette } from '@/Resources/Palette';

export interface PalProps {
  data: Uint8Array;
}

export default function Pal({ data }: PalProps): JSX.Element {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  useEffect(() => {
    const colorHex = [];
    const palette = Palette.fromArray(data);
    for (const color of palette.colors) {
      let str = '#';
      str += color.r.toString(16).padStart(2, '0');
      str += color.g.toString(16).padStart(2, '0');
      str += color.b.toString(16).padStart(2, '0');
      colorHex.push(str);
    }
    setColors(colorHex);
    setPalette(palette);
  }, [data]);

  return <div style={{position: 'relative'}}>
    <SimpleGrid spacing={0} columns={8}>
      {colors.map((colour, i) => <Box h={15} key={i} bg={colour} />)}
    </SimpleGrid>
    <pre style={{maxWidth: '100%', whiteSpace: 'pre-wrap'}}>
      const palette = Palette.fromArray(new Uint8Array([{[...data].map((val) => '0x' + val.toString(16)).join(', ')}]));
    </pre>
  </div>
}