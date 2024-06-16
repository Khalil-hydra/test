const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
function showMainContainer() {
  document.getElementById('mainContainer').classList.remove('d-none');
  document.getElementById('secondaryContainer').classList.add('d-none');
}

function showSecondaryContainer() {
  document.getElementById('mainContainer').classList.add('d-none');
  document.getElementById('secondaryContainer').classList.remove('d-none');
}

let uploadedPdfBytes; // Ensure this is defined in the outer scope to be accessible in all functions

document.getElementById('dropZone').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    readPdfFile(file);
  }
});

document.getElementById('dropZone').addEventListener('dragover', (event) => {
  event.preventDefault();
  event.currentTarget.classList.add('dragover');
});

document.getElementById('dropZone').addEventListener('dragleave', (event) => {
  event.currentTarget.classList.remove('dragover');
});

document.getElementById('dropZone').addEventListener('drop', (event) => {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file) {
    readPdfFile(file);
  }
});
document.getElementById('dropZone').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change', function() {
  var fileName = this.files[0].name;
  document.getElementById('fileNameDisplay1').value = fileName;
});

// ********************************************************************************
// ********************************************************************************
// ********************************************************************************

document.getElementById('file1Input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    readPdfFile(file);
  }
});

document.getElementById('drop1Zone').addEventListener('dragover', (event) => {
  event.preventDefault();
  event.currentTarget.classList.add('dragover');
});

document.getElementById('drop1Zone').addEventListener('dragleave', (event) => {
  event.currentTarget.classList.remove('dragover');
});

document.getElementById('drop1Zone').addEventListener('drop', (event) => {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file) {
    readPdfFile(file);
  }
});
document.getElementById('drop1Zone').addEventListener('click', () => {
  document.getElementById('file1Input').click();
});
document.getElementById('file1Input').addEventListener('change', function() {
  var fileName = this.files[0].name;
  document.getElementById('fileNameDisplay2').value = fileName;
});
// ********************************************************************************
// ********************************************************************************
// ********************************************************************************

function readPdfFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    uploadedPdfBytes = new Uint8Array(reader.result);
  };
  reader.readAsArrayBuffer(file);
}

