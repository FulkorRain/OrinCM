const CONFIG = {
  companyName: "Prairie Golem Press",
  tagline: "Prairie Golem Press is a boutique publisher dedicated to bringing you the finest in speculative fiction, with a focus on unique voices and unforgettable stories that push the boundaries of imagination.",
  companyInitials: "PGP",
  contactEmail: "orinbishop@gmail.com",

  privacyPolicyUrl: "#privacy",
  termsUrl: "#terms",
  physicalAddress: "123 Main Street, Anytown, USA", // TODO: Change

  emailOctopus: {
    apiKey: "your-emailoctopus-api-key", // TODO: Change
    listId: "your-list-id", // TODO: Change
    tags: [],
    doubleOptIn: true,
  },
};

(function applyConfig() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const href = (id, url) => { const el = document.getElementById(id); if (el) el.href = url; };

  document.title = `${CONFIG.companyName} Newsletter Newsletter`;

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
const alertOk = document.getElementById('alertOk');
const alertErr = document.getElementById('alertErr');
const signupCard = document.getElementById('signupCard');
const successCard = document.getElementById('successCard');

function showError(fieldId, errorId, show) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field || !error) return;

  field.classList.toggle('error', show);
  error.classList.toggle('visible', show);
}

function validateForm() {
  let valid = true;

  const email = document.getElementById('emailInput').value?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('email', 'emailError', true);
    valid = false;
  } else {
    showError('email', 'emailError', false);
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
//   if (!response.success) throw new Error(result.error);
//   return result;
// }

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertOk.classList.remove('visible');
  alertErr.classList.remove('visible');

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
  } catch (err) {
    console.error('Mailchimp error:', err);
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


