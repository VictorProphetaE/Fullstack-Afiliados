const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'transaction_db',
  connectionLimit: 10,
});

// Save transactions to the database
async function saveTransactionsToDatabase(transactions) {
  const connection = await pool.getConnection();
  try {
    for (const transaction of transactions) {
      const { type, date, product, value, seller } = transaction;
      await connection.query(
        'INSERT INTO transactions (type, date, product, value, seller) VALUES (?, ?, ?, ?, ?)',
        [type, date, product, value, seller]
      );
    }
  } catch (error) {
    console.error('Error saving transactions to the database:', error);
  } finally {
    connection.release();
  }
}

// Get transactions for a specific seller
async function getTransactionsBySeller(seller) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM transactions WHERE seller = ?',
      [seller]
    );

    return rows.map(row => ({
      ...row,
      value: parseFloat(row.value) || 0,
    }));
  } catch (error) {
    console.error('Error fetching transactions from the database:', error);
    return [];
  } finally {
    connection.release();
  }
}

// Get all transactions grouped by seller and transaction type
async function getAllTransactionsGroupedBySeller() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT seller, type, SUM(value) as totalValue FROM transactions GROUP BY seller, type'
    );

    return rows.map(row => ({
      seller: row.seller,
      type: row.type,
      totalValue: parseFloat(row.totalValue) || 0,
    }));
  } catch (error) {
    console.error('Error fetching all transactions from the database:', error);
    return [];
  } finally {
    connection.release();
  }
}

// Parse file data into transactions array
function parseFileData(fileData) {
  const lines = fileData.split('\n').map(line => line.trim());
  const transactions = [];

  lines.forEach(line => {
    const type = Number(line.substring(0, 1));
    const date = line.substring(1, 26);
    const product = line.substring(26, 56).trim();
    const value = parseFloat(line.substring(56, 66)) / 100;
    const seller = line.substring(66, 86).trim();

    transactions.push({ type, date, product, value, seller });
  });

  return transactions;
}

module.exports = {
  saveTransactionsToDatabase,
  getTransactionsBySeller,
  parseFileData,
  getAllTransactionsGroupedBySeller,
};