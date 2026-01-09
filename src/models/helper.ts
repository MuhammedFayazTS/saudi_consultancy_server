export function setVirtualDateFormats(col: Date | undefined | null) {
  if (!col) 
return null;
  const d = new Date(col);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours || 12;
  const strTime = `${String(hours).padStart(2, "0")}.${minutes} ${ampm}`;
  return `${day}/${month}/${year} ${strTime}`;
}