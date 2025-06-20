// (function () {
//   const blogGrig = document.querySelector("#video-grid");
//   const loadMoreBtn = document.querySelector(".video-load-more");

//   if (!blogGrig || !loadMoreBtn || typeof videoSource === "undefined") return;

//   loadMoreBtn.addEventListener("click", async () => {
//     const loader = document.createElement("div");
//     loader.classList.add("loader");
//     loadMoreBtn.prepend(loader);

//     const searchParams = new URLSearchParams(window.location.search);
//     const page = loadMoreBtn.dataset.page ?? 2;
//     searchParams.append("page", page);

//     const url = new URL(window.location.origin + videoSource);

//     url.search = searchParams.toString();

//     const response = await fetch(url, {
//       method: "GET",
//       headers: { Accept: "application/json" },
//     });

//     if (!response.ok) return;

//     const data = await response.json();

//     if (data.html) {
//       blogGrig.innerHTML += data.html;
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
  const videoGrid = document.querySelector("#video-grid");
  const loadMoreBtn = document.querySelector(".video-load-more");

  if (!videoGrid || !loadMoreBtn || typeof videoSource === "undefined") return;

  const checkVideoCount = () => {
    const items = videoGrid.querySelectorAll(".videoItem");
    if (items.length < 10) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  };

  checkVideoCount();

  loadMoreBtn.addEventListener("click", async () => {
    const currentPage = parseInt(loadMoreBtn.dataset.page ?? 2);

    let ajaxUrl = videoSource;
    ajaxUrl += videoSource.includes("?")
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
