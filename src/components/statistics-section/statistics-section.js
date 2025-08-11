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
 * Обновляет порядковые номера в первом столбце таблицы (#)
 * Всегда нумерует 1..N сверху вниз по текущему порядку строк
 * @param {HTMLTableElement} table
 */
function updateRankingColumn(table) {
  const rows = Array.from(table.tBodies[0].querySelectorAll("tr"));
  rows.forEach((row, index) => {
    const strong = row.querySelector("td.rank-cell strong");
    if (strong) strong.textContent = index + 1;
  });
}

/**
 * Навешивает сортировку на заголовки с поддержкой множественных уровней
 * @param {HTMLTableElement} table
 * @param {Object} config
 */
function makeSortableMulti(table, config) {
  const headers = table.querySelectorAll("thead th");
  const sortStates = Array(headers.length).fill(null);

  // Сортировка по колонке #
  const rankTh = table.querySelector("thead th:first-child");
  if (rankTh) {
    let rankDescending = false;
    rankTh.style.cursor = "pointer";
    rankTh.addEventListener("click", () => {
      const rows = Array.from(table.tBodies[0].querySelectorAll("tr"));
      if (rankDescending) rows.reverse();
      rows.forEach((row) => table.tBodies[0].appendChild(row));
      updateRankingColumn(table); // без инверсии — просто 1..N
      rankDescending = !rankDescending;
    });
  }

  headers.forEach((th, idx) => {
    const mainConfig = config.criteriaMap[idx];
    if (!mainConfig) return;

    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      // переключаем направление для выбранного столбца
      sortStates[idx] = sortStates[idx] === "desc" ? "asc" : "desc";
      // сбрасываем остальные
      sortStates.forEach((_, i) => {
        if (i !== idx) sortStates[i] = null;
      });

      const dir = sortStates[idx];
      const primary = { ...mainConfig, isDescending: dir === "desc" };
      const tieList = config.tieBreakers[idx] || [];

      sortTableMulti(table, [primary, ...tieList]);
      updateRankingColumn(table); // всегда перенумеровываем как 1..N
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
    updateRankingColumn(table);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".statistics-section__inner");
  if (!statsSection) return;

  statsSection.querySelectorAll("table").forEach((table) => {
    const cols = table.querySelectorAll("thead th").length;

    // Игроки (11 колонок)
    if (cols === 11) {
      const playerConfig = {
        criteriaMap: {
          7: { colIndex: 7, isNumeric: true, defaultDirection: "desc" }, // P
          5: { colIndex: 5, isNumeric: true },
          6: { colIndex: 6, isNumeric: true },
          4: { colIndex: 4, isNumeric: true },
          8: { colIndex: 8, isNumeric: true },
          9: { colIndex: 9, isNumeric: true },
          10: { colIndex: 10, isNumeric: true },
          2: {
            colIndex: 2,
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          },
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

    // Вратари (10 колонок)
    else if (cols === 10) {
      const gkConfig = {
        criteriaMap: {
          8: { colIndex: 8, isNumeric: true, defaultDirection: "desc" }, // SV%
          6: { colIndex: 6, isNumeric: true }, // SV
          4: { colIndex: 4, isNumeric: true }, // GP
          9: { colIndex: 9, isNumeric: true }, // GPG
          5: { colIndex: 5, isNumeric: true }, // MIN
          2: {
            colIndex: 2,
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          },
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
