function sortTable(table, colIndex, isNumeric = true, isDescending = false) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const aVal = a.children[colIndex]?.innerText.trim().replace(",", ".") || "";
    const bVal = b.children[colIndex]?.innerText.trim().replace(",", ".") || "";

    const valA = isNumeric ? parseFloat(aVal) || 0 : aVal;
    const valB = isNumeric ? parseFloat(bVal) || 0 : bVal;

    if (valA < valB) return isDescending ? 1 : -1;
    if (valA > valB) return isDescending ? -1 : 1;
    return 0;
  });

  rows.forEach((row) => tbody.appendChild(row));
}

function makeSortable(table, defaultDirections = {}) {
  const headers = table.querySelectorAll("thead th");
  const sortStates = Array.from(headers).map(() => null);

  headers.forEach((th, index) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const currentState = sortStates[index];
      const defaultDesc = defaultDirections[index] === "desc";
      const isDescending = currentState === "asc" ? true : !defaultDesc;
      sortStates.fill(null);
      sortStates[index] = isDescending ? "desc" : "asc";
      sortTable(table, index, true, isDescending);
    });
  });

  // Применяем начальную сортировку, если указана
  for (const [index, direction] of Object.entries(defaultDirections)) {
    sortStates[index] = direction;
    sortTable(table, parseInt(index), true, direction === "desc");
    break; // Только один начальный запуск
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".statistics-section__inner");

  if (statsSection) {
    const tables = statsSection.querySelectorAll("table");

    if (tables.length > 0) {
      // Первая таблица (вратари): GA=7, GPG=9 — ASC; другие DESC
      makeSortable(tables[0], {
        4: "desc", // GP
        5: "desc", // MIN
        6: "desc", // SV
        7: "asc", // GA
        8: "desc", // SV%
        9: "asc", // GPG
      });

      // Вторая таблица (игроки): GP=4, G=5, A=6, P=7, PPG=8, SHG=9, PIM=10 — все DESC
      makeSortable(tables[1], {
        4: "desc",
        5: "desc",
        6: "desc",
        7: "desc",
        8: "desc",
        9: "desc",
        10: "desc",
      });
    }
  }
});
