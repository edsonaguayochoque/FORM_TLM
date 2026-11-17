const denominations = [0.10, 0.20, 0.50, 1, 2, 5, 10, 20, 50, 100, 200];
const rowsContainer = document.getElementById('denominationRows');
const totalPiecesElement = document.getElementById('totalPieces');
const totalAmountElement = document.getElementById('totalAmount');

const money = value => value.toLocaleString('es-BO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function buildRows() {
  denominations.forEach((denomination, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${money(denomination)}</td>
      <td>
        <input class="quantity-input" type="number" min="0" step="1"
          value="0" inputmode="numeric" aria-label="Cantidad de piezas para ${money(denomination)}"
          data-index="${index}">
      </td>
      <td class="amount-cell" data-amount="${index}">0,00</td>
    `;
    rowsContainer.appendChild(row);
  });
}

function calculateTotals() {
  let totalPieces = 0;
  let totalAmount = 0;

  denominations.forEach((denomination, index) => {
    const input = document.querySelector(`.quantity-input[data-index="${index}"]`);
    const quantity = Math.max(0, Math.floor(Number(input.value) || 0));
    if (input.value !== '' && Number(input.value) < 0) input.value = 0;

    const amount = denomination * quantity;
    totalPieces += quantity;
    totalAmount += amount;

    document.querySelector(`[data-amount="${index}"]`).textContent = money(amount);
  });

  totalPiecesElement.textContent = totalPieces.toLocaleString('es-BO');
  totalAmountElement.textContent = money(totalAmount);
}

rowsContainer.addEventListener('input', event => {
  if (event.target.classList.contains('quantity-input')) calculateTotals();
});

document.getElementById('printBtn').addEventListener('click', () => window.print());

document.getElementById('countForm').addEventListener('reset', () => {
  setTimeout(calculateTotals, 0);
});

buildRows();
calculateTotals();
