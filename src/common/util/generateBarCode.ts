import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import * as QRCode from 'qrcode';
import * as fs from 'fs';

export async function generateBarcode(code: string, format: string, outputPath: string): Promise<string> {
    try {
      const tempPath = `/tmp/${outputPath}`
        const canvas = createCanvas(200, 100); // Ajusta el tamaño según sea necesario
        JsBarcode(canvas, code, {
            format: format,
            displayValue: true, // Muestra el valor del código debajo del código de barras
            width: 2, // Ajusta el ancho de las barras
            height: 50, // Ajusta la altura del código de barras
        });
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(tempPath, buffer);
        console.log(fs.existsSync(tempPath))
        console.log(`Código de barras generado en: ${tempPath}`)
        return tempPath; // Devuelve la ruta de salida
    } catch (error) {
        console.error('Error al generar el código de barras:', error);
        throw error; // Lanza el error para que pueda ser manejado por el llamador
    }
}

export async function generateQRCode(data: string, outputPath: string): Promise<string> {
    try {
      const tempPath = `/tmp/${outputPath}`
      await QRCode.toFile(tempPath, data, {
        errorCorrectionLevel: 'H', // Nivel de corrección de errores (L, M, Q, H)
        margin: 1, // Margen alrededor del código QR
        width: 200, // Ancho del código QR en píxeles
      });
      console.log(`Código QR generado en: ${tempPath}`);
      return tempPath;
    } catch (error) {
      console.error('Error al generar el código QR:', error);
      throw error;
    }
  }