 
$(".eventsSlider").each(function () {
  const $slider = $(this);
  const slidesCount = $slider.children("li").length;

  if (slidesCount <= 1) {
    $slider.addClass("eventsSlider--single");
    return;
  }

  $slider.slick({
    slidesToShow: Math.min(3, slidesCount),
    slidesToScroll: 1,
    arrows: slidesCount > 3,
    infinite: false,
    dots: false,

    nextArrow: `
      <button
        type="button"
        class="matchesLive__btn matchesLive__btnnext"
        aria-label="Next slide"
      >
        <img
          src="images/content/arrow-right.png"
          alt=""
          loading="lazy"
        />
      </button>
    `,

    prevArrow: `
      <button
        type="button"
        class="matchesLive__btn matchesLive__btnprev"
        aria-label="Previous slide"
      >
        <img
          src="images/content/arrow-left.png"
          alt=""
          loading="lazy"
        />
      </button>
    `,

    responsive: [
      {
        breakpoint: 840,
        settings: {
          slidesToShow: Math.min(2, slidesCount),
          arrows: slidesCount > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: slidesCount > 1,
        },
      },
    ],
  });
});
