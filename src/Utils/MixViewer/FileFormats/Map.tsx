import React, { useEffect, useState } from 'react';
import { Map } from '@/Resources';
import Ini from './Ini';
import { TheaterType } from '@/Engine';
import RenderImage, { ImageFormat } from '../RenderImage';

export interface CsfProps {
  data: Uint8Array;
}

export default function MapViewer({ data }: CsfProps): JSX.Element {
  const [file, setFile] = useState<Map | null>(null);
  useEffect(() => {
    try {
      const f = Map.fromArray(data);
      setFile(f);
    } catch (e) {
      console.error(e);
      setFile(null);
    }
  }, [data]);

  if (file === null) {
    return <Ini data={data} />;
  }

  return <div>
    <p>Theatre: {file.theatre}</p>
    <RenderImage data={[...file.preview]} width={file.previewWidth} height={file.previewHeight} format={ImageFormat.RGB} />
    <Ini data={data} />
  </div>;
}