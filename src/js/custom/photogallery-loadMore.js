// (function () {
//   const photogalleryGrig = document.querySelector("#photogallery-grid");
//   const loadMoreBtn = document.querySelector(".photogallery-load-more");

//   if (!photogalleryGrig || !loadMoreBtn || typeof gallerySource === "undefined")
//     return;

//   loadMoreBtn.addEventListener("click", async () => {
//     const loader = document.createElement("div");
//     loader.classList.add("loader");
//     loadMoreBtn.prepend(loader);

//     const searchParams = new URLSearchParams(window.location.search);
//     const page = loadMoreBtn.dataset.page ?? 2;
//     searchParams.append("page", page);

//     const url = new URL(window.location.origin + gallerySource);

//     url.search = searchParams.toString();

//     const response = await fetch(url, {
//       method: "GET",
//       headers: { Accept: "application/json" },
//     });

//     if (!response.ok) return;

//     const data = await response.json();

//     if (data.html) {
//       photogalleryGrig.innerHTML += data.html;
//     }

//     if (data.loadMore === false) {
//       loadMoreBtn.style.display = "none";
//     } else {
//       loadMoreBtn.dataset.page = parseInt(page) + 1;
//     }

//     loader.remove();
//   });
// })();
(function () {
  const photogalleryGrid = document.querySelector("#photogallery-grid");
  const loadMoreBtn = document.querySelector(".photogallery-load-more");

  if (!photogalleryGrid || !loadMoreBtn || typeof gallerySource === "undefined")
    return;

  const checkGalleryCount = () => {
    const items = photogalleryGrid.querySelectorAll(".galleryItem");
    if (items.length < 10) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  };

  checkGalleryCount();

  loadMoreBtn.addEventListener("click", async () => {
    const currentPage = parseInt(loadMoreBtn.dataset.page ?? 2);

    // Корректная сборка URL
    let ajaxUrl = gallerySource;
    ajaxUrl += gallerySource.includes("?")
      ? `&page=${currentPage}`
      : `?page=${currentPage}`;
    const fullAjaxUrl = new URL(ajaxUrl, window.location.origin);

    // Обновление адреса страницы в браузере
    const updatedUrlParams = new URLSearchParams(window.location.search);
    updatedUrlParams.set("page", currentPage);
    const visibleUrl = `${
      window.location.pathname
    }?${updatedUrlParams.toString()}`;
    window.history.replaceState(null, "", visibleUrl);

    // AJAX-запрос
    const response = await fetch(fullAjaxUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

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
