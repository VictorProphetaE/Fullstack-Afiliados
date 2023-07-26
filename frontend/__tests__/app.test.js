require('@babel/register')();

// O restante do seu código de teste
const { fireEvent, render, screen } = require('@testing-library/dom');
require('@testing-library/jest-dom/extend-expect');
const fetch = require('node-fetch');
require('../../app');

jest.mock('node-fetch');

function renderApp() {
  document.body.innerHTML = `
    <input type="file" id="fileInput">
    <button onclick="uploadFile()">Upload</button>
    <div id="message"></div>
  `;
}

describe('Frontend Tests', () => {
  beforeEach(() => {
    // Limpar o conteúdo do body antes de cada teste
    document.body.innerHTML = '';
  });

  it('should show error message when no file is selected for upload', async () => {
    // Renderizar o app
    renderApp();

    // Simular ação de clique no botão de upload
    const uploadButton = screen.getByText('Upload');
    fireEvent.click(uploadButton);

    // Verificar se a mensagem de erro é exibida corretamente
    const errorMessage = await screen.findByText('Please select a file to upload.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show success message after successful file upload', async () => {
    // Mock da resposta da API após o upload do arquivo
    fetch.mockResolvedValueOnce({ status: 200, json: () => ({ message: 'File uploaded successfully' }) });

    // Renderizar o app
    renderApp();

    // Simular seleção de arquivo no input
    const fileInput = screen.getByLabelText('File Upload');
    fireEvent.change(fileInput, { target: { files: [new File(['file content'], 'sales.txt')] } });

    // Simular ação de clique no botão de upload
    const uploadButton = screen.getByText('Upload');
    fireEvent.click(uploadButton);

    // Verificar se a mensagem de sucesso é exibida corretamente
    const successMessage = await screen.findByText('File uploaded successfully');
    expect(successMessage).toBeInTheDocument();
  });

  it('should show error message after failed file upload', async () => {
    // Mock da resposta da API após o upload do arquivo com erro
    fetch.mockResolvedValueOnce({ status: 500, json: () => ({ error: 'Error uploading file' }) });

    // Renderizar o app
    renderApp();

    // Simular seleção de arquivo no input
    const fileInput = screen.getByLabelText('File Upload');
    fireEvent.change(fileInput, { target: { files: [new File(['file content'], 'sales.txt')] } });

    // Simular ação de clique no botão de upload
    const uploadButton = screen.getByText('Upload');
    fireEvent.click(uploadButton);

    // Verificar se a mensagem de erro é exibida corretamente
    const errorMessage = await screen.findByText('Error uploading file');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show error message when seller name is not entered for transactions search', async () => {
    // Renderizar o app
    renderApp();
  
    // Simular ação de clique no botão de buscar transações
    const searchButton = screen.getByText('Get Transactions');
    fireEvent.click(searchButton);
  
    // Verificar se a mensagem de erro é exibida corretamente
    const errorMessage = await screen.findByText('Please enter a seller name.');
    expect(errorMessage).toBeInTheDocument();
  });
  
  it('should show transactions for a specific seller', async () => {
    // Mock da resposta da API após a busca por transações do vendedor
    fetch.mockResolvedValueOnce({
      status: 200,
      json: () => ({
        transactions: [
          { date: '2022-01-15T19:20:30-03:00', product: 'CURSO DE BEM-ESTAR', type: 1, value: 12.75 },
          { date: '2022-02-01T23:35:43-03:00', product: 'DESENVOLVEDOR FULL STACK', type: 3, value: 15.0 },
        ],
        totalSales: 27.75,
      }),
    });
  
    // Renderizar o app
    renderApp();
  
    // Simular entrada do nome do vendedor no input
    const sellerInput = screen.getByLabelText('Seller:');
    fireEvent.change(sellerInput, { target: { value: 'JOSE CARLOS' } });
  
    // Simular ação de clique no botão de buscar transações
    const searchButton = screen.getByText('Get Transactions');
    fireEvent.click(searchButton);
  
    // Verificar se as transações do vendedor são exibidas corretamente na tabela
    const transactionRows = await screen.findAllByRole('row');
    expect(transactionRows).toHaveLength(3); // 1 header row + 2 transaction rows
  
    const firstTransactionRow = transactionRows[1];
    expect(firstTransactionRow).toHaveTextContent('2022-01-15T19:20:30-03:00');
    expect(firstTransactionRow).toHaveTextContent('CURSO DE BEM-ESTAR');
    expect(firstTransactionRow).toHaveTextContent('Venda produtor');
    expect(firstTransactionRow).toHaveTextContent('12.75');
  
    const secondTransactionRow = transactionRows[2];
    expect(secondTransactionRow).toHaveTextContent('2022-02-01T23:35:43-03:00');
    expect(secondTransactionRow).toHaveTextContent('DESENVOLVEDOR FULL STACK');
    expect(secondTransactionRow).toHaveTextContent('Comissão paga');
    expect(secondTransactionRow).toHaveTextContent('-15.00');
  
    // Verificar se o total de vendas é exibido corretamente
    const totalRow = await screen.findByText('Total Sales');
    expect(totalRow).toHaveTextContent('27.75');
  });
});