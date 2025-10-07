// /**
//  * Сортирует строки таблицы по множественным критериям.
//  * @param {HTMLTableElement} table
//  * @param {Array} criteria - [{ colIndex, isNumeric, isDescending, sortBySurname, locale }]
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
//       const aCell = a.children[colIndex];
//       const bCell = b.children[colIndex];

//       let aRaw = aCell ? aCell.innerText.trim().replace(",", ".") : "";
//       let bRaw = bCell ? bCell.innerText.trim().replace(",", ".") : "";

//       if (!isNumeric && sortBySurname) {
//         aRaw = aRaw.split(" ").slice(-1)[0];
//         bRaw = bRaw.split(" ").slice(-1)[0];
//       }

//       const valA = isNumeric ? parseFloat(aRaw) || 0 : aRaw.toLowerCase();
//       const valB = isNumeric ? parseFloat(bRaw) || 0 : bRaw.toLowerCase();

//       const diff = isNumeric
//         ? valA - valB
//         : valA.localeCompare(valB, locale, { sensitivity: "base" });

//       if (diff !== 0) return isDescending ? -diff : diff;
//     }
//     return 0;
//   });

//   rows.forEach((row) => tbody.appendChild(row));
// }

// /**
//  * Нумерация ранга (с точкой) с учётом направления (asc/desc).
//  * Направление читается из table.dataset.rankDir, либо можно передать opts.descending.
//  * @param {HTMLTableElement} table
//  * @param {{descending?: boolean}} opts
//  */
// function updateRankingColumn(table, opts = {}) {
//   const rows = Array.from(table.tBodies[0].querySelectorAll("tr"));
//   const currentDir = table.dataset.rankDir === "desc" ? "desc" : "asc";
//   const descending =
//     typeof opts.descending === "boolean"
//       ? opts.descending
//       : currentDir === "desc";

//   const n = rows.length;
//   rows.forEach((row, index) => {
//     const strong = row.querySelector("td.rank-cell strong");
//     if (!strong) return;
//     const num = descending ? n - index : index + 1;
//     strong.textContent = `${num}.`; // точка на конце
//   });
// }

// /**
//  * Возвращает маппинги ключей колонок (из классов statsCol-*) к индексам th и сами th.
//  * @param {HTMLTableElement} table
//  */
// function getHeaderMaps(table) {
//   const headers = Array.from(table.querySelectorAll("thead th"));
//   const colIndexByKey = {};
//   const thByKey = {};
//   headers.forEach((th, i) => {
//     for (const cls of th.classList) {
//       const m = /^statsCol-(.+)$/.exec(cls);
//       if (m) {
//         const key = m[1]; // например "rank", "jersey", "name", "svPercent", "p"
//         colIndexByKey[key] = i;
//         thByKey[key] = th;
//       }
//     }
//   });
//   return { colIndexByKey, thByKey, headers };
// }

// /**
//  * Преобразует список критериев (по ключам) в список с индексами колонок.
//  * Пропускает критерии, у которых колонка не найдена.
//  */
// function criteriaByKeysToIndices(criteriaList, colIndexByKey) {
//   return criteriaList
//     .map((c) => {
//       const colIndex = colIndexByKey[c.key];
//       if (colIndex == null) return null;
//       return { ...c, colIndex };
//     })
//     .filter(Boolean);
// }

// /**
//  * Навешивает сортировку на заголовки (по классам statsCol-*) с поддержкой tie-breakers.
//  * @param {HTMLTableElement} table
//  * @param {{criteriaMapByKey:Object, tieBreakersByKey:Object, initialKey?:string}} config
//  */
// function makeSortableMulti(table, config) {
//   const { colIndexByKey, thByKey, headers } = getHeaderMaps(table);

//   // Состояние направления сортировки по ключу ('asc' | 'desc' | null)
//   const sortStates = {};

//   // Обработчик клика по колонке # — только переключаем направление нумерации (строки не трогаем)
//   const rankTh = thByKey["rank"] || table.querySelector("thead th:first-child");
//   if (rankTh) {
//     if (!table.dataset.rankDir) table.dataset.rankDir = "asc"; // дефолт
//     rankTh.style.cursor = "pointer";
//     rankTh.addEventListener("click", () => {
//       table.dataset.rankDir = table.dataset.rankDir === "desc" ? "asc" : "desc";
//       updateRankingColumn(table);
//     });
//   }

