import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  getContrastTextColor(hexColor: string): string {
    let hex = hexColor.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = this.getRelativeLuminance(r, g, b);

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  private getRelativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(x => {
      x = x / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

}
