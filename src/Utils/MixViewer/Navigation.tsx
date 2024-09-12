import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { ChangeEvent, createRef, useCallback } from 'react';

export interface NavigationProps {
  onFileOpened: (data: Uint8Array) => void;
}

export default function Navigation({ onFileOpened }: NavigationProps): JSX.Element {
  const ref = createRef<HTMLInputElement>();
  const onFileChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return false;
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        onFileOpened(new Uint8Array(reader.result));
      }
    }
  }, []);

  return <Menu>
    <MenuButton>File</MenuButton>
    <MenuList>
      <MenuItem onClick={() => ref.current?.click()}>Open File...</MenuItem>
    </MenuList>
    <input ref={ref} type="file" accept=".mix" style={{display: 'none'}} onChange={onFileChanged} />
  </Menu>;
}