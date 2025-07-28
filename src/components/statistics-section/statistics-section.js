// /**
//  * Сортирует строки таблицы по множественным критериям.
//  * @param {HTMLTableElement} table
//  * @param {Array} criteria - массив критериев сортировки
//  */
// function sortTableMulti(table, criteria) {
//   const tbody = table.tBodies[0];
//   const rows = Array.from(tbody.querySelectorAll("tr"));

//   rows.sort((a, b) => {
//     for (const {
//       colIndex,
//       isNumeric,
//       isDescending,
//       sortBySurname = false,
//       locale = "cs",
//     } of criteria) {
//       let aRaw = a.children[colIndex]?.innerText.trim().replace(",", ".") || "";
//       let bRaw = b.children[colIndex]?.innerText.trim().replace(",", ".") || "";

//       if (!isNumeric && sortBySurname) {
//         aRaw = aRaw.split(" ").slice(-1)[0];
//         bRaw = bRaw.split(" ").slice(-1)[0];
//       }

//       const valA = isNumeric ? parseFloat(aRaw) || 0 : aRaw.toLowerCase();
//       const valB = isNumeric ? parseFloat(bRaw) || 0 : bRaw.toLowerCase();
//       let diff;

//       if (isNumeric) diff = valA - valB;
//       else diff = valA.localeCompare(valB, locale, { sensitivity: "base" });

//       if (diff !== 0) return isDescending ? -diff : diff;
//     }
//     return 0;
//   });

//   rows.forEach((row) => tbody.appendChild(row));
// }

// /**
//  * Навешивает сортировку на заголовки с поддержкой множественных уровней
//  */
// function makeSortableMulti(table, config) {
//   const headers = table.querySelectorAll("thead th");
//   const sortStates = Array(headers.length).fill(null);

//   headers.forEach((th, idx) => {
//     th.style.cursor = "pointer";
//     th.addEventListener("click", () => {
//       const mainConfig = config.criteriaMap[idx];
//       if (!mainConfig) return;

//       // Переключение направления сортировки
//       sortStates[idx] = sortStates[idx] === "desc" ? "asc" : "desc";
//       // Сброс остальных
//       sortStates.forEach((_, i) => {
//         if (i !== idx) sortStates[i] = null;
//       });

//       const dir = sortStates[idx];
//       const primary = { ...mainConfig, isDescending: dir === "desc" };
//       const tieList = config.tieBreakers[idx] || [];
//       sortTableMulti(table, [primary, ...tieList]);
//     });
//   });

//   // Начальная сортировка
//   if (typeof config.initial === "number") {
//     const i = config.initial;
//     sortStates[i] = config.criteriaMap[i].defaultDirection;
//     const primary = {
//       ...config.criteriaMap[i],
//       isDescending: config.criteriaMap[i].defaultDirection === "desc",
//     };
//     const tieList = config.tieBreakers[i] || [];
//     sortTableMulti(table, [primary, ...tieList]);
//   }
// }

// window.addEventListener("DOMContentLoaded", () => {
//   const statsSection = document.querySelector(".statistics-section__inner");
//   if (!statsSection) return;

//   statsSection.querySelectorAll("table").forEach((table) => {
//     const cols = table.querySelectorAll("thead th").length;

