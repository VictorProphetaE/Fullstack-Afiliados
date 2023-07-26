const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parseFileData, saveTransactionsToDatabase, getTransactionsBySeller, getAllTransactionsGroupedBySeller } = require('./utils');

const app = express();
const upload = multer({ dest: 'backend/uploads/' });

app.use(express.static('frontend'));

// Route to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded file data
    const fileData = fs.readFileSync(path.join('backend/uploads', req.file.filename), 'utf-8');
    const transactions = parseFileData(fileData);

    // Save transactions to the database
    await saveTransactionsToDatabase(transactions);

    return res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({ error: 'Error processing file' });
  }
});

// Route to get all transactions grouped by seller
app.get('/transactions/all', async (req, res) => {
  try {
    // Fetch all transactions grouped by seller from the database
    const transactions = await getAllTransactionsGroupedBySeller();
    return res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    return res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Route to get transactions by seller
app.get('/transactions/:seller', async (req, res) => {
  try {
    const seller = req.params.seller;
    // Fetch transactions for the specified seller from the database
    const transactions = await getTransactionsBySeller(seller);

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    let totalSales = 0;

    // Calculate total sales for the seller
    transactions.forEach(transaction => {
      // Check if the transaction value is a valid number
      if (!isNaN(transaction.value)) {
        if (transaction.type === 1 || transaction.type === 2) {
          // Venda produtor (tipo 1) or Venda afiliado (tipo 2) - consider as income (+)
          totalSales += transaction.value;
        } else if (transaction.type === 3) {
          // Comissão paga (tipo 3) - consider as expense (-)
          totalSales -= transaction.value;
        } else if (transaction.type === 4) {
          // Comissão recebida (tipo 4) - consider as income (+)
          totalSales += transaction.value;
        }
      }
    });

    return res.status(200).json({ transactions, totalSales });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Error fetching transactions' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});