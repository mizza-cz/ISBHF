// function sortTable(
//   table,
//   colIndex,
//   isNumeric = true,
//   isDescending = false,
//   sortBySurname = false,
//   locale = "cs"
// ) {
//   const tbody = table.tBodies[0];
//   const rows = Array.from(tbody.querySelectorAll("tr"));

//   rows.sort((a, b) => {
//     let aVal = a.children[colIndex]?.innerText.trim().replace(",", ".") || "";
//     let bVal = b.children[colIndex]?.innerText.trim().replace(",", ".") || "";

//     if (!isNumeric && sortBySurname) {
//       aVal = aVal.split(" ").slice(-1)[0];
//       bVal = bVal.split(" ").slice(-1)[0];
//     }

//     const valA = isNumeric ? parseFloat(aVal) || 0 : aVal.toLowerCase();
//     const valB = isNumeric ? parseFloat(bVal) || 0 : bVal.toLowerCase();

//     if (isNumeric) {
//       return isDescending ? valB - valA : valA - valB;
//     } else {
//       return isDescending
//         ? valB.localeCompare(valA, locale, { sensitivity: "base" })
//         : valA.localeCompare(valB, locale, { sensitivity: "base" });
//     }
//   });

//   rows.forEach((row) => tbody.appendChild(row));
// }

// function makeSortable(table, columnDirections = {}, textColumns = {}) {
//   const headers = table.querySelectorAll("thead th");
//   const sortStates = Array.from(headers).map(() => null);

//   headers.forEach((th, index) => {
//     th.style.cursor = "pointer";
//     th.addEventListener("click", () => {
//       const currentState = sortStates[index];

//       const isDescending =
//         currentState === "asc"
//           ? true
//           : currentState === "desc"
//           ? false
//           : columnDirections[index] === "desc";

//       sortStates.fill(null);
//       sortStates[index] = isDescending ? "desc" : "asc";

//       const isText = !!textColumns[index];
//       const sortBySurname = textColumns[index]?.bySurname || false;
//       const locale = textColumns[index]?.locale || "cs";

//       sortTable(table, index, !isText, isDescending, sortBySurname, locale);
//     });
//   });

//   // Применение начальной сортировки, если указано
//   for (const [index, direction] of Object.entries(columnDirections)) {
//     const isText = !!textColumns[index];
//     const sortBySurname = textColumns[index]?.bySurname || false;
//     const locale = textColumns[index]?.locale || "cs";
//     sortStates[index] = direction;
//     sortTable(
//       table,
//       parseInt(index),
//       !isText,
//       direction === "desc",
//       sortBySurname,
//       locale
//     );
//     break; // применяем только к первому указанному столбцу
//   }
// }

// window.addEventListener("DOMContentLoaded", () => {
//   const statsSection = document.querySelector(".statistics-section__inner");

//   if (statsSection) {
//     const tables = statsSection.querySelectorAll("table");
//     console.log("Tables found:", tables.length);

//     tables.forEach((table) => {
//       const headers = table.querySelectorAll("thead th");
//       console.log("Headers in table:", headers.length);

//       // Player table
//       if (headers.length === 11) {
//         console.log("Found player table");
//         makeSortable(
//           table,
//           {
//             0: "asc", // #
//             2: "asc", // Name
//             3: "asc", // POST
//             4: "desc", // GP
//             5: "desc", // G
//             6: "desc", // A
//             7: "desc", // P
//             8: "desc", // PPG
//             9: "desc", // SHG
//             10: "desc", // PIM
//           },
//           {
//             2: { bySurname: true, locale: "cs" }, // Name
//             3: { bySurname: false, locale: "cs" }, // POST
//           }
//         );
//         sortTable(table, 7, true, true);
//       }

//       // Goalkeeper table
//       else if (headers.length === 10) {
//         console.log("Found goalkeeper table");
//         makeSortable(
//           table,
//           {
//             0: "asc", // #
//             2: "asc", // Name
//             3: "asc", // POST
//             4: "desc", // GP
//             5: "desc", // MIN
//             6: "desc", // SV
//             7: "asc", // GA
//             8: "desc", // SV%
//             9: "asc", // GPG
//           },
//           {
//             2: { bySurname: true, locale: "cs" }, // Name
//             3: { bySurname: false, locale: "cs" }, // POST
//           }
//         );

//         // Начальная сортировка по SV% (index 8)
//         sortTable(table, 8, true, true);
//       }
//     });
//   }
// });

/*
  Расширенная сортировка таблиц игроков и вратарей с критериями при равенстве
*/

/**
 * Сортирует строки таблицы по множественным критериям.
 * @param {HTMLTableElement} table
 * @param {Array} criteria - массив критериев сортировки
 */
function sortTableMulti(table, criteria) {
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    for (const {
      colIndex,
      isNumeric,
      isDescending,
      sortBySurname = false,
      locale = "cs",
    } of criteria) {
      let aRaw = a.children[colIndex]?.innerText.trim().replace(",", ".") || "";
      let bRaw = b.children[colIndex]?.innerText.trim().replace(",", ".") || "";

      if (!isNumeric && sortBySurname) {
        aRaw = aRaw.split(" ").slice(-1)[0];
        bRaw = bRaw.split(" ").slice(-1)[0];
      }

      const valA = isNumeric ? parseFloat(aRaw) || 0 : aRaw.toLowerCase();
      const valB = isNumeric ? parseFloat(bRaw) || 0 : bRaw.toLowerCase();
      let diff;

      if (isNumeric) diff = valA - valB;
      else diff = valA.localeCompare(valB, locale, { sensitivity: "base" });

      if (diff !== 0) return isDescending ? -diff : diff;
    }
    return 0;
  });

  rows.forEach((row) => tbody.appendChild(row));
}

