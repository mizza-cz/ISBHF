function sortTable(
  table,
  colIndex,
  isNumeric = true,
  isDescending = false,
  sortBySurname = false,
  locale = "cs"
) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    let aVal = a.children[colIndex]?.innerText.trim().replace(",", ".") || "";
    let bVal = b.children[colIndex]?.innerText.trim().replace(",", ".") || "";

    if (!isNumeric && sortBySurname) {
      aVal = aVal.split(" ").slice(-1)[0];
      bVal = bVal.split(" ").slice(-1)[0];
    }

    const valA = isNumeric ? parseFloat(aVal) || 0 : aVal.toLowerCase();
    const valB = isNumeric ? parseFloat(bVal) || 0 : bVal.toLowerCase();

    if (isNumeric) {
      return isDescending ? valB - valA : valA - valB;
    } else {
      return isDescending
        ? valB.localeCompare(valA, locale, { sensitivity: "base" })
        : valA.localeCompare(valB, locale, { sensitivity: "base" });
    }
  });

  rows.forEach((row) => tbody.appendChild(row));
}

function makeSortable(table, columnDirections = {}, textColumns = {}) {
  const headers = table.querySelectorAll("thead th");
  const sortStates = Array.from(headers).map(() => null);

  headers.forEach((th, index) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const currentState = sortStates[index];

      const isDescending =
        currentState === "asc"
          ? true
          : currentState === "desc"
          ? false
          : columnDirections[index] === "desc";

      sortStates.fill(null);
      sortStates[index] = isDescending ? "desc" : "asc";

      const isText = !!textColumns[index];
      const sortBySurname = textColumns[index]?.bySurname || false;
      const locale = textColumns[index]?.locale || "cs";

      sortTable(table, index, !isText, isDescending, sortBySurname, locale);
    });
  });

  // Применение начальной сортировки, если указано
  for (const [index, direction] of Object.entries(columnDirections)) {
    const isText = !!textColumns[index];
    const sortBySurname = textColumns[index]?.bySurname || false;
    const locale = textColumns[index]?.locale || "cs";
    sortStates[index] = direction;
    sortTable(
      table,
      parseInt(index),
      !isText,
      direction === "desc",
      sortBySurname,
      locale
    );
    break; // применяем только к первому указанному столбцу
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".statistics-section__inner");

  if (statsSection) {
    const tables = statsSection.querySelectorAll("table");
    console.log("Tables found:", tables.length);

    tables.forEach((table) => {
      const headers = table.querySelectorAll("thead th");
      console.log("Headers in table:", headers.length);

      // Player table
      if (headers.length === 11) {
        console.log("Found player table");
        makeSortable(
          table,
          {
            0: "asc", // #
            2: "asc", // Name
            3: "asc", // POST
            4: "desc", // GP
            5: "desc", // G
            6: "desc", // A
            7: "desc", // P
            8: "desc", // PPG
            9: "desc", // SHG
            10: "desc", // PIM
          },
          {
            2: { bySurname: true, locale: "cs" }, // Name
            3: { bySurname: false, locale: "cs" }, // POST
          }
        );
      }

      // Goalkeeper table
      else if (headers.length === 10) {
        console.log("Found goalkeeper table");
        makeSortable(
          table,
          {
            0: "asc", // #
            2: "asc", // Name
            3: "asc", // POST
            4: "desc", // GP
            5: "desc", // MIN
            6: "desc", // SV
            7: "asc", // GA
            8: "desc", // SV%
            9: "asc", // GPG
          },
          {
            2: { bySurname: true, locale: "cs" }, // Name
            3: { bySurname: false, locale: "cs" }, // POST
          }
        );

        // Начальная сортировка по SV% (index 8)
        sortTable(table, 8, true, false);
      }
    });
  }
});
