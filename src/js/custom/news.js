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

    const searchParams = new URLSearchParams(window.location.search);
    const currentPage = loadMoreBtn.dataset.page ?? 2;
    searchParams.set("page", currentPage);

    const url = new URL(newsSource, window.location.origin);
    url.search = searchParams.toString();

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
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
      loadMoreBtn.dataset.page = parseInt(currentPage) + 1;
    }
  });
})();
