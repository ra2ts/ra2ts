export class Base64 {
  private static p = "=";
  private static tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  static encode(data: number[] | Uint8Array) {
    const s = [];
    const l = data.length;
    const rm = l % 3;
    const x = l - rm;
    let i = 0;
    for (i = 0; i < x; ) {
      const t = (data[i++] << 16) | (data[i++] << 8) | data[i++];
      s.push(Base64.tab.charAt((t >>> 18) & 0x3f));
      s.push(Base64.tab.charAt((t >>> 12) & 0x3f));
      s.push(Base64.tab.charAt((t >>> 6) & 0x3f));
      s.push(Base64.tab.charAt(t & 0x3f));
    }

    switch (rm) {
      case 2: {
        const t = (data[i++] << 16) | (data[i++] << 8);
        s.push(Base64.tab.charAt((t >>> 18) & 0x3f));
        s.push(Base64.tab.charAt((t >>> 12) & 0x3f));
        s.push(Base64.tab.charAt((t >>> 6) & 0x3f));
        s.push(Base64.p);
        break;
      }
      case 1: {
        const t = data[i++] << 16;
        s.push(Base64.tab.charAt((t >>> 18) & 0x3f));
        s.push(Base64.tab.charAt((t >>> 12) & 0x3f));
        s.push(Base64.p);
        s.push(Base64.p);
        break;
      }
    }
    return s.join("");
  }

  static decode(str: string, removePadding: boolean = false) {
    const s = str.split("");
    const out = [];
    let l = s.length - 1;

    while (s[l] == Base64.p) {
      l -= 1;
    }

    for (let i = 0; i < l; ) {
      let t = Base64.tab.indexOf(s[i++]) << 18;
      if (i <= l) {
        t |= Base64.tab.indexOf(s[i++]) << 12;
      }
      if (i <= l) {
        t |= Base64.tab.indexOf(s[i++]) << 6;
      }
      if (i <= l) {
        t |= Base64.tab.indexOf(s[i++]);
      }
      out.push((t >>> 16) & 0xff);
      out.push((t >>> 8) & 0xff);
      out.push(t & 0xff);
    }

    if (removePadding) {
      while (out[out.length - 1] == 0) {
        out.pop();
      }
    }
    return out;
  }
}