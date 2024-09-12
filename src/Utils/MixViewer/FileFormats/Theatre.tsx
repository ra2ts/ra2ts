import React from 'react';
import Shp from './Shp';
import Terrain from './Terrain';

export interface TheatreProps {
  data: Uint8Array;
}

export default function Theatre({ data }: TheatreProps): JSX.Element {
  if (data[0] === 0 && data[1] === 0) {
    return <Shp data={data} />;
  }
  return <Terrain data={data} />;
}