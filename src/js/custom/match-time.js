const blocks = document.querySelectorAll(".s-time[data-is-localized='true']");

blocks.forEach((el) => {
  const dateStr = el.dataset.dateUtc;
  const timeStr = el.dataset.timeUtc;
  const offset = Number(el.dataset.timeoffset || 0);

  if (!dateStr || !timeStr || Number.isNaN(offset)) return;

  const [Y, M, D] = dateStr.split("-").map(Number);
  const [h, m, s = 0] = timeStr.split(":").map(Number);

  const venueLocalAsIfUTC = Date.UTC(Y, M - 1, D, h, m, s);

  const utcMs = venueLocalAsIfUTC - offset * 3600 * 1000;

  const userDate = new Date(utcMs);
  const userTime = userDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  el.textContent = `${userTime} in your timezone`;
});
