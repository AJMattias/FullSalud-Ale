/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable } from '@nestjs/common';
import { CreatePdfDto } from '../../domain/dtos/pdf/create-pdf.dto';
import { UpdatePdfDto } from '../../domain/dtos/pdf/update-pdf.dto';
import { join } from 'path';
import { PrescriptionService } from '../prescription/prescription.service';
import { Repository } from 'typeorm';
import { MedicationRequestsService } from '../medication_request/medication-request.service';
import { MedicationRequest } from '../../domain/entities/medication-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
//const PDFDocument = require('pdfkit-table')
import PDFDocument from 'pdfkit';
import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import { generateBarcode, generateBarcodeBuffer, generateQRCode, generateQRCodeBuffer } from '../../common/util/generateBarCode';


@Injectable()
export class PdfService {
  
  constructor(
    @InjectRepository(MedicationRequest) protected medicationRequestRepository: Repository<MedicationRequest>,
  ) {}


  async createPdfReceta(createPdfDto: CreatePdfDto):Promise<Buffer> {

    //------------------------------------------------Receta FUllSALUD-------------------------------------
    const prescription = await this.medicationRequestRepository.findOne({
      where: { id: createPdfDto.medicationRequestId },
      relations: ['practitioner', 'patient', 'medicines'//, 'practitioner.specialities', 'practitioner.location'
                  ],
        // 'patient.socialWork'],
    });
    console.log("prescription", prescription)

    //receta bar code
    // const codeToEncode = prescription.id;
    // const barcodeFormat = 'CODE128'; // O 'CODE39'
    // const outputFilePath = `${prescription.patient.name}-${prescription.patient.lastName}.png`;
    // const prescriptionBarCodeUrl = await generateBarcode(codeToEncode, barcodeFormat, outputFilePath);
    // console.log('url imagen prescripcion barcode: ', prescriptionBarCodeUrl)

    //afiliado bar code
    //const codeToEncodeA = prescription.patient.id;
    //const barcodeFormat = 'CODE128'; // O 'CODE39'
    // const outputFilePathAfiliado = `afiliado-${prescription.patient.name}-${prescription.patient.lastName}.png`;
    // const afiliadoBarCodeUrl = await generateBarcode(codeToEncode, barcodeFormat, outputFilePathAfiliado);
    // console.log('url imagen afiliadoBarCodeUrl: ', afiliadoBarCodeUrl)

    //qrcode imagen
    // const outputFileQrPath = `qrcode.png-${prescription.id}`;
    // const qrCodePath = await generateQRCode(prescription.id, outputFileQrPath);

     //receta bar code
  const codeToEncode = prescription.id;
  const barcodeFormat = 'code128';
  const prescriptionBarCodeBuffer = await generateBarcodeBuffer(codeToEncode, barcodeFormat);

  //afiliado bar code
  const codeToEncodeA = prescription.patient.id;
  const afiliadoBarCodeBuffer = await generateBarcodeBuffer(codeToEncodeA, barcodeFormat);

  //qrcode imagen
  const outputFileQrPath = `qrcode-${prescription.id}.png`;
  const qrCodePath = await generateQRCodeBuffer(prescription.id);

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: [595, 842],
        bufferPages: true,
        autoFirstPage: false,
      });

      doc.addPage();

      // Franja gris de fondo
      // doc.rect(0, 0, doc.page.width, 108).fill('#D3D3D3');

      // // Título "Receta Electrónica"
      // doc.fillColor('black').fontSize(24).font('Helvetica-Bold').text('Receta Electrónica', doc.page.width / 3, 40);

      // //linea separadora
      // doc.rect(0, 108, doc.page.width, 3).fill('#A7A7A7'); 

      //logo
      doc.image(join(process.cwd(), 'uploads/logo.png'), doc.page.width / 2-50, 27, { width: 100 });

      //Recetario y afiliado
      doc.font('Helvetica-Bold').fontSize(16).fillColor('black');
      doc.text('Recetario:', 16, 36);
      //imagen
      doc.image(prescriptionBarCodeBuffer, 10, 66, { width: 240 })
      const widthNroAfiliado = doc.page.width / 2 + doc.page.width / 5
      doc.text('Nro afiliado:', widthNroAfiliado , 36);
      doc.image(afiliadoBarCodeBuffer, 343, 66, { width: 240 })

      const fecha = new Date(prescription.createdAt);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
      const año = fecha.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${año}`;
      // "Fecha Receta:" en negrita
      doc.font('Helvetica-Bold').fontSize(16).fillColor('black');
      doc.text('Fecha Receta: ', 92, 148);

      // Fecha en formato normal
      doc.font('Helvetica').fontSize(16).fillColor('black');
      doc.text(fechaFormateada, 205 + doc.widthOfString('Fecha Receta: '), 148);
      
      doc.rect(11, 172, 563, 2).fill('#C6C6C6');

      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text('Obra Social: ', 16, 192);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      //prescription.patient.socialWork.name
      doc.text('OSEP', 28 + doc.widthOfString('Obra Social'), 192);


      // Texto "Plan Medico: OD498"
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      // Calcula la coordenada x para el texto "Plan Medico:"
      const xPlanMedico = 28 + doc.widthOfString('Obra Social: OSEP') + 20; // Agrega 20 para un espacio entre los textos
      doc.text('Plan Medico: ', xPlanMedico, 192);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      // Calcula la coordenada x para el texto "OD498"
      const xOD498 = xPlanMedico + doc.widthOfString('Plan Medico: ') + 5; // Agrega 5 para un pequeño espacio
      doc.text('OD498', xOD498, 192);

      // Texto "Afiliado" (en la misma línea)
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      // Calcula la coordenada x para el texto "Afiliado:"
      const afiliado = xOD498 + doc.widthOfString('OD498') + 20; // Calcula la posición x después de "OD498"
      doc.text('Afiliado: ', afiliado, 192); // Misma coordenada y (314)
      doc.font('Helvetica').fontSize(12).fillColor('black');
      // Calcula la coordenada x para el nombre del afiliado
      const afiliadoNamex = afiliado + doc.widthOfString('Afiliado: ') + 5;
      const nombreAfiliado = ` ${prescription.patient.lastName}, ${prescription.patient.name}`;
      const nombre = nombreAfiliado.toLocaleUpperCase();
      doc.text(nombre, afiliadoNamex, 192); // Misma coordenada y (314)

      // Texto "DNI"
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`DNI:`, 16, 218);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      //prescription.patient.socialWork.name
      doc.text(`${prescription.patient.dni}`, 25 + doc.widthOfString('DNI'), 218);

      // Sexo
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      // Calcula la coordenada x para el texto "Plan Medico:"
      const xSexo = 20 + doc.widthOfString(`DNI: ${prescription.patient.dni}`) + 20; // Agrega 20 para un espacio entre los textos
      doc.text('Sexo: ', xSexo, 218);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      // Calcula la coordenada x para el texto "OD498"
      const xsexo = xSexo + doc.widthOfString('Sexo') +10; // Agrega 5 para un pequeño espacio
      let genero = "";
      switch (prescription.patient.gender) {
        case 'female':
          genero = "Femenino";
          break;
        case 'male':
          genero = "Masculino";
          break;
        case 'rather_not_say':
          genero = "Prefiero no decirlo";
          break;
        default:
          genero = "No especificado"; // O un valor predeterminado si el género no coincide con ninguno de los casos
        }
      doc.text(`${genero}`, xsexo, 218);

      const fechaN = new Date(prescription.patient.birth);
      const diaf = fechaN.getDate().toString().padStart(2, '0');
      const mesf = (fechaN.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
      const añof = fechaN.getFullYear();
      const fechaFormateadaFN = `${diaf}/${mesf}/${añof}`;
      // Texto "Fecha Nac" (en la misma línea)
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      // Calcula la coordenada x para el texto "Afiliado:"
      const fechaNac = xsexo + doc.widthOfString(`${genero}`) + 20; // Calcula la posición x después de "OD498"
      doc.text('Fecha Nacimiento: ', fechaNac, 218); // Misma coordenada y (314)
      doc.font('Helvetica').fontSize(12).fillColor('black');
      // Calcula la coordenada x para el nombre del afiliado
      const dateFechaNac = fechaNac + doc.widthOfString('Fecha Nacimiento: ') + 10;
      doc.text(fechaFormateadaFN, dateFechaNac, 218); // Misma coordenada y (314)
        
      //linea separadora
      doc.rect(11, 275, 563, 2).fill('#C6C6C6'); 

      
      // Texto "Diagnostico"
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Diagnostico:`, 16, 285);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      //prescription.patient.socialWork.name
      doc.text(`${prescription.diagnosis}`, 28 + doc.widthOfString('Diagnostico'), 285);

      // Texto "Prescripcion"
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Prescripcion Medicamentos:`, 16, 329);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      //prescription.patient.socialWork.name
      doc.text(`${prescription.medicines[0].name}`, 30 + doc.widthOfString('Prescripcion Medicamentos:'), 329);

      // Texto "Presentacion"
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Presentacion:`, 16, 373);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      //prescription.patient.socialWork.name
      doc.text(`${prescription.medicine_presentation}`, 30 + doc.widthOfString('Presentacion:'), 373);

      // Texto "Cantidad"
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Cantidad:`, 16, 417);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      //prescription.patient.socialWork.name
      doc.text(`${prescription.medicine_quantity}`, 30 + doc.widthOfString('Cantidad:'), 414);

      //linea separadora
      doc.rect(11, 455, 563, 2).fill('#C6C6C6'); 

      // Texto "Firmada"
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Firmada Electronicamente por:`, 16, 479);
      
      // Texto "Dr/a"
      const doctorName = `${prescription.practitioner.lastName}, ${prescription.practitioner.name}`
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Dr/a:`, 16, 508);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      doc.text(`${doctorName.toLocaleUpperCase()}`, 28 + doc.widthOfString('Dr/a'), 508);

      //matricula
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Matricula:`, 16, 528);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      doc.text(`${prescription.practitioner.license}`, 28 + doc.widthOfString('Matricula'), 528);

      //Especialidad
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Especialidad:`, 16, 548);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      doc.text(`${prescription.practitioner.specialities[0].name}`, 28 + doc.widthOfString('Especialidad'), 548);

      //Institucion
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Institucion:`, 16, 568);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      //doc.text(`${prescription.practitioner.}`, 28 + doc.widthOfString('Institucion'), 740);
      doc.text('OSEP', 28 + doc.widthOfString('Institucion'), 568);

      //Direccion
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Direccion:`, 16, 588);
      doc.font('Helvetica').fontSize(12).fillColor('black');
      //doc.text(`${prescription.practitioner.institution}`, 28 + doc.widthOfString('Institucion'), 740);
      doc.text('Suiza 678, Ciudad, Mendoza', 28 + doc.widthOfString('Direccion'), 588);

      //TODO Codigo qr y frima electronica
      doc.image(qrCodePath, 470, 502, { width: 90 })


      //texto centrado, receta validarse
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#49454F');
      doc.text(`Esta receta debe validarse on-line ingresando el número de recetario:`, 130, 618);

      //Firma Electronica
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text(`Firma electrónica `, 334, 508);
      doc.font('Helvetica').fontSize(10).fillColor('black');
      doc.text(`La firma electrónica `, 334, 532);
      doc.text(`sustituye legalmente `, 334, 547);
      doc.text(`firma olografa `, 334, 563);
      //QR Code

      //linea separadora
      doc.rect(11, 648, 563, 2).fill('#C6C6C6'); 

    //-------------------------------------------------------------------------- Sección datos del paciente

      let x = 16; // Inicializa la coordenada x (margen izquierdo)
      let y = 668; // Inicializa la coordenada y
      const lineHeight = 15; // Espacio entre líneas
      const marginRight = 16; // Margen derecho

      function addText(text, isBold, isSubtitle) {
          const font = isBold ? 'Helvetica-Bold' : 'Helvetica';
          doc.font(font).fontSize(7).fillColor('black');
          const textWidth = doc.widthOfString(text);

          if(text === 'Sexo: Masculino'){
            const textWidth2 = doc.widthOfString(`Sexo: ${genero}`);
            console.log(`Ancho del texto "Sexo: ${genero}": ${textWidth2} y x: ${x}`);
          }

          // Verifica si el texto se desborda, teniendo en cuenta el margen derecho
          console.log(text, 'texto y x + textWidth + marginRight: ', x + textWidth + marginRight)
          if (x + textWidth + marginRight > 590) { // 595 es el ancho total de la página
            console.log(text, 'desborda texto y x + textWidth + marginRight: ', x + textWidth + marginRight)
              x = 16; // Reinicia x al margen izquierdo
              y += lineHeight; // Mueve y a la siguiente línea
          }
          
          
          doc.text(text, x, y);
          if(isSubtitle){ // Actualiza x para el siguiente texto
            x += textWidth + 2
          }else{
            x += textWidth + 5; 
          }    
      }

      // Sección datos del paciente
      addText('Datos del paciente: ', true, true);

      // Obra Social
      addText('Obra Social: ', true, true);
      addText('OSEP', false, false);

      // Plan Médico
      addText('Plan Medico: ', true, true);
      addText('OD498', false, false);

      // Afiliado
      addText('Afiliado: ', true, true);
      //const nombreAfiliado = ` ${prescription.patient.lastName}, ${prescription.patient.name}`.toLocaleUpperCase();
      addText(nombreAfiliado, false, false);

      // DNI
      addText(`DNI:`, true, true);
      addText(`${prescription.patient.dni}`, false, false);

      // Sexo
      addText(`Sexo:`, true, true);
      addText(`${genero}`, false, false);

      //fecha nacimiento
      addText('Fecha Nacimiento: ', true, true);
      addText(fechaFormateadaFN, false, false);

      //Prescription
      addText('Prescription: ', true, true);
      addText('Prescription', false, false);

      //Medicamentos
      addText('Medicamentos: ', true, true);
      addText(`${prescription.medicines[0].name}`, false, false);

      //medicamento forma farmaceutica:
      addText('Medicamento forma farmaceutica: ', true, true);
      addText(`${prescription.medicine_pharmaceutical_form}`, false, false);

      //Presentacion mediamento
      addText('Presentacion: ', true, true);
      addText(`${prescription.medicine_presentation}`, false, false);
      
      //cantidad
      addText('cantidad: ', true, true);
      addText(`${prescription.medicine_quantity}`, false, false);

      //linea separadora
      doc.rect(201, 815, 173, 2).fill('#C6C6C6'); 

      //Emicion receta
      doc.font('Helvetica').fontSize(10).fillColor('black');
      doc.text(`Esta receta fue creada por un emisor inscripto y validado en el Registro de Recetarios Electrónicos del :`, 50, 840);
      doc.text(`Ministerio de Salud de la Nación (Resolución RL-2024-91317760-APN-SSVEIYES#MS)`, 70, 860);

      //ending pdf
      const buffer =[]
        doc.on('data', buffer.push.bind(buffer))
        doc.on('end', () =>{
          const data = Buffer.concat(buffer)
          resolve(data)
        })
      doc.end()
    })
    return pdfBuffer
  }