//   // Обработчики для колонок, которые описаны в конфиге
//   headers.forEach((th) => {
//     // определяем ключ из класса statsCol-*
//     let key = null;
//     for (const cls of th.classList) {
//       const m = /^statsCol-(.+)$/.exec(cls);
//       if (m) {
//         key = m[1];
//         break;
//       }
//     }
//     if (!key) return;

//     const mainConfig = config.criteriaMapByKey[key];
//     if (!mainConfig) return;

//     th.style.cursor = "pointer";
//     th.addEventListener("click", () => {
//       // toggle: первый клик = defaultDirection, дальше — инвертируем
//       const prev = sortStates[key] ?? null;
//       const next = prev
//         ? prev === "desc"
//           ? "asc"
//           : "desc"
//         : mainConfig.defaultDirection || "asc";

//       sortStates[key] = next;

//       // сбрасываем состояния у других ключей
//       Object.keys(sortStates).forEach((k) => {
//         if (k !== key) sortStates[k] = null;
//       });

//       const primary = { ...mainConfig, isDescending: next === "desc" };
//       const tieListKeys = config.tieBreakersByKey[key] || [];
//       const criteria = criteriaByKeysToIndices(
//         [primary, ...tieListKeys],
//         colIndexByKey
//       );

//       sortTableMulti(table, criteria);
//       updateRankingColumn(table); // нумерация с учётом текущего table.dataset.rankDir
//     });
//   });

//   // Начальная сортировка (если задана)
//   if (config.initialKey && config.criteriaMapByKey[config.initialKey]) {
//     const base = config.criteriaMapByKey[config.initialKey];
//     const dir = base.defaultDirection === "desc" ? "desc" : "asc";
//     sortStates[config.initialKey] = dir;

//     const primary = { ...base, isDescending: dir === "desc" };
//     const tieListKeys = config.tieBreakersByKey[config.initialKey] || [];
//     const criteria = criteriaByKeysToIndices(
//       [primary, ...tieListKeys],
//       colIndexByKey
//     );

//     sortTableMulti(table, criteria);
//   }

//   // Проставим нумерацию ранга при инициализации (учтём текущее направление)
//   updateRankingColumn(table);
// }

// window.addEventListener("DOMContentLoaded", () => {
//   const statsSection = document.querySelector(".statistics-section__inner");
//   if (!statsSection) return;

//   statsSection.querySelectorAll("table").forEach((table) => {
//     const { colIndexByKey } = getHeaderMaps(table);

//     // Тип таблицы:
//     // Вратари: есть svPercent
//     // Игроки:  есть p (поинты)
//     const isGoalies = "svPercent" in colIndexByKey;
//     const isPlayers = "p" in colIndexByKey;

