window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".teamStatistics-section table")
    .forEach((table) => {
      const teamConfig = {
        criteriaMapByKey: {
          name: {
            key: "name",
            isNumeric: false,
            sortBySurname: true,
            locale: "cs",
          },
          w: { key: "w", isNumeric: true, defaultDirection: "desc" },
          l: { key: "l", isNumeric: true, defaultDirection: "asc" },
          gf: { key: "gf", isNumeric: true, defaultDirection: "desc" },
          ga: { key: "ga", isNumeric: true, defaultDirection: "asc" },
          ppPercent: {
            key: "ppPercent",
            isNumeric: true,
            defaultDirection: "desc",
          },
          pkPercent: {
            key: "pkPercent",
            isNumeric: true,
            defaultDirection: "desc",
          },
          pp: { key: "pp", isNumeric: true, defaultDirection: "desc" },
          pk: { key: "pk", isNumeric: true, defaultDirection: "asc" },
          pim: { key: "pim", isNumeric: true, defaultDirection: "asc" },
          rank: { key: "rank", isNumeric: true, defaultDirection: "asc" },
        },

        tieBreakersByKey: {
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
          rank: [],
        },

        initialKey: "w",
      };

      makeSortableMulti(table, teamConfig);
    });
});