/**
 * Навешивает сортировку на заголовки с поддержкой множественных уровней
 */
function makeSortableMulti(table, config) {
  const headers = table.querySelectorAll("thead th");
  const sortStates = Array(headers.length).fill(null);

  headers.forEach((th, idx) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const mainConfig = config.criteriaMap[idx];
      if (!mainConfig) return;

      // Переключение направления сортировки
      sortStates[idx] = sortStates[idx] === "desc" ? "asc" : "desc";
      // Сброс остальных
      sortStates.forEach((_, i) => {
        if (i !== idx) sortStates[i] = null;
      });

      const dir = sortStates[idx];
      const primary = { ...mainConfig, isDescending: dir === "desc" };
      const tieList = config.tieBreakers[idx] || [];
      sortTableMulti(table, [primary, ...tieList]);
    });
  });

  // Начальная сортировка
  if (typeof config.initial === "number") {
    const i = config.initial;
    sortStates[i] = config.criteriaMap[i].defaultDirection;
    const primary = {
      ...config.criteriaMap[i],
      isDescending: config.criteriaMap[i].defaultDirection === "desc",
    };
    const tieList = config.tieBreakers[i] || [];
    sortTableMulti(table, [primary, ...tieList]);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".statistics-section__inner");
  if (!statsSection) return;

  statsSection.querySelectorAll("table").forEach((table) => {
    const cols = table.querySelectorAll("thead th").length;

    // Игроки (11 столбцов)
    if (cols === 11) {
      const playerConfig = {
        criteriaMap: {
          7: { colIndex: 7, isNumeric: true, defaultDirection: "desc" }, // P
          5: { colIndex: 5, isNumeric: true }, // G
          6: { colIndex: 6, isNumeric: true }, // A
          4: { colIndex: 4, isNumeric: true }, // GP
          8: { colIndex: 8, isNumeric: true }, // PPG
          9: { colIndex: 9, isNumeric: true }, // SHG
          10: { colIndex: 10, isNumeric: true }, // PIM
          2: {
            colIndex: 2,
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          }, // Name
        },
        tieBreakers: {
          // P: G ⬇, GP ⬆, PIM ⬆, фамилия ⬆
          7: [
            { colIndex: 5, isNumeric: true, isDescending: true },
            { colIndex: 4, isNumeric: true, isDescending: false },
            { colIndex: 10, isNumeric: true, isDescending: false },
            {
              colIndex: 2,
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          // G: GP ⬆, P ⬇, PIM ⬆, фамилия ⬆
          5: [
            { colIndex: 4, isNumeric: true, isDescending: false },
            { colIndex: 7, isNumeric: true, isDescending: true },
            { colIndex: 10, isNumeric: true, isDescending: false },
            {
              colIndex: 2,
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          // A: GP ⬆, P ⬇, PIM ⬆, фамилия ⬆
          6: [
            { colIndex: 4, isNumeric: true, isDescending: false },
            { colIndex: 7, isNumeric: true, isDescending: true },
            { colIndex: 10, isNumeric: true, isDescending: false },
            {
              colIndex: 2,
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          // PPG: GP ⬆, G ⬇, P ⬇, PIM ⬆, фамилия ⬆
          8: [
            { colIndex: 4, isNumeric: true, isDescending: false },
            { colIndex: 5, isNumeric: true, isDescending: true },
            { colIndex: 7, isNumeric: true, isDescending: true },
            { colIndex: 10, isNumeric: true, isDescending: false },
            {
              colIndex: 2,
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          // SHG: GP ⬆, G ⬇, P ⬇, PIM ⬆, фамилия ⬆
          9: [
            { colIndex: 4, isNumeric: true, isDescending: false },
            { colIndex: 5, isNumeric: true, isDescending: true },
            { colIndex: 7, isNumeric: true, isDescending: true },
            { colIndex: 10, isNumeric: true, isDescending: false },
            {
              colIndex: 2,
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          // PIM: GP ⬆, P ⬇, G ⬇, фамилия ⬆
          10: [
            { colIndex: 4, isNumeric: true, isDescending: false },
            { colIndex: 7, isNumeric: true, isDescending: false },
            { colIndex: 5, isNumeric: true, isDescending: false },
            {
              colIndex: 2,
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
        },
        initial: 7,
      };
      makeSortableMulti(table, playerConfig);
    }

    // Вратари (10 столбцов)
    else if (cols === 10) {
      const gkConfig = {
        criteriaMap: {
          8: { colIndex: 8, isNumeric: true, defaultDirection: "desc" }, // SV%
          6: { colIndex: 6, isNumeric: true }, // SV
          4: { colIndex: 4, isNumeric: true }, // GP
          9: { colIndex: 9, isNumeric: true }, // GPG
          5: {
            colIndex: 5,
            isNumeric: true,
            sortBySurname: false,
            locale: "cs",
          }, // MIN
          2: {
            colIndex: 2,
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          }, // Name
        },
        tieBreakers: {
          // SV%: SV ⬇, GP ⬇, фамилия ⬆
          8: [
            { colIndex: 6, isNumeric: true, isDescending: true },
            { colIndex: 4, isNumeric: true, isDescending: true },
            {
              colIndex: 2,
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          // GPG: MIN ⬇, фамилия ⬆
          9: [
            { colIndex: 5, isNumeric: true, isDescending: true },
            {
              colIndex: 2,
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
        },
        initial: 8,
      };
      makeSortableMulti(table, gkConfig);
    }
  });
});
