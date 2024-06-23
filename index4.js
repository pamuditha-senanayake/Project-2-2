import express from 'express';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the index page with the download button
app.get('/', (req, res) => {
  res.render('index2');
});

// Route to handle PDF generation and download
app.get('/download-invoice', (req, res) => {
  const doc = new PDFDocument();

  // Set the path where the PDF will be saved
  const filePath = path.join(__dirname, 'invoice.pdf');
  
  // Pipe its output to a file
  const writeStream = createWriteStream(filePath);
  doc.pipe(writeStream);
/////////////////////////////////////////////////////////////////
  // Add some content to the PDF
  doc.fontSize(25).text('Invoice', 100, 80);
  doc.fontSize(12).text('This is a sample invoice.', 100, 120);






/////////////////////////////////////////////////////////////////
  // Finalize the PDF and end the stream
  doc.end();

  // Handle the finish event of the write stream
  writeStream.on('finish', () => {
    res.download(filePath, 'invoice.pdf', (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        res.status(500).send('Error downloading the file');
      } else {
        // console.log('File downloaded successfully');
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
