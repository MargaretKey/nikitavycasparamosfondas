const copyButtons = document.querySelectorAll('.btn--copy');
const toast = document.querySelector('.toast');

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2200);
};

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const textToCopy = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('Rekvizitai nukopijuoti!');
    } catch (error) {
      console.error('Nepavyko nukopijuoti teksto:', error);
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        showToast('Rekvizitai nukopijuoti!');
      } catch (fallbackError) {
        showToast('Pabandykite nukopijuoti rankiniu būdu.');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  });
});

const goalProgress = document.querySelector('.goal-progress');

if (goalProgress) {
  const parseAmount = (value) => {
    if (value === undefined || value === null) {
      return 0;
    }

    const normalised = String(value)
      .replace(/\u00A0/g, ' ')
      .replace(/[^0-9,.-]/g, '')
      .replace(/\s+/g, '')
      .replace(',', '.');

    const parsed = Number(normalised);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const raised = parseAmount(goalProgress.dataset.raised);
  const goal = parseAmount(goalProgress.dataset.goal);
  const bar = goalProgress.querySelector('.goal-progress__bar');
  const barFill = goalProgress.querySelector('.goal-progress__bar-fill');
  const raisedAmount = goalProgress.querySelector('.goal-progress__amount--raised');
  const goalAmount = goalProgress.querySelector('.goal-progress__amount--goal');
  const status = goalProgress.querySelector('.goal-progress__status');

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('lt-LT', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      })
        .format(value)
        .replace(/\u00A0/g, ' ');
    } catch (error) {
      const rounded = Math.round(value);
      return `${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`;
    }
  };

  const safeGoal = goal > 0 ? goal : Math.max(raised, 1);
  const percent = safeGoal > 0 ? Math.min((raised / safeGoal) * 100, 100) : 0;
  const remaining = Math.max(goal - raised, 0);

  if (raisedAmount) {
    raisedAmount.textContent = formatCurrency(raised);
  }

  if (goalAmount) {
    goalAmount.textContent = formatCurrency(goal);
  }

  if (bar) {
    bar.setAttribute('aria-valuemax', safeGoal);
    bar.setAttribute('aria-valuenow', Math.min(raised, safeGoal));
  }

  if (barFill) {
    barFill.style.width = `${percent}%`;
    barFill.style.setProperty('--goal-progress-width', `${percent}%`);
  }

  if (status) {
    const percentLabel = new Intl.NumberFormat('lt-LT', {
      maximumFractionDigits: 0,
    }).format(percent);
    status.innerHTML = `Surinkta <strong>${percentLabel}%</strong> tikslo. Liko <strong>${formatCurrency(remaining)}</strong>.`;
  }
}
