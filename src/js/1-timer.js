import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const uiControls = {
  dateInputElement: document.querySelector('#datetime-picker'),
  actionStartBtn: document.querySelector('button[data-start]'),
  daysDisplay: document.querySelector('[data-days]'),
  hoursDisplay: document.querySelector('[data-hours]'),
  minutesDisplay: document.querySelector('[data-minutes]'),
  secondsDisplay: document.querySelector('[data-seconds]'),
};

let targetChronologyLimit = null;
let liveChronometerId = null;

const calendarConfiguration = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const designatedTimestamp = selectedDates[0];

    if (designatedTimestamp < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      uiControls.actionStartBtn.disabled = true;
    } else {
      targetChronologyLimit = designatedTimestamp;
      uiControls.actionStartBtn.disabled = false;
    }
  },
};

flatpickr(uiControls.dateInputElement, calendarConfiguration);

uiControls.actionStartBtn.addEventListener('click', () => {
  uiControls.actionStartBtn.disabled = true;
  uiControls.dateInputElement.disabled = true;

  executeChronometerRefresh();

  liveChronometerId = setInterval(() => {
    executeChronometerRefresh();
  }, 1000);
});

function executeChronometerRefresh() {
  const currentMomentaryTime = new Date();
  const runtimeMilliDelta = targetChronologyLimit - currentMomentaryTime;

  if (runtimeMilliDelta <= 0) {
    clearInterval(liveChronometerId);
    renderTimeMetrics({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // ФІКС: повертаємо інтерфейс у вихідний стан згідно з ТЗ
    uiControls.dateInputElement.disabled = false;
    uiControls.actionStartBtn.disabled = true;

    iziToast.success({
      title: 'Finished',
      message: 'Countdown reached!',
      position: 'topRight',
    });
    return;
  }

  const accurateTimeMatrix = breakDownMilliseconds(runtimeMilliDelta);
  renderTimeMetrics(accurateTimeMatrix);
}

function renderTimeMetrics({ days, hours, minutes, seconds }) {
  uiControls.daysDisplay.textContent = formatWithDoubleDigits(days);
  uiControls.hoursDisplay.textContent = formatWithDoubleDigits(hours);
  uiControls.minutesDisplay.textContent = formatWithDoubleDigits(minutes);
  uiControls.secondsDisplay.textContent = formatWithDoubleDigits(seconds);
}

function formatWithDoubleDigits(numericalValue) {
  return String(numericalValue).padStart(2, '0');
}

function breakDownMilliseconds(ms) {
  const absoluteSecondUnit = 1000;
  const absoluteMinuteUnit = absoluteSecondUnit * 60;
  const absoluteHourUnit = absoluteMinuteUnit * 60;
  const absoluteDayUnit = absoluteHourUnit * 24;

  const days = Math.floor(ms / absoluteDayUnit);
  const hours = Math.floor((ms % absoluteDayUnit) / absoluteHourUnit);
  const minutes = Math.floor(
    ((ms % absoluteDayUnit) % absoluteHourUnit) / absoluteMinuteUnit
  );
  const seconds = Math.floor(
    (((ms % absoluteDayUnit) % absoluteHourUnit) % absoluteMinuteUnit) /
      absoluteSecondUnit
  );

  return { days, hours, minutes, seconds };
}
