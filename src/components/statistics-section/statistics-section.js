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

  rows.forEach((row) => tbody.appendChild(row)); // Перемещаем строки обратно в tbody
}

function makeSortable(table, columnDirections = {}) {
  const headers = table.querySelectorAll("thead th");
  const sortStates = Array.from(headers).map(() => null);

  headers.forEach((th, index) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const currentState = sortStates[index];
      const defaultDesc = columnDirections[index] === "desc";
      const isDescending = currentState === "asc" ? true : !defaultDesc;
      sortStates.fill(null); // Сброс состояния сортировки
      sortStates[index] = isDescending ? "desc" : "asc"; // Сохранение состояния сортировки
      sortTable(table, index, true, isDescending);
    });
  });

  // Применение начальной сортировки, если указано
  for (const [index, direction] of Object.entries(columnDirections)) {
    sortStates[index] = direction;
    sortTable(table, parseInt(index), true, direction === "desc");
    break; // Только один начальный запуск
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".statistics-section__inner");

  if (statsSection) {
    const tables = statsSection.querySelectorAll("table");

    // Проверяем, что таблицы есть
    console.log("Tables found:", tables.length);

    tables.forEach((table, tableIndex) => {
      const headers = table.querySelectorAll("thead th");
      console.log("Headers in table:", headers.length); // Проверяем, сколько столбцов в таблице

      // Если таблица имеет 10 столбцов (для игроков)
      if (headers.length === 11) {
        console.log("Found player table");
        makeSortable(table, {
          4: "desc", // GP
          5: "desc", // G
          6: "desc", // A
          7: "desc", // P
          8: "desc", // PPG
          9: "desc", // SHG
          10: "desc", // PIM
        });
      } else if (headers.length === 10) {
        console.log("Found goalkeeper table");
        makeSortable(table, {
          4: "desc", // GP
          5: "desc", // MIN
          6: "desc", // SV
          7: "asc", // GA
          8: "desc", // SV%
          9: "asc", // GPG
        });
      }
    });
  }
});
