import { Pcx as PcxContainer } from '@/Resources';
import React, { useEffect, useState } from 'react';
import RenderImage, { ImageFormat } from '../RenderImage';

export interface ShpProps {
  data: Uint8Array;
}

export default function Pcx({ data }: ShpProps): JSX.Element {
  const [file, setFile] = useState<null|PcxContainer>(null);
  useEffect(() => {
    const pcx = PcxContainer.fromArray(data);
    setFile(pcx);
  }, [data]);
  if (file === null) {
    return <></>;
  }

  return <div>
    <p><b>Width:</b> {file.width}px, <b>Height:</b> {file.height}px</p>
    <RenderImage data={file.data} width={file.width} height={file.height} format={ImageFormat.RGBA} />
  </div>;
}