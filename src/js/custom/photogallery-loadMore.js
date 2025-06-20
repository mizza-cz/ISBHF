(function () {
  const photogalleryGrid = document.querySelector("#photogallery-grid");
  const loadMoreBtn = document.querySelector(".photogallery-load-more");

  if (!photogalleryGrid || !loadMoreBtn || typeof gallerySource === "undefined")
    return;

  const checkGalleryCount = () => {
    const items = photogalleryGrid.querySelectorAll(".galleryItem");
  };

  checkGalleryCount();

  loadMoreBtn.addEventListener("click", async () => {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loadMoreBtn.prepend(loader);

    const currentPage = parseInt(loadMoreBtn.dataset.page ?? "2", 10);

    const url = gallerySource.includes("?")
      ? `${gallerySource}&page=${currentPage}`
      : `${gallerySource}?page=${currentPage}`;

    window.history.replaceState(null, "", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      });

      loader.remove();

      if (!response.ok) {
        console.error("Chyba při načítání dat:", response.status);
        return;
      }

      const data = await response.json();

      if (data.html) {
        photogalleryGrid.innerHTML += data.html;
      }

      checkGalleryCount();

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
