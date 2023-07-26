// Display a message in a div with the specified type (e.g., error, success, info).
function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = message;
  messageDiv.className = type;
}

// Upload a file using a POST request to the '/upload' endpoint.
function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) {
    showMessage('Please select a file to upload.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  // Send the file data using a fetch API POST request.
  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      // Display a success or error message based on the server response.
      if (data.message) {
        showMessage(data.message, 'success');
      } else {
        showMessage('Error uploading file', 'error');
      }
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      showMessage('Error uploading file', 'error');
    });
}

// Fetch and display transactions for a specific seller.
function getTransactions() {
  const sellerInput = document.getElementById('sellerInput');
  const seller = sellerInput.value.trim();
  if (!seller) {
    showMessage('Please enter a seller name.', 'error');
    return;
  }

  // Fetch transactions for the specified seller using a GET request to the '/transactions/:seller' endpoint.
  fetch(`/transactions/${seller}`)
    .then(response => response.json())
    .then(data => {
      // Display transactions and total sales if successful, or show an error message.
      if (data.error) {
        showMessage(data.error, 'error');
      } else {
        showTransactions(data.transactions, data.totalSales);
      }
    })
    .catch(error => {
      console.error('Error fetching transactions:', error);
      showMessage('Error fetching transactions', 'error');
    });
}

// Calculate the total sales from an array of transactions.
function calculateTotalSales(transactions) {
  let totalSales = 0;

  transactions.forEach(transaction => {
    // Check if the transaction value is a valid number and calculate total sales based on transaction type.
    if (!isNaN(transaction.value)) {
      if (transaction.type === 1 || transaction.type === 2 || transaction.type === 4) {
        totalSales += transaction.value;
      } else if (transaction.type === 3) {
        totalSales -= transaction.value;
      }
    }
  });

  return totalSales;
}

// Fetch and display all transactions grouped by seller.
async function getAllTransactionsGroupedBySeller() {
  // Fetch all transactions using a GET request to the '/transactions/all' endpoint.
  fetch(`/transactions/all`)
    .then(response => response.json())
    .then(data => {
      // Display transactions grouped by seller if successful, or show an error message.
      if (data.error) {
        showMessage(data.error, 'error');
      } else {
        showTransactionsGroupedBySeller(data.transactions);
      }
    })
    .catch(error => {
      console.error('Error fetching all transactions:', error);
      showMessage('Error fetching all transactions', 'error');
    });
}

// Get the description for a transaction type based on its code.
function getTypeDescription(type) {
  switch (type) {
    case 1:
      return 'Venda produtor';
    case 2:
      return 'Venda afiliado';
    case 3:
      return 'Comissão paga';
    case 4:
      return 'Comissão recebida';
    default:
      return 'Tipo desconhecido';
  }
}

// Display transactions and total sales in a table.
function showTransactions(transactions, totalSales) {
  const transactionsDiv = document.getElementById('transactions');
  transactionsDiv.innerHTML = '';

  if (transactions.length === 0) {
    showMessage('No transactions found for the seller', 'info');
    return;
  }

  showMessage('', '');

  // Create a container div with Bootstrap's "d-flex" class to center the table
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('d-flex', 'justify-content-center');

  // Create a table with Bootstrap table classes
  const table = document.createElement('table');
  table.classList.add('table', 'table-bordered', 'table-striped', 'table-hover');

  // Table header
  table.innerHTML = `
    <thead class="thead-dark">
      <tr>
        <th>Date</th>
        <th>Product</th>
        <th>Type</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
    <!-- Table rows will be added here -->
    </tbody>
  `;

  // Create rows for each transaction and append them to the table body.
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.date}</td>
      <td>${transaction.product}</td>
      <td>${getTypeDescription(transaction.type)}</td>
      <td>${Number(transaction.value).toFixed(2)}</td>
    `;
    table.querySelector('tbody').appendChild(row);
  });

  // Create a row for displaying the total sales and append it to the table body.
  const totalRow = document.createElement('tr');
  totalRow.innerHTML = `
    <td colspan="2">Total Sales</td>
    <td colspan="2">${isNaN(totalSales) ? 'N/A' : Number(totalSales).toFixed(2)}</td>
  `;
  table.querySelector('tbody').appendChild(totalRow);

  // Append the table to the container div
  containerDiv.appendChild(table);

  // Append the container div to the transactionsDiv
  transactionsDiv.appendChild(containerDiv);
}

// Display transactions grouped by seller in a table.
function showTransactionsGroupedBySeller(transactions) {
  const transactionsDiv = document.getElementById('allTransactions');
  transactionsDiv.innerHTML = '';

  if (transactions.length === 0) {
    showMessage('No transactions found', 'info');
    return;
  }

  showMessage('', '');

  // Create a table with Bootstrap table classes
  const table = document.createElement('table');
  table.classList.add('table', 'table-striped');
  table.innerHTML = `
    <thead class="thead-dark"> <!-- Add Bootstrap class for dark-colored header -->
      <tr>
        <th>Seller</th>
        <th>Type</th>
        <th>Total Value</th>
      </tr>
    </thead>
  `;

  // Create rows for each seller's transactions and append them to the table body.
  transactions.forEach(transaction => {
    const row = document.createElement('tr');

    // Determine the class and text color based on the transaction type
    let typeClass, typeColor, valueType;
    if (transaction.type === 3) {
      typeClass = 'bg-danger'; // Red background for "out" transactions
      typeColor = 'text-white'; // White text color for "out" transactions
      valueType = 'out';
    } else {
      typeClass = 'bg-success'; // Green background for "in" transactions
      typeColor = 'text-white'; // White text color for "in" transactions
      valueType = 'in';
    }

    // Get the description and total value for the transaction.
    const typeDescription = getTypeDescription(transaction.type);
    const totalValue = Number(transaction.totalValue).toFixed(2);

    // Create the cells for the row and add them to the row.
    row.innerHTML = `
      <td>${transaction.seller}</td>
      <td>${typeDescription}</td>
      <td class="${typeClass} ${typeColor}">${totalValue}</td>
    `;
    table.appendChild(row);
  });

  // Append the table to the transactionsDiv
  transactionsDiv.appendChild(table);
}