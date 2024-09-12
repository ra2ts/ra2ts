import React, { useState, useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import { decodeImaAdpcm } from 'ima-adpcm-decoder';

export interface WavProps {
  data: Uint8Array;
}

export default function Wav({ data }: WavProps): JSX.Element {
  const [playing, setPlaying] = useState(false);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
  const play = useCallback(async () => {
    const ctx = new AudioContext();
    const audioBuffer = decodeImaAdpcm(ctx, data.buffer);
    const src = ctx.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(ctx.destination);
    src.start(0);
    src.onended = () => setPlaying(false);
    setSource(src);
    setPlaying(true);
  }, [data]);

  const stop = useCallback(() => {
    if (source !== null) {
      source.stop();
      setPlaying(false);
    }
  }, [source]);

  return <div>
    <Button onClick={playing ? stop : play}>{ playing ? 'Stop' : 'Play' }</Button>
  </div>
}