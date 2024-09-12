import React, { useEffect, useState } from 'react';

export interface UnknownProps {
  data: Uint8Array;
}

const ROW_LENGTH = 16;
const MAX_DISPLAY_SIZE = 10240;

export default function Unknown({ data }: UnknownProps): JSX.Element {
  const [parsedArray, setParsedArray] = useState<number[][]>([]);
  useEffect(() => {
    const result = [];
    let i = 0;
    while (i < Math.min(data.length, MAX_DISPLAY_SIZE)) {
      const numBytes =  Math.min(data.length - i, ROW_LENGTH);
      result.push([...data.slice(i, i + numBytes)]);
      i += numBytes;
    }
    setParsedArray(result);
  }, [data]);

  return <div style={{display: 'flex'}}>
    <table>
      <tbody>
        {parsedArray.map((row, i) => (
          <tr key={i}>
            {row.map((n, j) => <td key={j}>{n.toString(16).toUpperCase().padStart(2, '0')}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
    <table style={{marginLeft: 10}}>
      <tbody>
        {parsedArray.map((row, i) => (
          <tr key={i}>
            {row.map((n, j) => <td key={j}>{ n > 31 && n < 127 ? String.fromCharCode(n) : '.'}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
    {data.length > MAX_DISPLAY_SIZE && <p>Only displaying the first {MAX_DISPLAY_SIZE} bytes</p>}
    </div>;
}