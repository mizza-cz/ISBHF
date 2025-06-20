// $(".videoSlider__inner").slick({
//   slidesToShow: 4,
//   arrows: true,
//   infinite: true,
//   dots: false,
//   nextArrow:
//     ' <button class="matchesLive__btn  matchesLive__btnnext"><img src="images/content/arrow-right.png" alt="right" loading="lazy" /></button>',
//   prevArrow:
//     ' <button class="matchesLive__btn  matchesLive__btnprev"><img src="images/content/arrow-left.png" alt="left" loading="lazy" /></button>',
//   responsive: [
//     { breakpoint: 1340, settings: { slidesToShow: 3 } },
//     { breakpoint: 840, settings: { slidesToShow: 2 } },

//     { breakpoint: 480, settings: { slidesToShow: 1 } },
//   ],
// });
function initSliderIfEnoughSlides() {
  const $slider = $(".videoSlider__inner");

  if ($slider.hasClass("slick-initialized")) {
    $slider.slick("unslick");
  }

  const slideCount = $slider.children().length;
  const width = window.innerWidth;

  let slidesToShow;

  if (width < 480) {
    slidesToShow = 1;
  } else if (width < 840) {
    slidesToShow = 2;
  } else if (width < 1340) {
    slidesToShow = 3;
  } else {
    slidesToShow = 4;
  }

  if (slideCount > slidesToShow) {
    $slider.slick({
      slidesToShow: slidesToShow,
      arrows: true,
      infinite: true,
      dots: false,
      nextArrow:
        ' <button class="matchesLive__btn  matchesLive__btnnext"><img src="images/content/arrow-right.png" alt="right" loading="lazy" /></button>',
      prevArrow:
        ' <button class="matchesLive__btn  matchesLive__btnprev"><img src="images/content/arrow-left.png" alt="left" loading="lazy" /></button>',
      responsive: [
        { breakpoint: 1340, settings: { slidesToShow: 3 } },
        { breakpoint: 840, settings: { slidesToShow: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1 } },
      ],
    });
  }
}

// Инициализация при загрузке
$(document).ready(function () {
  initSliderIfEnoughSlides();
});

// Реинициализация при ресайзе
$(window).on("resize", function () {
  initSliderIfEnoughSlides();
});