async function modifyPdf() {
  // Fetch an existing PDF document
  if (!uploadedPdfBytes) {
    alert('Please upload a PDF file first.');
    return;
  }

  const firmasname = document.getElementById('firmasname').value;
  const firmasadresse = document.getElementById('firmasadresse').value;
  const firmasadresse1 = document.getElementById('firmasadresse1').value;
  const vn = document.getElementById('vn').value;
  const tel = document.getElementById('tel').value;
  const email = document.getElementById('email').value;
  const ads = document.getElementById('ads').value;
  const ads1 = document.getElementById('ads1').value;
  const betreff = document.getElementById('betreff').value;
  const brs = document.getElementById('brs').value;
  const textarea = document.getElementById('content').value;
  const textareaContent = textarea ? textarea : '';
  const formattedText = textareaContent.replace(/\n/g, '\n\n');

  // Load a PDFDocument from the existing PDF bytes
   pdfDoc = await PDFDocument.load(uploadedPdfBytes);
  const fontSize = 9;
  const paragraphs = textarea.split("\n"); // Split into paragraphs

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaFontb = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Get the pages of the document
  const pages = pdfDoc.getPages();

  // Check if the PDF has at least 3 pages
  // if (pages.length < 3) {
  //   alert('The PDF does not have enough pages.');
  //   return;
  // }

  const firstPage = pages[0];

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();
// **************************************************************
// ***************************************************************
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Example of adding left and right margins
const leftMargin = 75; // Adjust as needed
const rightMargin = 20; // Adjust as needed
const maxWidth = 580; // Adjust as needed
const lines = formattedText.split('\n\n');
let wrappedText = '';
let y = firstPage.getHeight() - 175; // Starting y-coordinate
const lineHeight = 14;
const paragraphSpacing = 2; // Adjust as needed for double spacing between paragraphs

// for (let line of lines) {
//   const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   let lineWidth = helveticaFont.widthOfTextAtSize(line, 12);
  
//   if (lineWidth > maxWidth - leftMargin - rightMargin) {
//     let words = line.split(' ');
//     let tempLine = '';
//     for (let word of words) {
//       let temp = tempLine + ' ' + word;
//       lineWidth = helveticaFont.widthOfTextAtSize(temp.trim(), 12);
//       if (lineWidth > maxWidth - leftMargin - rightMargin) {
//         wrappedText += tempLine.trim() + '\n';
//         tempLine = word;
//       } else {
//         tempLine = temp;
//       }
//     }
//     wrappedText += tempLine.trim() + '\n\n';
//   } else {
//     wrappedText += line + '\n\n';
//   }
// }
for (let i = 0; i < paragraphs.length; i++) {
  const paragraph = paragraphs[i];
  // Split paragraph into words
  const words = paragraph.split(' ');
  let line = '';

  for (let word of words) {
    // Calculate width of current line with new word
    const lineWidth = helveticaFont.widthOfTextAtSize(line + ' ' + word, fontSize);

    if (lineWidth < maxWidth - leftMargin - rightMargin) {
      line += (line === '' ? '' : ' ') + word;
    } else {
      // Calculate extra space width for justified alignment
      const numSpaces = line.split(' ').length - 1;
      const spaceWidth = helveticaFont.widthOfTextAtSize(' ', fontSize);
      const spaceExtraWidth = (maxWidth - leftMargin - rightMargin - lineWidth) / numSpaces;

      let x = leftMargin;

      // Draw each word in the line with justified alignment
      for (let w of line.split(' ')) {
        firstPage.drawText(w, {
          x: x,
          y: y,
          size: 9,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        x += helveticaFont.widthOfTextAtSize(w, fontSize) + spaceWidth + spaceExtraWidth;
      }

      // Start a new line
      y -= lineHeight;
      line = word;
    }
  }
  
      // // Draw the last line of the paragraph
      const lineWidth = helveticaFont.widthOfTextAtSize(line, fontSize);
      const numSpaces = line.split(' ').length - 1;
      const spaceWidth = helveticaFont.widthOfTextAtSize(' ', fontSize);
      const spaceExtraWidth = (maxWidth - leftMargin - rightMargin - lineWidth) / numSpaces;

      let x = leftMargin;

      // Draw each word in the last line with justified alignment
      for (let w of line.split(' ')) {
        firstPage.drawText(w, {
          x: x,
          y: y,
          size: 9,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        x += helveticaFont.widthOfTextAtSize(w, fontSize) + spaceWidth ;
      }

      // Move to the next paragraph with double spacing between paragraphs
      y -= lineHeight +0.25 ;
    }

// Trim extra new lines at the end
// wrappedText = wrappedText.trim();
// **************************************************************
// ***************************************************************
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   // Draw the texts
   firstPage.drawText(firmasname, {
    x: 75,
    y: height / 2 + 338,
    size: 9.5,
    font: helveticaFontb,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(firmasadresse, {
    x: 75,
    y: height / 2 + 320,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(firmasadresse1, {
    x: 75,
    y: height / 2 + 304,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(vn, {
    x: 475,
    y: height / 2 + 338,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(tel, {
    x: 475,
    y: height / 2 + 320,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(email, {
    x: 475,
    y: height / 2 + 304,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(ads, {
    x: 475,
    y: height / 2 + 295,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(ads1, {
    x: 475,
    y: height / 2 + 290,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(betreff, {
    x: 75.2,
    y: height / 2 + 265,
    size: 10,
    font: helveticaFontb,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  firstPage.drawText(brs, {
    x: 75.2,
    y: height / 2 + 250,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  // firstPage.drawText(formattedText, {
  //   x: 75.2,
  //   y: height / 2 + 210,
  //   size: 9,
  //   font: helveticaFont,
  //   color: rgb(0, 0, 0),
  //   lineHeight: 14,
  //   maxWidth: maxWidth - leftMargin - rightMargin,
  //   rotate: degrees(0),
  // });


  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  // const inputText5 = document.getElementById('inputText5').value;

  // Trigger the browser to download the PDF document using FileSaver.js
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, "inputText5");
}

