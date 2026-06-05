import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const operationalDispatchForm = document.querySelector('.form');

operationalDispatchForm.addEventListener('submit', formSubmissionEvent => {
  formSubmissionEvent.preventDefault();

  const targetFormControls = formSubmissionEvent.currentTarget.elements;
  const extractedMilliDelay = Number(targetFormControls.delay.value);
  const selectedOutcomeBranch = targetFormControls.state.value;

  buildScheduledNotification(extractedMilliDelay, selectedOutcomeBranch)
    .then(resolvedTimeframe => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${resolvedTimeframe}ms`,
        position: 'topRight',
      });
    })
    .catch(rejectedTimeframe => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${rejectedTimeframe}ms`,
        position: 'topRight',
      });
    });

  operationalDispatchForm.reset();
});

function buildScheduledNotification(timerMagnitude, conditionalState) {
  return new Promise((fireResolve, fireReject) => {
    setTimeout(() => {
      if (conditionalState === 'fulfilled') {
        fireResolve(timerMagnitude);
      } else {
        fireReject(timerMagnitude);
      }
    }, timerMagnitude);
  });
}
