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
