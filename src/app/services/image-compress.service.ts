import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageCompressService {

  compress(base64: string, maxWidth = 1200, maxHeight = 750, quality = 0.72): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = base64;
    });
  }

  getSizeKB(base64: string): number {
    const b = base64.split(',')[1] || base64;
    return Math.round((b.length * 3) / 4 / 1024);
  }
}
