$(".matchesAfter").slick({
  slidesToShow: 4,
  arrows: true,
  infinite: false,
  dots: false,
  nextArrow:
    ' <button class="matchesLive__btn  matchesLive__btnnext"><img src="images/content/arrow-right.png" alt="right" loading="lazy" /></button>',
  prevArrow:
    ' <button class="matchesLive__btn  matchesLive__btnprev"><img src="images/content/arrow-left.png" alt="left" loading="lazy" /></button>',
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 940, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
});