//     if (isPlayers) {
//       // Конфиг для игроков
//       const playerConfig = {
//         criteriaMapByKey: {
//           // основные числовые
//           p: { key: "p", isNumeric: true, defaultDirection: "desc" }, // Points
//           gp: { key: "gp", isNumeric: true },
//           g: { key: "g", isNumeric: true },
//           a: { key: "a", isNumeric: true },
//           ppg: { key: "ppg", isNumeric: true },
//           shg: { key: "shg", isNumeric: true },
//           pim: { key: "pim", isNumeric: true },
//           // имя по фамилии
//           name: {
//             key: "name",
//             isNumeric: false,
//             sortBySurname: true,
//             locale: "cs",
//           },
//           // номер — по умолчанию по возрастанию
//           jersey: { key: "jersey", isNumeric: true, defaultDirection: "asc" },
//         },
//         tieBreakersByKey: {
//           p: [
//             { key: "g", isNumeric: true, isDescending: true },
//             { key: "gp", isNumeric: true, isDescending: false },
//             { key: "pim", isNumeric: true, isDescending: false },
//             {
//               key: "name",
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           g: [
//             { key: "a", isNumeric: true, isDescending: true },
//             { key: "gp", isNumeric: true, isDescending: false },
//             { key: "p", isNumeric: true, isDescending: true },
//             {
//               key: "name",
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           a: [
//             { key: "g", isNumeric: true, isDescending: true },
//             { key: "gp", isNumeric: true, isDescending: false },
//             { key: "p", isNumeric: true, isDescending: true },
//             {
//               key: "name",
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           jersey: [
//             {
//               key: "name",
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//         },
//         initialKey: "p", // стартовая сортировка по Points
//       };

//       makeSortableMulti(table, playerConfig);
//     } else if (isGoalies) {
//       // Конфиг для вратарей
//       const gkConfig = {
//         criteriaMapByKey: {
//           svPercent: {
//             key: "svPercent",
//             isNumeric: true,
//             defaultDirection: "desc",
//           }, // SV%
//           sv: { key: "sv", isNumeric: true }, // Saves
//           gp: { key: "gp", isNumeric: true }, // Games Played
//           gpg: { key: "gpg", isNumeric: true }, // Goals per Game
//           min: { key: "min", isNumeric: true }, // Minutes
//           name: {
//             key: "name",
//             isNumeric: false,
//             sortBySurname: true,
//             locale: "cs",
//           },
//           jersey: { key: "jersey", isNumeric: true, defaultDirection: "asc" },
//         },
//         tieBreakersByKey: {
//           svPercent: [
//             { key: "sv", isNumeric: true, isDescending: true },
//             { key: "gp", isNumeric: true, isDescending: true },
//             {
//               key: "name",
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           gpg: [
//             { key: "min", isNumeric: true, isDescending: true },
//             {
//               key: "name",
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//           jersey: [
//             {
//               key: "name",
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//         },
//         initialKey: "svPercent",
//       };

//       makeSortableMulti(table, gkConfig);
//     } else {
//       // Фолбэк: хотя бы имя и номер
//       const fallbackConfig = {
//         criteriaMapByKey: {
//           name: {
//             key: "name",
//             isNumeric: false,
//             sortBySurname: true,
//             locale: "cs",
//           },
//           jersey: { key: "jersey", isNumeric: true, defaultDirection: "asc" },
//         },
//         tieBreakersByKey: {
//           jersey: [
//             {
//               key: "name",
//               isNumeric: false,
//               isDescending: false,
//               sortBySurname: true,
//             },
//           ],
//         },
//       };
//       makeSortableMulti(table, fallbackConfig);
//     }
//   });
// });
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
      const aCell = a.children[colIndex];
      const bCell = b.children[colIndex];
      let aRaw = aCell ? aCell.innerText.trim().replace(",", ".") : "";
      let bRaw = bCell ? bCell.innerText.trim().replace(",", ".") : "";
      if (!isNumeric && sortBySurname) {
        aRaw = aRaw.split(" ").slice(-1)[0];
        bRaw = bRaw.split(" ").slice(-1)[0];
      }
      const valA = isNumeric ? parseFloat(aRaw) || 0 : aRaw.toLowerCase();
      const valB = isNumeric ? parseFloat(bRaw) || 0 : bRaw.toLowerCase();
      const diff = isNumeric
        ? valA - valB
        : valA.localeCompare(valB, locale, { sensitivity: "base" });
      if (diff !== 0) return isDescending ? -diff : diff;
    }
    return 0;
  });
  rows.forEach((row) => tbody.appendChild(row));
}

function updateRankingColumn(table, opts = {}) {
  const rows = Array.from(table.tBodies[0].querySelectorAll("tr"));
  const currentDir = table.dataset.rankDir === "desc" ? "desc" : "asc";
  const descending =
    typeof opts.descending === "boolean"
      ? opts.descending
      : currentDir === "desc";
  const n = rows.length;
  rows.forEach((row, index) => {
    const strong = row.querySelector("td.rank-cell strong");
    if (!strong) return;
    const num = descending ? n - index : index + 1;
    strong.textContent = `${num}.`;
  });
}

function getHeaderMaps(table) {
  const headers = Array.from(table.querySelectorAll("thead th"));
  const colIndexByKey = {};
  const thByKey = {};
  headers.forEach((th, i) => {
    for (const cls of th.classList) {
      const m = /^statsCol-(.+)$/.exec(cls);
      if (m) {
        const key = m[1];
        colIndexByKey[key] = i;
        thByKey[key] = th;
      }
    }
  });
  return { colIndexByKey, thByKey, headers };
}

function criteriaByKeysToIndices(criteriaList, colIndexByKey) {
  return criteriaList
    .map((c) => {
      const colIndex = colIndexByKey[c.key];
      if (colIndex == null) return null;
      return { ...c, colIndex };
    })
    .filter(Boolean);
}

