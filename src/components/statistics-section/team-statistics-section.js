window.addEventListener("DOMContentLoaded", () => {
  // Инициализация таблиц в секции Team Statistics
  document
    .querySelectorAll(".teamStatistics-section table")
    .forEach((table) => {
      const teamConfig = {
        criteriaMapByKey: {
          // Имя по фамилии
          name: {
            key: "name",
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          },
          // Основные числовые
          w: { key: "w", isNumeric: true, defaultDirection: "desc" }, // default sort
          l: { key: "l", isNumeric: true },
          gf: { key: "gf", isNumeric: true },
          ga: { key: "ga", isNumeric: true },
          ppPercent: { key: "ppPercent", isNumeric: true }, // "55" или "55%"
          pkPercent: { key: "pkPercent", isNumeric: true }, // "80" или "80%"
          pp: { key: "pp", isNumeric: true },
          pk: { key: "pk", isNumeric: true },
          pim: { key: "pim", isNumeric: true },

          // Номер/ранг нам не нужен для сортировки (только нумерация), но поддержим клик для инверта нумерации
          rank: { key: "rank", isNumeric: true, defaultDirection: "asc" },
        },
        tieBreakersByKey: {
          // Тай-брейкеры для ключевых колонок
          w: [
            { key: "gf", isNumeric: true, isDescending: true },
            { key: "ga", isNumeric: true, isDescending: false },
            { key: "ppPercent", isNumeric: true, isDescending: true },
            { key: "pkPercent", isNumeric: true, isDescending: true },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          gf: [
            { key: "ga", isNumeric: true, isDescending: false },
            { key: "w", isNumeric: true, isDescending: true },
            { key: "ppPercent", isNumeric: true, isDescending: true },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          ga: [
            { key: "gf", isNumeric: true, isDescending: true },
            { key: "w", isNumeric: true, isDescending: true },
            { key: "pkPercent", isNumeric: true, isDescending: true },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          ppPercent: [
            { key: "w", isNumeric: true, isDescending: true },
            { key: "gf", isNumeric: true, isDescending: true },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          pkPercent: [
            { key: "w", isNumeric: true, isDescending: true },
            { key: "ga", isNumeric: true, isDescending: false },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          // для удобства — когда кликают по PIM, пусть добивает по W → GF → GA → Name
          pim: [
            { key: "w", isNumeric: true, isDescending: true },
            { key: "gf", isNumeric: true, isDescending: true },
            { key: "ga", isNumeric: true, isDescending: false },
            {
              key: "name",
              isNumeric: false,
              isDescending: false,
              sortBySurname: true,
            },
          ],
          // при клике по rank — только инвертим нумерацию через уже существующий обработчик
          rank: [],
        },
        initialKey: "w",
      };

      makeSortableMulti(table, teamConfig);
    });
});
