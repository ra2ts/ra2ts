import React, { useEffect, useState } from 'react';
import { DataReader, Idx } from '@/Resources';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { ResourceContainer } from '@/Resources/Mix/ResourceContainer';
import Wav from './Wav';

export interface IdxProps {
  data: Uint8Array;
  filename: string | null;
  mix: ResourceContainer;
}

export default function CsfViewer({ data, filename, mix }: IdxProps): JSX.Element {
  const [file, setFile] = useState<Idx | null>(null);
  useEffect(() => {
    const f = Idx.fromArray(data);
    const filenameParts = filename?.split('.') ?? [];
    setFile(f);
    if (filenameParts.length > 0) {
      const bag = mix.fileFromName(filenameParts[0] + '.bag');
      if (bag !== null) {
        const reader = new DataReader(bag.data);
        for (const entry of f.entries) {
          entry.data = reader.readRaw(entry.offset, entry.length);
        }
      }
    }
  }, [data]);

  if (file === null) {
    return <></>;
  }

  return <Table>
    <Thead>
      <Tr>
        <Th>Name</Th>
        <Th>Offset</Th>
        <Th>Length</Th>
      </Tr>
    </Thead>
    <Tbody>
      {file.entries.map(({ name, offset, length, data: entryData }) => (
        <Tr key={name}>
          <Th>{name}</Th>
          <Td>{offset}</Td>
          <Td>{length}</Td>
          <Td><Wav data={entryData} /></Td>
        </Tr>
      )) }
    </Tbody>
  </Table>;
}