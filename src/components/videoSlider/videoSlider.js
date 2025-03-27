$(".videoSlider__inner").slick({
  slidesToShow: 3,
  arrows: true,
  infinite: false,
  dots: false,
  variableWidth: true,
  nextArrow:
    ' <button class="matchesLive__btn  matchesLive__btnnext"><img src="images/content/arrow-right.png" alt="right" loading="lazy" /></button>',
  prevArrow:
    ' <button class="matchesLive__btn  matchesLive__btnprev"><img src="images/content/arrow-left.png" alt="left" loading="lazy" /></button>',
  responsive: [
    { breakpoint: 1100, settings: { slidesToShow: 2 } },
    { breakpoint: 840, settings: { slidesToShow: 2, variableWidth: false } },

    { breakpoint: 480, settings: { slidesToShow: 1, variableWidth: false } },
  ],
});
