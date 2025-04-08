$(".videoSlider__inner").slick({
  slidesToShow: 4,
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