//     // Игроки (11 столбцов)
//     if (cols === 11) {
//       const playerConfig = {
//         criteriaMap: {
//           7: { colIndex: 7, isNumeric: true, defaultDirection: "desc" }, // P
//           5: { colIndex: 5, isNumeric: true }, // G
//           6: { colIndex: 6, isNumeric: true }, // A
//           4: { colIndex: 4, isNumeric: true }, // GP
//           8: { colIndex: 8, isNumeric: true }, // PPG
//           9: { colIndex: 9, isNumeric: true }, // SHG
//           10: { colIndex: 10, isNumeric: true }, // PIM
//           2: {
//             colIndex: 2,
//             isNumeric: false,
//             sortBySurname: true,
//             locale: "cs",
//           }, // Name
//         },
//         tieBreakers: {
//           // P: G ⬇, GP ⬆, PIM ⬆, фамилия ⬆
//           7: [
//             { colIndex: 5, isNumeric: true, isDescending: true },
//             { colIndex: 4, isNumeric: true, isDescending: false },
//             { colIndex: 10, isNumeric: true, isDescending: false },
//             {
//               colIndex: 2,
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           // G: GP ⬆, P ⬇, PIM ⬆, фамилия ⬆
//           5: [
//             { colIndex: 4, isNumeric: true, isDescending: false },
//             { colIndex: 7, isNumeric: true, isDescending: true },
//             { colIndex: 10, isNumeric: true, isDescending: false },
//             {
//               colIndex: 2,
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           // A: GP ⬆, P ⬇, PIM ⬆, фамилия ⬆
//           6: [
//             { colIndex: 4, isNumeric: true, isDescending: false },
//             { colIndex: 7, isNumeric: true, isDescending: true },
//             { colIndex: 10, isNumeric: true, isDescending: false },
//             {
//               colIndex: 2,
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           // PPG: GP ⬆, G ⬇, P ⬇, PIM ⬆, фамилия ⬆
//           8: [
//             { colIndex: 4, isNumeric: true, isDescending: false },
//             { colIndex: 5, isNumeric: true, isDescending: true },
//             { colIndex: 7, isNumeric: true, isDescending: true },
//             { colIndex: 10, isNumeric: true, isDescending: false },
//             {
//               colIndex: 2,
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           // SHG: GP ⬆, G ⬇, P ⬇, PIM ⬆, фамилия ⬆
//           9: [
//             { colIndex: 4, isNumeric: true, isDescending: false },
//             { colIndex: 5, isNumeric: true, isDescending: true },
//             { colIndex: 7, isNumeric: true, isDescending: true },
//             { colIndex: 10, isNumeric: true, isDescending: false },
//             {
//               colIndex: 2,
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           // PIM: GP ⬆, P ⬇, G ⬇, фамилия ⬆
//           10: [
//             { colIndex: 4, isNumeric: true, isDescending: false },
//             { colIndex: 7, isNumeric: true, isDescending: false },
//             { colIndex: 5, isNumeric: true, isDescending: false },
//             {
//               colIndex: 2,
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//         },
//         initial: 7,
//       };
//       makeSortableMulti(table, playerConfig);
//     }

//     // Вратари (10 столбцов)
//     else if (cols === 10) {
//       const gkConfig = {
//         criteriaMap: {
//           8: { colIndex: 8, isNumeric: true, defaultDirection: "desc" }, // SV%
//           6: { colIndex: 6, isNumeric: true }, // SV
//           4: { colIndex: 4, isNumeric: true }, // GP
//           9: { colIndex: 9, isNumeric: true }, // GPG
//           5: {
//             colIndex: 5,
//             isNumeric: true,
//             sortBySurname: false,
//             locale: "cs",
//           }, // MIN
//           2: {
//             colIndex: 2,
//             isNumeric: false,
//             sortBySurname: true,
//             locale: "cs",
//           }, // Name
//         },
//         tieBreakers: {
//           // SV%: SV ⬇, GP ⬇, фамилия ⬆
//           8: [
//             { colIndex: 6, isNumeric: true, isDescending: true },
//             { colIndex: 4, isNumeric: true, isDescending: true },
//             {
//               colIndex: 2,
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           // GPG: MIN ⬇, фамилия ⬆
//           9: [
//             { colIndex: 5, isNumeric: true, isDescending: true },
//             {
//               colIndex: 2,
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//         },
//         initial: 8,
//       };
//       makeSortableMulti(table, gkConfig);
//     }
//   });
// });

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

  // Обновление порядкового номера с учетом направления сортировки
  const primary = criteria[0];
  const isDescending = !!primary.isDescending;
  updateRankColumn(table, isDescending);
}

/**
 * Обновляет порядковый номер в первом столбце таблицы
 * @param {HTMLTableElement} table
 * @param {boolean} descending - нужно ли инвертировать счёт
 */
function updateRankColumn(table, descending = false) {
  const rows = Array.from(table.tBodies[0].querySelectorAll("tr"));
  const total = rows.length;

  rows.forEach((row, index) => {
    const cell = row.querySelector("td.rank-cell strong");
    if (cell) {
      cell.textContent = descending ? total - index : index + 1;
    }
  });
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
