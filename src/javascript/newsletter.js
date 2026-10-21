const CONFIG = {
  companyName: "Prairie Golem Press",
  contactEmail: "orinbishop@gmail.com",

  privacyPolicyUrl: "#privacy",
  termsUrl: "#terms",
  physicalAddress: import.meta.env.VITE_PHYSICAL_ADDRESS,

  subscribeUrl: "https://us-central1-prairiegolem.cloudfunctions.net/subscribe",
};

(function applyConfig() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const href = (id, url) => { const el = document.getElementById(id); if (el) el.href = url; };

  document.title = `${CONFIG.companyName} Newsletter`;

  set('footerAddress', CONFIG.physicalAddress);

  href("privacyLink", CONFIG.privacyPolicyUrl);
  href("termsLink", CONFIG.termsUrl);
  href('footerPrivacy', CONFIG.privacyPolicyUrl);
  href('footerTerms', CONFIG.termsUrl);
  href('footerContact', `mailto:${CONFIG.contactEmail}`);
  const unsubSubject = encodeURIComponent(`Unsubscribe from ${CONFIG.companyName} Newsletter`);
  const unsubBody = encodeURIComponent(`Please unsubscribe me from the ${CONFIG.companyName} newsletter.`);
  href('footerUnsubscribe', `mailto:${CONFIG.contactEmail}?subject=${unsubSubject}&body=${unsubBody}`);
})();



const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const alertOk = document.getElementById('alertSuccess');
const alertErr = document.getElementById('alertError');
const signupCard = document.getElementById('signupCard');
const successCard = document.getElementById('successCard');

function showError(fieldId, errorId, show) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field || !error) return;

  field.classList.toggle('error', show);
  error.classList.toggle('visible', show);
}

function resetForm() {
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('emailInput').value = '';

  document.getElementById('consentMarketing').checked = false;
  document.getElementById('consentPrivacy').checked = false;

  document.getElementById('emailError').classList.remove('visible');
  document.getElementById('consentError').classList.remove('visible');
  document.getElementById('privacyError').classList.remove('visible');

  alertOk.classList.remove('visible');
  alertErr.classList.remove('visible');
}

function validateForm() {
  let valid = true;

  const email = document.getElementById('emailInput').value?.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    showError('emailInput', 'emailError', true);
    valid = false;
  } else {
    showError('emailInput', 'emailError', false);
  }

  const consentMarketing = form.consentMarketing.checked;
  document.getElementById('consentError').classList.toggle('visible', !consentMarketing);
  if (!consentMarketing) valid = false;

  const consentPrivacy = form.consentPrivacy.checked;
  document.getElementById('privacyError').classList.toggle('visible', !consentPrivacy);
  if (!consentPrivacy) valid = false;

  return valid;
}

async function subscribeToEmailOctopus(data) {
  const response = await fetch(CONFIG.subscribeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Subscribe status', response.status);
  const result = await response.json().catch(() => null);
  console.log('Subscribe response:', result);
  if (!response.ok || !result?.success) {
    throw new Error(result?.error || 'Subscription failed. Please try again');
  }
  return result;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertOk.classList.remove('visible');
  alertErr.classList.remove('visible');

  const lastSubmit = parseInt(sessionStorage.getItem('lastSubmit') || '0');
  if (Date.now() - lastSubmit < 5000) {
    document.getElementById('errorMsg').textContent = 'Please wait a moment before trying again.';
    alertErr.classList.add('visible');
    return;
  }
  if (!validateForm()) return;
  sessionStorage.setItem('lastSubmit', Date.now());

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  const data = {
    email: document.getElementById('emailInput').value?.trim(),
    firstName: document.getElementById('firstName').value?.trim(),
    lastName: document.getElementById('lastName').value?.trim(),
  };

  try {
    const result = await subscribeToEmailOctopus(data);
    if (result.alreadySubscribed) {
      document.getElementById('successText').textContent = "This email is already on our list. If you haven't confirmed yet, check your inbox (and spam folder) for our confirmation email.";
    }
    signupCard.classList.add('hidden');
    successCard.classList.add('visible');
    resetForm();
  } catch (err) {
    console.error('EmailOctopus error:', err);
    document.getElementById('errorMsg').textContent = "An error occurred while subscribing. Please try again later.";
    alertErr.classList.add('visible');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
});

document.getElementById('emailInput').addEventListener('input', () => showError('emailInput', 'emailError', false));
document.getElementById('consentMarketing').addEventListener('change', () => document.getElementById('consentError').classList.remove('visible'));
document.getElementById('consentPrivacy').addEventListener('change', () => document.getElementById('privacyError').classList.remove('visible'));


const backBtn = document.getElementById('backBtn');
if (backBtn) {
  backBtn.addEventListener('click', (e) => {
    if (window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  })
}