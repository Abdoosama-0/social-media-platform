export const formatPostDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffTime = now.getTime() - date.getTime();

  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // format time
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();

  // لو أقل من أسبوع → اسم اليوم
  if (diffDays < 7) {
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    return `${dayName} ${time}`;
  }

  // لو أكتر من أسبوع → تاريخ كامل
  const fullDate = date.toLocaleDateString("en-US");

  return `${time} ${fullDate}`;
};