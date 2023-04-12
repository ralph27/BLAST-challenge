export const getTimeDifference = (t1, t2) => {
  const [hours1, minutes1, seconds1] = t1.split(":").map(Number);
  const [hours2, minutes2, seconds2] = t2.split(":").map(Number);

  const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
  const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;

  const differenceInSeconds = Math.abs(totalSeconds2 - totalSeconds1);

  const hoursDiff = Math.floor(differenceInSeconds / 3600);
  const minutesDiff = Math.floor((differenceInSeconds % 3600) / 60);
  const secondsDiff = differenceInSeconds % 60;

  return `${hoursDiff}:${minutesDiff}:${secondsDiff}`;
};
