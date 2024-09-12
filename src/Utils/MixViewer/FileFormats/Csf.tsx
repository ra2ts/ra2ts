import React, { useEffect, useState } from 'react';
import { Csf } from '@/Resources';
import { Table, Tbody, Td, Th, Tr } from '@chakra-ui/react';

export interface CsfProps {
  data: Uint8Array;
}

export default function CsfViewer({ data }: CsfProps): JSX.Element {
  const [file, setFile] = useState<Csf | null>(null);
  useEffect(() => {
    const f = Csf.fromArray(data);
    setFile(f);
  }, [data]);

  if (file === null) {
    return <></>;
  }

  return <Table>
    <Tbody>
      {file.allStrings().map(({ label, value }) => (
        <Tr>
          <Th>{label}</Th>
          <Td>{value}</Td>
        </Tr>
      )) }
    </Tbody>
  </Table>;
}