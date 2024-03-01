let timer: HTMLElement;
let min = 0;
let sec = 0;
let increment = true;
let ended = false;
window.onload = function () {
  timer = document.getElementById("timer");
  if (!timer) return;
  increment = timer.getAttribute("data-increment") == "true";
  min = Number(timer.getAttribute("data-min"));
  sec = Number(timer.getAttribute("data-sec"));
  timer.innerText = formatHour(min, sec);

  setInterval(() => {
    if (increment) {
      if (sec < 59) {
        sec++;
      } else {
        sec = 0;
        if (min < 59) {
          min++;
        } else {
          min = 0;
        }
      }
    } else {
      if (!ended) {
        if (sec > 0) {
          sec--;
        } else {
          sec = 59;
          if (min > 0) {
            min--;
          }
        }
        if (min == 0 && sec == 0) ended = true;
      }
    }

    timer.innerText = formatHour(min, sec);
  }, 1000);
};

function formatHour(min, sec) {
  return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}
