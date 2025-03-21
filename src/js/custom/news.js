(function () {
  const blogGrig = document.querySelector("#news-grid");
  const loadMoreBtn = document.querySelector(".news-load-more");

  if (!blogGrig || !loadMoreBtn || typeof newsSource === "undefined") return;

  loadMoreBtn.addEventListener("click", async () => {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loadMoreBtn.prepend(loader);

    const searchParams = new URLSearchParams(window.location.search);
    const page = loadMoreBtn.dataset.page ?? 2;
    searchParams.append("page", page);

    const url = new URL(window.location.origin + newsSource);

    url.search = searchParams.toString();

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return;

    const data = await response.json();

    if (data.html) {
      blogGrig.innerHTML += data.html;
    }

    if (data.loadMore === false) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.dataset.page = parseInt(page) + 1;
    }

    loader.remove();
  });
})();
