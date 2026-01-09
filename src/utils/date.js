export function weekdayNameToNumber(day) {
  if (!day) return null;

  const map = {
    lundi: 1,
    mardi: 2,
    mercredi: 3,
    jeudi: 4,
    vendredi: 5,
    samedi: 6,
    dimanche: 0,
  };

  if (typeof day === "number") return day;

  return map[day.toLowerCase()] ?? null;
}

export function getNextDateForWeekday(weekday) {
  const date = new Date();
  const diff = (weekday + 7 - date.getDay()) % 7;
  date.setDate(date.getDate() + diff);
  return date;
}

export function parseTimeToDate(baseDate, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}
