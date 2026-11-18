/*const denominations = [0.10, 0.20, 0.50, 1, 2, 5, 10, 20, 50, 100, 200];
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
calculateTotals();*/

// ==========================================
// 1. CONFIGURACIÓN DE DENOMINACIONES
// ==========================================

const denominations = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200];

// Referencias a elementos HTML
const rowsContainer = document.getElementById("denominationRows");
const totalPiecesElement = document.getElementById("totalPieces");
const totalAmountElement = document.getElementById("totalAmount");

// ==========================================
// 2. FORMATO MONETARIO
// ==========================================

const money = (value) =>
  value.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Colocar automáticamente la fecha actual

const campoFecha = document.getElementById("date");

if (campoFecha) {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  campoFecha.value = hoy.toISOString().slice(0, 10);
}


// ==========================================
// 3. GENERAR FILAS DE DENOMINACIONES
// ==========================================

function buildRows() {
  denominations.forEach((denomination, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${money(denomination)}</td>

            <td>
                <input
                    class="quantity-input"
                    type="number"
                    min="0"
                    step="1"
                    value="0"
                    inputmode="numeric"
                    aria-label="Cantidad de piezas para ${money(denomination)}"
                    data-index="${index}"
                >
            </td>

            <td class="amount-cell" data-amount="${index}">
                0,00
            </td>
        `;

    rowsContainer.appendChild(row);
  });
}

// ==========================================
// 4. ELIMINAR CERO INICIAL AL SELECCIONAR
// ==========================================

rowsContainer.addEventListener("focusin", function (event) {
  const input = event.target;

  // Verificar que sea un campo de cantidad
  // y que todavía conserve su cero inicial

  if (
    input.classList.contains("quantity-input") &&
    input.value === "0" &&
    !input.dataset.touched
  ) {
    input.value = "";
  }
});

document.addEventListener("focusout", function (event) {
  const input = event.target;

  if (input.classList.contains("quantity-input")) {
    if (input.value.trim() === "") {
      input.value = "0";
      calculateTotals();
    }
  }
});

// ==========================================
// 5. CALCULAR IMPORTES Y TOTALES
// ==========================================

function calculateTotals() {
  let totalPieces = 0;
  let totalAmount = 0;

  denominations.forEach((denomination, index) => {
    const input = document.querySelector(
      `.quantity-input[data-index="${index}"]`,
    );

    // Si está vacío, se considera cantidad cero
    let quantity = Math.max(0, Math.floor(Number(input.value) || 0));

    // Evitar cantidades negativas
    if (input.value !== "" && Number(input.value) < 0) {
      input.value = 0;
    }

    // Calcular importe por denominación
    const amount = denomination * quantity;

    // Acumular totales
    totalPieces += quantity;
    totalAmount += amount;

    // Mostrar importe individual
    document.querySelector(`[data-amount="${index}"]`).textContent =
      money(amount);
  });

  // Mostrar total de piezas
  totalPiecesElement.textContent = totalPieces.toLocaleString("es-BO");

  // Mostrar importe total
  totalAmountElement.textContent = money(totalAmount);

  const campoLiteral = document.getElementById("amountWords");

  if (campoLiteral) {
    campoLiteral.value = numeroALetras(totalAmount);
  }
}

// ==========================================
// 6. DETECTAR CAMBIOS EN CANTIDAD DE PIEZAS
// ==========================================

rowsContainer.addEventListener("input", function (event) {
  if (event.target.classList.contains("quantity-input")) {
    // Marcar que el usuario ya modificó este campo
    event.target.dataset.touched = "true";

    // Actualizar todos los cálculos
    calculateTotals();
  }
});

// ==========================================
// 7. BOTÓN IMPRIMIR
// ==========================================

document.getElementById("printBtn").addEventListener("click", function () {
  window.print();
});

// ==========================================
// 8. BOTÓN LIMPIAR FORMULARIO
// ==========================================

document.getElementById("countForm").addEventListener("reset", function () {
  // Esperar a que el formulario se reinicie
  setTimeout(function () {
    // Eliminar las marcas de campos modificados
    document.querySelectorAll(".quantity-input").forEach((input) => {
      delete input.dataset.touched;
    });

    // Actualizar los importes a cero
    calculateTotals();
  }, 0);
});

// ==========================================
// 9. INICIALIZAR APLICACIÓN
// ==========================================

// Generar las filas de denominaciones
buildRows();

// Inicializar todos los importes y totales en cero
calculateTotals();

//calculo literal

function numeroALetras(numero) {
  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];

  const especiales = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
    "veinte",
    "veintiuno",
    "veintidós",
    "veintitrés",
    "veinticuatro",
    "veinticinco",
    "veintiséis",
    "veintisiete",
    "veintiocho",
    "veintinueve",
  ];

  const decenas = [
    "",
    "",
    "",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];

  const centenas = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  function convertir(n) {
    if (n === 0) return "cero";
    if (n === 100) return "cien";

    if (n < 10) return unidades[n];
    if (n < 30) return especiales[n - 10];

    if (n < 100) {
      const d = Math.floor(n / 10);
      const u = n % 10;
      return decenas[d] + (u ? " y " + unidades[u] : "");
    }

    if (n < 1000) {
      const c = Math.floor(n / 100);
      const resto = n % 100;
      return centenas[c] + (resto ? " " + convertir(resto) : "");
    }

    if (n < 1000000) {
      const miles = Math.floor(n / 1000);
      const resto = n % 1000;
      return (
        (miles === 1 ? "mil" : convertir(miles) + " mil") +
        (resto ? " " + convertir(resto) : "")
      );
    }

    if (n < 1000000000) {
      const millones = Math.floor(n / 1000000);
      const resto = n % 1000000;
      return (
        (millones === 1 ? "un millón" : convertir(millones) + " millones") +
        (resto ? " " + convertir(resto) : "")
      );
    }

    return String(n);
  }

  const entero = Math.floor(numero);
  const centavos = Math.round((numero - entero) * 100);

  return `${convertir(entero)} ${String(centavos).padStart(2, "0")}/100 bolivianos`;
}
