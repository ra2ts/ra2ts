import React, { useState, useCallback, useEffect, createRef } from 'react';
import { Grid, GridItem, Menu, MenuItem, MenuList } from '@chakra-ui/react';
import { parseContainer } from '@/Resources/Mix/Parser';
import { ResourceContainer } from '@/Resources/Mix/ResourceContainer';
import { MixFile } from '@/Resources/Mix/MixFile';
import * as FileFormats from './index';
import UnknownFormat from './Unknown';
import { parseLocalMixDatabase } from './LocalMixDatabase';

export interface MixProps {
  data: Uint8Array;
}

type FileViewer = ({data, filename}: { data: Uint8Array, filename?: string | null, mix?: ResourceContainer }) => JSX.Element

type SupportedFileExtension = keyof typeof FileFormats;

export default function Mix({ data }: MixProps): JSX.Element {
  const [container, setContainer] = useState<null | ResourceContainer>(null);
  const [selectedFile, setSelectedFile] = useState<null | MixFile>(null);
  const [contextMenuOpened, setContextMenuOpened] = useState<boolean>(false);
  const contextMenu = createRef<HTMLDivElement>();

  useEffect(() => {
    try {
      const container = parseContainer(data);
      const fileNameDatabase = container.fileFromName("local mix database.dat");
      if (fileNameDatabase) {
        const fileNames = parseLocalMixDatabase(fileNameDatabase.data);
        for (const name of fileNames) {
          const f  = container.fileFromName(name);
          if (f !== null) {
            f.name = name;
          }
        }
      }
      container.files.sort((a, b) => {
        if (a === b) {
          return 0;
        }
        if (a.name === null || (b.name !== null && a.name < b.name)) {
          return -1;
        }
        if (b.name === null || (a.name !== null && a.name > b.name)) {
          return 1;
        }
        return 0;
      });
      setContainer(container);
    } catch (e) {
      console.error(e);
      setContainer(null);
    }
  }, [data]);

  const openContextMenu = useCallback((e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, file: MixFile) => {
    const url = window.URL.createObjectURL(new Blob([file.data]));
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = file.name ?? file.id.toString(16);
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }, []);

  const onFileChanged = useCallback((f: MixFile) => {
    setSelectedFile(f);
  }, []);

  const fileExtension = selectedFile?.name?.substring(selectedFile.name.indexOf('.') + 1).toLowerCase();
  const supportedFileExtensions = Object.keys(FileFormats) as SupportedFileExtension[];
  let Format: FileViewer = UnknownFormat;
  if (fileExtension !== undefined && supportedFileExtensions.includes(fileExtension as SupportedFileExtension) === true) {
    Format = FileFormats[fileExtension as SupportedFileExtension];
  }

  return <Grid
    h='calc(100% - 40px)'
    templateAreas={`"nav main"`}
    gridTemplateColumns='350px 1fr'
  >
    <GridItem area="nav" borderRight="1px solid #bbb" py={3} maxHeight="100vh" overflow="scroll">
      {container !== null && 
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Id</th>
                <th>Offset</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
            {container.files.map((f, i) => (
              <tr
                key={i}
                style={{cursor: 'pointer', background: selectedFile === f ? '#d6d6d6' : ''}}
                onClick={() => onFileChanged(f)}
                onContextMenu={(e) => openContextMenu(e, f)}
              >
                <td>{f.name ?? '<unknown>'}</td>
                <td>{f.id.toString(16).toUpperCase().padStart(8, '0')}</td>
                <td>{f.offset}</td>
                <td>{f.size}</td>
              </tr>
            ))}
            </tbody>
          </table>
          <div>
            <table>
              <tbody>
                <tr>
                  <td>Is Encrypted?</td>
                  <td>{container.isEncrypted() ? 'Yes' : 'No'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Menu isOpen={contextMenuOpened} onClose={() => setContextMenuOpened(false)}>
            <MenuList ref={contextMenu}>
              <MenuItem>Extract</MenuItem>
            </MenuList>
          </Menu>
        </>
      }
    </GridItem>
    <GridItem area="main" bg='#e8e8e8'>
      {Format !== null && selectedFile !== null  && container !== null && <Format mix={container} filename={selectedFile.name} data={selectedFile.data} />}
    </GridItem>
  </Grid>
}