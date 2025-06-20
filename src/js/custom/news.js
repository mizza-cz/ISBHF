// (function () {
//   const blogGrig = document.querySelector("#news-grid");
//   const loadMoreBtn = document.querySelector(".news-load-more");

//   if (!blogGrig || !loadMoreBtn || typeof newsSource === "undefined") return;

//   // Скрыть кнопку, если изначально меньше 10 новостей
//   const checkNewsCount = () => {
//     const items = blogGrig.querySelectorAll(".newsItem");
//     if (items.length < 10) {
//       loadMoreBtn.style.display = "none";
//     } else {
//       loadMoreBtn.style.display = "inline-block";
//     }
//   };

//   checkNewsCount();

//   loadMoreBtn.addEventListener("click", async () => {
//     const currentPage = parseInt(loadMoreBtn.dataset.page ?? 2);

//     // Создаём URL с учётом ? или &
//     let url = newsSource;
//     url += newsSource.includes("?")
//       ? `&page=${currentPage}`
//       : `?page=${currentPage}`;

//     const fullUrl = new URL(url, window.location.origin);

//     const response = await fetch(fullUrl, {
//       method: "GET",
//       headers: { Accept: "application/json" },
//     });

//     if (!response.ok) return;

//     const data = await response.json();

//     if (data.html) {
//       blogGrig.innerHTML += data.html;
//     }

//     // Проверяем количество новостей после подгрузки
//     checkNewsCount();

//     // Скрыть кнопку, если всё загружено
//     if (data.loadMore === false) {
//       loadMoreBtn.style.display = "none";
//     } else {
//       loadMoreBtn.dataset.page = currentPage + 1;
//     }
//   });
// })();
(function () {
  const blogGrig = document.querySelector("#news-grid");
  const loadMoreBtn = document.querySelector(".news-load-more");

  if (!blogGrig || !loadMoreBtn || typeof newsSource === "undefined") return;

  const checkNewsCount = () => {
    const items = blogGrig.querySelectorAll(".newsItem");
    if (items.length < 10) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  };

  checkNewsCount();

  loadMoreBtn.addEventListener("click", async () => {
    const currentPage = parseInt(loadMoreBtn.dataset.page ?? 2);

    let ajaxUrl = newsSource;
    ajaxUrl += newsSource.includes("?")
      ? `&page=${currentPage}`
      : `?page=${currentPage}`;
    const fullAjaxUrl = new URL(ajaxUrl, window.location.origin);

    const updatedUrlParams = new URLSearchParams(window.location.search);
    updatedUrlParams.set("page", currentPage);
    const visibleUrl = `${
      window.location.pathname
    }?${updatedUrlParams.toString()}`;
    window.history.replaceState(null, "", visibleUrl);

    const response = await fetch(fullAjaxUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error("Nepodařilo se načíst data:", response.status);
      return;
    }

    const data = await response.json();

    if (data.html) {
      blogGrig.innerHTML += data.html;
    }

    checkNewsCount();

    if (data.loadMore === false) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.dataset.page = currentPage + 1;
    }
  });
})();
