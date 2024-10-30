import dayjs from "dayjs";


export function formatTime(timestamp: number): string {
  const now = dayjs();
  const msgTime = dayjs(timestamp);
  const diffInDays = now.diff(msgTime, "day");

  if (diffInDays === 0) {
    return msgTime.format("HH:mm");
  } else if (diffInDays === 1) {
    return "昨天 " + msgTime.format("HH:mm");
  } else if (diffInDays < 7) {
    return msgTime.format("ddd");
  } else {
    return msgTime.format("YYYY-MM-DD");
  }
}