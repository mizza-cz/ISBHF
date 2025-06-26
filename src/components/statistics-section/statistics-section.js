function sortTable(table, colIndex, isNumeric = true, isDescending = false) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const aCell = a.children[colIndex];
    const bCell = b.children[colIndex];

    const aVal = aCell ? aCell.innerText.trim().replace(",", ".") : "";
    const bVal = bCell ? bCell.innerText.trim().replace(",", ".") : "";

    const valA = isNumeric ? parseFloat(aVal) || 0 : aVal;
    const valB = isNumeric ? parseFloat(bVal) || 0 : bVal;

    if (valA < valB) return isDescending ? 1 : -1;
    if (valA > valB) return isDescending ? -1 : 1;
    return 0;
  });

  rows.forEach((row) => tbody.appendChild(row));
}

function makeSortable(table, defaultSortCol = null, defaultDescending = true) {
  const headers = table.querySelectorAll("thead th");
  const sortStates = Array.from(headers).map(() => null); // сохраняет направление сортировки

  headers.forEach((th, index) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const currentState = sortStates[index];
      const isDescending = currentState === "asc"; // переключаем
      sortStates.fill(null); // сброс всех состояний
      sortStates[index] = isDescending ? "desc" : "asc";
      sortTable(table, index, true, isDescending);
    });
  });

  if (defaultSortCol !== null) {
    sortStates[defaultSortCol] = defaultDescending ? "desc" : "asc";
    sortTable(table, defaultSortCol, true, defaultDescending);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".statistics-section__inner");

  if (statsSection) {
    const tables = statsSection.querySelectorAll("table");

    if (tables.length > 0) {
      if (tables[0]) makeSortable(tables[0], 8, true);
      if (tables[1]) makeSortable(tables[1]);
    }
  }
});