function makeSortableMulti(table, config) {
  const { colIndexByKey, thByKey, headers } = getHeaderMaps(table);
  const sortStates = {};
  const rankTh = thByKey["rank"] || table.querySelector("thead th:first-child");
  if (rankTh) {
    if (!table.dataset.rankDir) table.dataset.rankDir = "asc";
    rankTh.style.cursor = "pointer";
    rankTh.addEventListener("click", () => {
      table.dataset.rankDir = table.dataset.rankDir === "desc" ? "asc" : "desc";
      updateRankingColumn(table);
    });
  }
  headers.forEach((th) => {
    let key = null;
    for (const cls of th.classList) {
      const m = /^statsCol-(.+)$/.exec(cls);
      if (m) {
        key = m[1];
        break;
      }
    }
    if (!key) return;
    const mainConfig = config.criteriaMapByKey[key];
    if (!mainConfig) return;
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const prev = sortStates[key] ?? null;
      const next = prev
        ? prev === "desc"
          ? "asc"
          : "desc"
        : mainConfig.defaultDirection || "asc";
      sortStates[key] = next;
      Object.keys(sortStates).forEach((k) => {
        if (k !== key) sortStates[k] = null;
      });
      const primary = { ...mainConfig, isDescending: next === "desc" };
      const tieListKeys = config.tieBreakersByKey[key] || [];
      const criteria = criteriaByKeysToIndices(
        [primary, ...tieListKeys],
        colIndexByKey
      );
      sortTableMulti(table, criteria);
      updateRankingColumn(table);
    });
  });
  if (config.initialKey && config.criteriaMapByKey[config.initialKey]) {
    const base = config.criteriaMapByKey[config.initialKey];
    const dir = base.defaultDirection === "desc" ? "desc" : "asc";
    sortStates[config.initialKey] = dir;
    const primary = { ...base, isDescending: dir === "desc" };
    const tieListKeys = config.tieBreakersByKey[config.initialKey] || [];
    const criteria = criteriaByKeysToIndices(
      [primary, ...tieListKeys],
      colIndexByKey
    );
    sortTableMulti(table, criteria);
  }
  updateRankingColumn(table);
}

window.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".statistics-section__inner");
  if (!statsSection) return;
  statsSection.querySelectorAll("table").forEach((table) => {
    const { colIndexByKey } = getHeaderMaps(table);
    const isGoalies = "svPercent" in colIndexByKey;
    const isPlayers = "p" in colIndexByKey;
    if (isPlayers) {
      const playerConfig = {
        criteriaMapByKey: {
          p: { key: "p", isNumeric: true, defaultDirection: "desc" },
          gp: { key: "gp", isNumeric: true },
          g: { key: "g", isNumeric: true },
          a: { key: "a", isNumeric: true },
          ppg: { key: "ppg", isNumeric: true },
          shg: { key: "shg", isNumeric: true },
          pim: { key: "pim", isNumeric: true },
          name: {
            key: "name",
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          },
          jersey: { key: "jersey", isNumeric: true, defaultDirection: "asc" },
        },
        tieBreakersByKey: {
          p: [
            { key: "g", isNumeric: true, isDescending: true },
            { key: "gp", isNumeric: true, isDescending: false },
            { key: "pim", isNumeric: true, isDescending: false },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          g: [
            { key: "a", isNumeric: true, isDescending: true },
            { key: "gp", isNumeric: true, isDescending: false },
            { key: "p", isNumeric: true, isDescending: true },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          a: [
            { key: "g", isNumeric: true, isDescending: true },
            { key: "gp", isNumeric: true, isDescending: false },
            { key: "p", isNumeric: true, isDescending: true },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          jersey: [
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
        },
        initialKey: "p",
      };
      makeSortableMulti(table, playerConfig);
    } else if (isGoalies) {
      const gkConfig = {
        criteriaMapByKey: {
          svPercent: {
            key: "svPercent",
            isNumeric: true,
            defaultDirection: "desc",
          },
          sv: { key: "sv", isNumeric: true },
          gp: { key: "gp", isNumeric: true },
          gpg: { key: "gpg", isNumeric: true },
          min: { key: "min", isNumeric: true },
          name: {
            key: "name",
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          },
          jersey: { key: "jersey", isNumeric: true, defaultDirection: "asc" },
        },
        tieBreakersByKey: {
          svPercent: [
            { key: "sv", isNumeric: true, isDescending: true },
            { key: "gp", isNumeric: true, isDescending: true },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          gpg: [
            { key: "min", isNumeric: true, isDescending: true },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          jersey: [
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
        },
        initialKey: "svPercent",
      };
      makeSortableMulti(table, gkConfig);
    } else {
      const fallbackConfig = {
        criteriaMapByKey: {
          name: {
            key: "name",
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          },
          jersey: { key: "jersey", isNumeric: true, defaultDirection: "asc" },
        },
        tieBreakersByKey: {
          jersey: [
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
        },
      };
      makeSortableMulti(table, fallbackConfig);
    }
  });
});
