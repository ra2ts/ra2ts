import { Palette } from "@/Resources";
import React, { createRef, useEffect } from "react"

export enum ImageFormat {
  RGBA,
  RGB,
  Palette,
  Canvas,
}

export interface RenderImageProps {
  data: number[] | OffscreenCanvas;
  width: number;
  height: number;
  palette?: Palette;
  style?: Record<string, any>
  title?: string;
  format?: ImageFormat
}

export default function RenderImage({ data, width, height, palette, style, title, format }: RenderImageProps): JSX.Element {
  const ref = createRef<HTMLCanvasElement>();

  format ??= ImageFormat.Palette;

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (ctx === undefined || ctx === null) {
      console.log('ctx not loaded');
      return;
    }

    if (width === 0 || height === 0) {
      return;
    }

    if ([ImageFormat.Palette, ImageFormat.RGB, ImageFormat.RGBA].includes(format)) {
      const idata = ctx.createImageData(width, height,);
      if (format === ImageFormat.Palette && palette !== undefined && Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const {r, g, b} = palette.getColorAt(data[i]);
          idata.data[(i * 4)] = r;
          idata.data[(i * 4)+1] = g;
          idata.data[(i * 4)+2] = b;
          idata.data[(i * 4)+3] = data[i] === 0 ? 0 : 255;
        }
      } else if (format === ImageFormat.RGB && Array.isArray(data)) {
        const length = data.length / 3;
        for (let i = 0; i <= length; i++) {
          idata.data[(i * 4)] = data[(i * 3)];
          idata.data[(i * 4) + 1] = data[(i * 3) + 1];
          idata.data[(i * 4) + 2] = data[(i * 3) + 2];
          idata.data[(i * 4) + 3] = 0xFF;
        }
      } else {
        for (let i = 0; i <= data.length; i++) {
          idata.data[i] = data[i];
        }
      }
      ctx.putImageData(idata, 0, 0);
    } else if (format === ImageFormat.Canvas && !Array.isArray(data)) {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(data, 0, 0); 
    }
  }, [palette, data]);

  return <canvas ref={ref} title={title} style={style} width={width} height={height}/>
}