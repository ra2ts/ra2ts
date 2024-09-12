import React, { useCallback, useEffect, useState } from 'react';
import { Vxl, Palette } from '@/Resources';
import Unknown from './Unknown';
import { VoxelRenderer } from '@/Graphics';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import PaletteSelector from '../PaletteSelector';

export interface VxlProps {
  data: Uint8Array;
}

const CANVAS_SIZE = 600;

export default function VxlViwer({ data }: VxlProps): JSX.Element {
  const [file, setFile] = useState<Vxl | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);

  const renderVoxel = useCallback((canvas: HTMLCanvasElement) => {
    try {
      if (canvas === null) {
        return;
      }
      if (file === null) {
        return;
      }
      const renderer = new VoxelRenderer();
      const webGl = new WebGLRenderer({ canvas });
      webGl.setSize(CANVAS_SIZE, CANVAS_SIZE, false);
      webGl.setClearColor(0x000000, 0);
      const mesh = renderer.generateMesh(file.sections[0], selectedPalette ?? file.palette);
      const scene = new Scene();
      const camera = new PerspectiveCamera(75, 1, 0.1, 2000);
      camera.position.z = 5;
      camera.position.x = 0;
      scene.add(mesh);
      camera.lookAt(mesh.position);

      const controls = new OrbitControls(camera, webGl.domElement);
      controls.target.set(mesh.position.x, mesh.position.y, mesh.position.z);
      controls.update();

      let renderRequested = false;
      function requestRenderIfNotRequested() {
        if (!renderRequested) {
          renderRequested = true;
          requestAnimationFrame(render);
        }
      }
    
      controls.addEventListener('change', requestRenderIfNotRequested);
      function render() {
        renderRequested = false;
        webGl.render(scene, camera);
      }
      render();
    } catch (e) {
      console.error(e);
    }
  }, [file, selectedPalette]);

  useEffect(() => {
    try {
      setFile(Vxl.fromArray(data));
    } catch (e) {
      console.error(e);
      setFile(null);
    }
  }, [data]);

  if (file === null) {
    return <Unknown data={data} />;
  }

  return <div>
    <p>Sections: {file.sections.length}</p>
    <PaletteSelector onChange={setSelectedPalette}/>
    <canvas ref={renderVoxel} width={CANVAS_SIZE} height={CANVAS_SIZE} />
  </div>;
}