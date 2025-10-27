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
      : currentDir === "asc";
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

  // === Устанавливаем начальное направление сортировки DESC ===
  if (rankTh) {
    if (!table.dataset.rankDir) table.dataset.rankDir = "desc";
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
      const prev = sortStates[key];
      const next = prev ? (prev === "desc" ? "asc" : "desc") : "desc"; // Первое нажатие всегда DESC
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

  // === Первичная сортировка ===
  if (config.initialKey && config.criteriaMapByKey[config.initialKey]) {
    const base = config.criteriaMapByKey[config.initialKey];
    const primary = { ...base, isDescending: true }; // Первое сразу DESC
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