//----------------------------------------------------------PDF Indicaciones



async createPdfIndicaciones(createPdfDto: CreatePdfDto):Promise<Buffer> {

  const prescription = await this.medicationRequestRepository.findOne({
    where: { id: createPdfDto.medicationRequestId },
    relations: ['practitioner', 'patient', 'medicines', 'practitioner.specialities'],
      // 'patient.socialWork'],
  });
  console.log("prescription", prescription)

  //receta bar code
  // const codeToEncode = prescription.id;
  // const barcodeFormat = 'CODE128'; // O 'CODE39'
  // const outputFilePath = `${prescription.patient.name}-${prescription.patient.lastName}.png`;
  // const prescriptionBarCodeUrl = await generateBarcode(codeToEncode, barcodeFormat, outputFilePath);
  // console.log('url imagen prescripcion barcode: ', prescriptionBarCodeUrl)

  //afiliado bar code
  //const codeToEncodeA = prescription.patient.id;
  //const barcodeFormat = 'CODE128'; // O 'CODE39'
  // const outputFilePathAfiliado = `afiliado-${prescription.patient.name}-${prescription.patient.lastName}.png`;
  // const afiliadoBarCodeUrl = await generateBarcode(codeToEncode, barcodeFormat, outputFilePathAfiliado);
  // console.log('url imagen afiliadoBarCodeUrl: ', afiliadoBarCodeUrl)

  //qrcode imagen
  // const outputFileQrPath = `qrcode-${prescription.id}.png`;
  // const qrCodePath = await generateQRCode(prescription.id, outputFileQrPath);

  //receta bar code
  const codeToEncode = prescription.id;
  const barcodeFormat = 'code128';
  const prescriptionBarCodeBuffer = await generateBarcodeBuffer(codeToEncode, barcodeFormat);

  //afiliado bar code
  const codeToEncodeA = prescription.patient.id;
  const afiliadoBarCodeBuffer = await generateBarcodeBuffer(codeToEncodeA, barcodeFormat);

  //qrcode imagen
  const outputFileQrPath = `qrcode-${prescription.id}.png`;
  const qrCodePath = await generateQRCodeBuffer(prescription.id);

  const pdfBuffer: Buffer = await new Promise((resolve) => {
    const doc = new PDFDocument({
      size: [595, 950],
      bufferPages: true,
      autoFirstPage: false,
    });

    doc.addPage();

    // // Franja gris de fondo
    // doc.rect(0, 0, doc.page.width, 108).fill('#D3D3D3');

    // // Título "Receta Electrónica"
    // doc.fillColor('black').fontSize(24).font('Helvetica-Bold').text('Receta Electrónica', doc.page.width / 3, 40);

    // //linea separadora
    // doc.rect(0, 108, doc.page.width, 3).fill('#A7A7A7'); 

    //logo
    doc.image(join(process.cwd(), 'uploads/logo.png'), doc.page.width / 2-50, 135, { width: 100 });

    //Recetario y afiliado
    doc.font('Helvetica-Bold').fontSize(16).fillColor('black');
    doc.text('Recetario:', 16, 144);
    //imagen
    doc.image(prescriptionBarCodeBuffer, 10, 174, { width: 240 })
    const widthNroAfiliado = doc.page.width / 2 + doc.page.width / 5
    doc.text('Nro afiliado:', widthNroAfiliado , 144);
    doc.image(afiliadoBarCodeBuffer, 343, 174, { width: 240 })

    const fecha = new Date(prescription.createdAt);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const año = fecha.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;
    // "Fecha Receta:" en negrita
    doc.font('Helvetica-Bold').fontSize(16).fillColor('black');
    doc.text('Fecha Receta: ', 200, 256);

    // Fecha en formato normal
    doc.font('Helvetica').fontSize(16).fillColor('black');
    doc.text(fechaFormateada, 205 + doc.widthOfString('Fecha Receta: '), 256);
  
    //linea separadora
    doc.rect(11, 280, 563, 2).fill('#C6C6C6');

    //INDICACIONES
    // doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    // doc.text('Indicaciones: ', 16, 304)
    // doc.font('Helvetica').fontSize(12).fillColor('black');
    // doc.text(`${prescription.indications}`, 22 + doc.widthOfString('Indicaciones: '), 304)


    function splitTextIntoLines(text: string, maxWidth: number, font: string, fontSize: number, doc: PDFKit.PDFDocument): string[] {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
  
      doc.font(font).fontSize(fontSize);
  
      for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const lineWidth = doc.widthOfString(testLine);
  
          if (lineWidth <= maxWidth) {
              currentLine = testLine;
          } else {
              lines.push(currentLine);
              currentLine = word;
          }
      }
  
      lines.push(currentLine); // Agregar la última línea
      return lines;
    }
    function addIndications(doc: any, indications: string) {
      doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
      doc.text('Indicaciones: ', 16, 304);
  
      const maxWidth = 563 - 20 - doc.widthOfString('Indicaciones: ');
      const lines = splitTextIntoLines(indications, maxWidth, 'Helvetica', 12, doc);
  
      let yIndications = 304;
  
      doc.font('Helvetica').fontSize(12).fillColor('black');
      for (const line of lines) {
          doc.text(line, 20 + doc.widthOfString('Indicaciones: '), yIndications);
          yIndications += 15;
      }
    }

    addIndications(doc, prescription.indications || '');


    //linea separadora
    doc.rect(11, 563, 563, 2).fill('#C6C6C6'); 

    // Texto "Firmada"
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    doc.text(`Firmada Electronicamente por:`, 16, 587);
    
    // Texto "Dr/a"
    const doctorName = `${prescription.practitioner.lastName}, ${prescription.practitioner.name}`
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    doc.text(`Dr/a:`, 16, 616);
    doc.font('Helvetica').fontSize(12).fillColor('black');
    doc.text(`${doctorName.toLocaleUpperCase()}`, 28 + doc.widthOfString('Dr/a'), 616);

    //matricula
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    doc.text(`Matricula:`, 16, 636);
    doc.font('Helvetica').fontSize(12).fillColor('black');
    doc.text(`${prescription.practitioner.license}`, 28 + doc.widthOfString('Matricula'), 636);

    //Especialidad
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    doc.text(`Especialidad:`, 16, 656);
    doc.font('Helvetica').fontSize(12).fillColor('black');
    doc.text(`${prescription.practitioner.specialities[0].name}`, 28 + doc.widthOfString('Especialidad'), 656);

    //Institucion
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    doc.text(`Institucion:`, 16, 676);
    doc.font('Helvetica').fontSize(12).fillColor('black');
    //doc.text(`${prescription.practitioner.}`, 28 + doc.widthOfString('Institucion'), 740);
    doc.text('OSEP', 28 + doc.widthOfString('Institucion'), 676);

    //Direccion
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    doc.text(`Direccion:`, 16, 696);
    doc.font('Helvetica').fontSize(12).fillColor('black');
    //doc.text(`${prescription.practitioner.institution}`, 28 + doc.widthOfString('Institucion'), 740);
    doc.text('Suiza 678, Ciudad, Mendoza', 28 + doc.widthOfString('Direccion'), 696);

    //TODO Codigo qr y frima electronica
    doc.image(qrCodePath, 470, 610, { width: 90 })

    //texto centrado, receta validarse
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#49454F');
    doc.text(`Esta receta debe validarse on-line ingresando el número de recetario:`, 130, 726);

    //Firma Electronica
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black');
    doc.text(`Firma electrónica `, 334, 616);
    doc.font('Helvetica').fontSize(10).fillColor('black');
    doc.text(`La firma electrónica `, 334, 640);
    doc.text(`sustituye legalmente `, 334, 655);
    doc.text(`firma olografa `, 334, 670);
    //QR Code

    //linea separadora
    doc.rect(11, 756, 563, 2).fill('#C6C6C6'); 

   //-------------------------------------------------------------------------- Sección datos del paciente
   
    let x = 16; // Inicializa la coordenada x (margen izquierdo)
    let y = 776; // Inicializa la coordenada y
    const lineHeight = 15; // Espacio entre líneas
    const marginRight = 16; // Margen derecho

    function addText(text, isBold, isSubtitle) {
        const font = isBold ? 'Helvetica-Bold' : 'Helvetica';
        doc.font(font).fontSize(7).fillColor('black');
        const textWidth = doc.widthOfString(text);

        if(text === 'Sexo: Masculino'){
          const textWidth2 = doc.widthOfString(`Sexo: ${genero}`);
          console.log(`Ancho del texto "Sexo: ${genero}": ${textWidth2} y x: ${x}`);
        }

        // Verifica si el texto se desborda, teniendo en cuenta el margen derecho
        console.log(text, 'texto y x + textWidth + marginRight: ', x + textWidth + marginRight)
        if (x + textWidth + marginRight > 590) { // 595 es el ancho total de la página
          console.log(text, 'desborda texto y x + textWidth + marginRight: ', x + textWidth + marginRight)
            x = 16; // Reinicia x al margen izquierdo
            y += lineHeight; // Mueve y a la siguiente línea
        }
        
        
        doc.text(text, x, y);
        if(isSubtitle){ // Actualiza x para el siguiente texto
          x += textWidth + 2
        }else{
          x += textWidth + 5; 
        }    
    }

    // Sección datos del paciente
    addText('Datos del paciente: ', true, true);

    // Obra Social
    addText('Obra Social: ', true, true);
    addText('OSEP', false, false);

    // Plan Médico
    addText('Plan Medico: ', true, true);
    addText('OD498', false, false);

    // Afiliado
    const nombreAfiliado = ` ${prescription.patient.lastName}, ${prescription.patient.name}`;
    const nombre = nombreAfiliado.toLocaleUpperCase();
    addText('Afiliado: ', true, true);
    //const nombreAfiliado = ` ${prescription.patient.lastName}, ${prescription.patient.name}`.toLocaleUpperCase();
    addText(nombreAfiliado, false, false);

    // DNI
    addText(`DNI:`, true, true);
    addText(`${prescription.patient.dni}`, false, false);

    // Sexo
    let genero = "";
    switch (prescription.patient.gender) {
      case 'female':
        genero = "Femenino";
        break;
      case 'male':
        genero = "Masculino";
        break;
      case 'rather_not_say':
        genero = "Prefiero no decirlo";
        break;
      default:
        genero = "No especificado"; // O un valor predeterminado si el género no coincide con ninguno de los casos
      }
    addText(`Sexo:`, true, true);
    addText(`${genero}`, false, false);

    //fecha nacimiento
    const fechaN = new Date(prescription.patient.birth);
    const diaf = fechaN.getDate().toString().padStart(2, '0');
    const mesf = (fechaN.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const añof = fechaN.getFullYear();
    const fechaFormateadaFN = `${diaf}/${mesf}/${añof}`;
    // Texto "Fecha Nac" (en la misma línea)
    addText('Fecha Nacimiento: ', true, true);
    addText(fechaFormateadaFN, false, false);

    //Prescription
    addText('Prescription: ', true, true);
    x += 5
    addText('Prescription', false, false);

    //Medicamentos
    addText('Medicamentos: ', true, true);
    addText(`${prescription.medicines[0].name}`, false, false);

    //medicamento forma farmaceutica:
    addText('Medicamento forma farmaceutica: ', true, true);
    addText(`${prescription.medicine_pharmaceutical_form}`, false, false);

    //Presentacion mediamento
    addText('Presentacion: ', true, true);
    addText(`${prescription.medicine_presentation}`, false, false);
    
    //cantidad
    addText('cantidad: ', true, true);
    addText(`${prescription.medicine_quantity}`, false, false);

     //linea separadora
     doc.rect(201, 815, 173, 2).fill('#C6C6C6'); 

    //Emicion receta
    doc.font('Helvetica').fontSize(10).fillColor('black');
    doc.text(`Esta receta fue creada por un emisor inscripto y validado en el Registro de Recetarios Electrónicos del :`, 50, 840);
    doc.text(`Ministerio de Salud de la Nación (Resolución RL-2024-91317760-APN-SSVEIYES#MS)`, 70, 860);

    //ending pdf
    const buffer =[]
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);

        // Eliminar las imágenes aquí
        // try {
        //     fs.unlinkSync(join(process.cwd(), prescriptionBarCodeUrl));
        //     fs.unlinkSync(join(process.cwd(), afiliadoBarCodeUrl));
        //     fs.unlinkSync(join(process.cwd(), qrCodePath));
        //     console.log('Imágenes eliminadas con éxito.');
        // } catch (err) {
        //     console.error('Error al eliminar las imágenes:', err);
        // }
      });
      
    doc.end()
  })
  return pdfBuffer
}


}
