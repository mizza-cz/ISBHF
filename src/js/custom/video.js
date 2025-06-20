(function () {
  const videoGrid = document.querySelector("#video-grid");
  const loadMoreBtn = document.querySelector(".video-load-more");

  if (!videoGrid || !loadMoreBtn || typeof videoSource === "undefined") return;

  const checkVideoCount = () => {
    const items = videoGrid.querySelectorAll(".videoItem");
  };

  checkVideoCount();

  loadMoreBtn.addEventListener("click", async () => {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loadMoreBtn.prepend(loader);

    const currentPage = parseInt(loadMoreBtn.dataset.page ?? 2);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", currentPage);

    const url = new URL(videoSource, window.location.origin);
    url.search = searchParams.toString();

    const visibleUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", visibleUrl);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    loader.remove();

    if (!response.ok) {
      console.error("Nepodařilo se načíst data:", response.status);
      return;
    }

    const data = await response.json();

    if (data.html) {
      videoGrid.innerHTML += data.html;
    }

    checkVideoCount();

    if (data.loadMore === false) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.dataset.page = currentPage + 1;
    }
  });
})();
