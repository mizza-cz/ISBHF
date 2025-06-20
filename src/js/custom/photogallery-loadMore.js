(function () {
  const photogalleryGrid = document.querySelector("#photogallery-grid");
  const loadMoreBtn = document.querySelector(".photogallery-load-more");

  if (!photogalleryGrid || !loadMoreBtn || typeof gallerySource === "undefined")
    return;

  const checkGalleryCount = () => {
    const items = photogalleryGrid.querySelectorAll(".galleryItem");
    loadMoreBtn.style.display = items.length < 10 ? "none" : "block";
  };

  checkGalleryCount();

  loadMoreBtn.addEventListener("click", async () => {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loadMoreBtn.prepend(loader);

    const currentPage = parseInt(loadMoreBtn.dataset.page ?? 2);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", currentPage);

    const url = new URL(gallerySource, window.location.origin);
    url.search = searchParams.toString();

    const visibleUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", visibleUrl);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
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
  });
})();
