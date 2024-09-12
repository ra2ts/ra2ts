import React, { useState } from 'react';
import Navigation from './Navigation';
import Mix from './FileFormats/Mix';

export default function Viewer(): JSX.Element {
  const [fileData, setFileData] = useState<null | Uint8Array>(null);

  return <div>
    <div style={{borderBottom: '1px solid #bbb'}}><Navigation onFileOpened={(data) => setFileData(data)}/></div>
    {fileData !== null && <Mix data={fileData}/>}
  </div>;
}