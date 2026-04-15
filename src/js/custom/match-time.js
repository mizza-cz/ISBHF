function parseTimezoneOffsetToMinutes(offsetStr) {
  if (!offsetStr || typeof offsetStr !== "string") return null;

  const match = offsetStr.trim().match(/^([+-])(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [, sign, hours, minutes] = match;
  const totalMinutes = Number(hours) * 60 + Number(minutes);

  return sign === "+" ? totalMinutes : -totalMinutes;
}

function formatUserMatchTime(startDate, venueOffsetStr) {
  if (!startDate || !venueOffsetStr) return "";

  const venueOffsetMinutes = parseTimezoneOffsetToMinutes(venueOffsetStr);
  if (venueOffsetMinutes === null) return "";

  const [datePart, timePart = "00:00:00"] = startDate.trim().split(" ");
  if (!datePart) return "";

  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds = 0] = timePart.split(":").map(Number);

  if (
    [year, month, day, hours, minutes, seconds].some((value) =>
      Number.isNaN(value)
    )
  ) {
    return "";
  }

  const venueLocalAsUtcMs = Date.UTC(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds
  );

  const utcMs = venueLocalAsUtcMs - venueOffsetMinutes * 60 * 1000;
  const matchUtcDate = new Date(utcMs);

  const userOffsetMinutes = -matchUtcDate.getTimezoneOffset();

  if (userOffsetMinutes === venueOffsetMinutes) {
    return "";
  }

  const userTime = matchUtcDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${userTime} in your timezone`;
}

function initLocalizedMatchTimes() {
  const blocks = document.querySelectorAll(".js-user-match-time");

  if (!blocks.length) return;

  blocks.forEach((el) => {
    const startDate = el.dataset.startDate;
    const timezoneDelay = el.dataset.timezoneDelay;
    const localizedTime = formatUserMatchTime(startDate, timezoneDelay);

    if (!localizedTime) {
      el.textContent = "";
      el.hidden = true;
      return;
    }

    el.textContent = localizedTime;
    el.hidden = false;
  });
}

initLocalizedMatchTimes();
