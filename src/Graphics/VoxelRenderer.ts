import { Palette, VxlSection } from "@/Resources";
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D } from "three";

const VOXEL_SIZE = 1;

export class VoxelRenderer {
  generateMesh(section: VxlSection, palette: Palette): Object3D {
    const mesh = new Object3D();
    const size = VOXEL_SIZE * section.scale;
    const box = new BoxGeometry(size, size, size);
    for (let x = 0; x < section.sizeX; x++) {
      for (let y = 0; y < section.sizeY; y++) {
        for (const v of section.voxels(x, y)) {
          const {r, g, b} = palette.getColorAt(v.color);
          const material = new MeshBasicMaterial({ color: (r << 16) | (g << 8) | b });
          const geom = new Mesh(box, material);
          geom.position.set(v.x, v.z, v.y);
          geom.position.multiplyScalar(section.scale);
          mesh.add(geom);
        }
      }
    }
    return mesh;
  }
}