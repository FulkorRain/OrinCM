const CONFIG = {
  companyName: "Prairie Golem Press",
  tagline: "Prairie Golem Press is a boutique publisher dedicated to bringing you the finest in speculative fiction, with a focus on unique voices and unforgettable stories that push the boundaries of imagination.",
  companyInitials: "PGP",
  contactEmail: "orinbishop@gmail.com",

  privacyPolicyUrl: "#privacy",
  termsUrl: "#terms",
  physicalAddress: import.meta.env.VITE_PHYSICAL_ADDRESS,

  emailOctopus: {
    apiKey: import.meta.env.VITE_EMAILOCTOPUS_API_KEY,
    listId: import.meta.env.VITE_EMAILOCTOPUS_LIST_ID,
    tags: [],
    doubleOptIn: true,
  },
};

(function applyConfig() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const href = (id, url) => { const el = document.getElementById(id); if (el) el.href = url; };

  document.title = `${CONFIG.companyName} Newsletter`;

  set("logoInitials", CONFIG.companyInitials);
  set("companyName", CONFIG.companyName);
  set("companyTagline", CONFIG.tagline);
  set('consentCompanyName', CONFIG.companyName);
  set("contactEmail", CONFIG.contactEmail);
  set('footerAddress', CONFIG.physicalAddress);

  href("privacyLink", CONFIG.privacyPolicyUrl);
  href("termsLink", CONFIG.termsUrl);
  href('footerPrivacy', CONFIG.privacyPolicyUrl);
  href('footerTerms', CONFIG.termsUrl);
  href('footerContact', `mailto:${CONFIG.contactEmail}`);

  document.getElementById('footerUnsubscribe').href = `mailto:${CONFIG.contactEmail}?subject=Unsubscribe from ${CONFIG.companyName} Newsletter&body=Please unsubscribe me from the ${CONFIG.companyName} newsletter.`;
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
  document.getElementById('consentAge').checked = false;

  document.getElementById('emailError').classList.remove('visible');
  document.getElementById('consentError').classList.remove('visible');
  document.getElementById('privacyError').classList.remove('visible');

  alertOk.classList.remove('visible');
  alertErr.classList.remove('visible');
}

function validateForm() {
  let valid = true;

  const email = document.getElementById('emailInput').value?.trim();
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

//TODO: Change this after launch
async function subscribeToEmailOctopus(data) {
  const { apiKey, listId, tags, doubleOptIn } = CONFIG.emailOctopus;
  const url = `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`;

  const body = {
    api_key: apiKey,
    email_address: data.email,
    status: doubleOptIn ? 'PENDING' : 'SUBSCRIBED',
    fields: {
      FirstName: data.firstName || "",
      LastName: data.lastName || "",
    },
    tags: tags,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (!response.ok) {
    const code = result?.error?.code || '';
    if (code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
      return {success:true, alreadySubscribed: true };
    }

    throw new Error(result.error?.message || 'Subscription failed. Please try again');
  }
  return {success: true};
}

//TODO: switch over for production
// async function subscribeToEmailOctopus(data) {
//   const response = await fetch('/api/subscribe', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   });
//   const result = await response.json();
//   if (!result.success) throw new Error(result.error);
//   return result;
// }

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
  sessionStorage.setItem('lastSubmit', Date.now());
  if (!validateForm()) return;

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
      document.getElementById('successMsg').textContent = "You're already subscribed! Thanks for being part of our community.";
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


