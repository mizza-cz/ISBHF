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

    const currentPage = parseInt(loadMoreBtn.dataset.page ?? "2", 10);

    const url = videoSource.includes("?")
      ? `${videoSource}&pageNumber=${currentPage}`
      : `${videoSource}?pageNumber=${currentPage}`;

    window.history.replaceState(null, "", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
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
    } catch (error) {
      console.error("Chyba při fetchu:", error);
      loader.remove();
    }
  });
})();
