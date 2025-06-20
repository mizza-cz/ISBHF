(function () {
  const blogGrid = document.querySelector("#news-grid");
  const loadMoreBtn = document.querySelector(".news-load-more");

  if (!blogGrid || !loadMoreBtn || typeof newsSource === "undefined") return;

  const checkNewsCount = () => {
    const items = blogGrid.querySelectorAll(".newsItem");
  };

  checkNewsCount();

  loadMoreBtn.addEventListener("click", async () => {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loadMoreBtn.prepend(loader);

    const currentPage = parseInt(loadMoreBtn.dataset.page ?? "2", 10);

    const url = newsSource.includes("?")
      ? `${newsSource}&pageNumber=${currentPage}`
      : `${newsSource}?pageNumber=${currentPage}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      });

      loader.remove();

      if (!response.ok) return;

      const data = await response.json();

      if (data.html) {
        blogGrid.innerHTML += data.html;
      }

      checkNewsCount();

      if (data.loadMore === false) {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.dataset.page = currentPage + 1;
      }
    } catch (error) {
      console.error("Chyba při načítání dat:", error);
      loader.remove();
    }
  });
})();
