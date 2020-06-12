export const secondsToHms = d => {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600 % 60);

  if (s < 10) {
    s = '0' + s;
  }

  if (h) {
    return `${h}:${m}:${s}`
  }

  return `${m}:${s}`
};

export default function Time() {
  return {
    secondsToHms
  }
}

