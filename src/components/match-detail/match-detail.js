const allTimelines = document.querySelectorAll(".game__timeline__container");

allTimelines.forEach((container) => {
  const periods = container.querySelectorAll(
    ".game__timeline__period[data-period-seconds]"
  );
  const totalSeconds = Array.from(periods).reduce(
    (sum, p) => sum + parseInt(p.dataset.periodSeconds || 0, 10),
    0
  );

  periods.forEach((period) => {
    const seconds = parseInt(period.dataset.periodSeconds || 0, 10);
    const widthPercent = (seconds / totalSeconds) * 100;
    period.style.flex = `0 0 ${widthPercent}%`;
    period.style.maxWidth = `${widthPercent}%`;
  });

  container.style.display = "flex";
  container.style.width = "100%";
});
