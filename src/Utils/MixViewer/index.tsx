import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Viewer from '@/Utils/MixViewer/Viewer';
import ReactDOM from 'react-dom/client';

window.React = React;

function App() {
  return (
    <ChakraProvider>
      <Viewer />
    </ChakraProvider>
  )
}

const container = document.getElementById('viewer');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App/>);
}