import { Shp as ShpContainer } from '@/Resources/Shp';
import React, { useEffect, useState } from 'react';

export interface IniProps {
  data: Uint8Array;
}

export default function Ini({ data }: IniProps): JSX.Element {
  const [formattedString, setFormattedString] = useState('');
  useEffect(() => {
    const str = [...data].map((val) => String.fromCharCode(val)).join('');
    setFormattedString(str);
  }, [data]);

  return <pre>{formattedString}</pre>;
}