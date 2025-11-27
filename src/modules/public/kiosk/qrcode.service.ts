import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  // Retourne une image QR Code encodée en Base64, parfaite pour les APIs JSON
  async generateQrCodeBase64(text: string): Promise<string> {
    try {
      const dataUrl = await QRCode.toDataURL(text);
      // La data URL est "data:image/png;base64,iVBORw0KGgo...", on ne veut que la partie base64
      return dataUrl.split(',')[1];
    } catch (err) {
      throw new Error('Erreur lors de la génération du QR Code');
    }
  }
}