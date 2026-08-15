const STORAGE_KEY = 'conversationFixed';

const JUMPSCARE_REDIRECT_URL = '/src/html/404pages/diary-404.html';

const DISTORTION_DURATION_MS = 1400;

const DISTORTION_TICK_MS = 70;

const GLITCH_CHARS = '!@#$%^&*<>/\\|~▓▒░';

const DISTORT_TRIGGER_THRESHOLD = 0.1;

const SPEAKER_ALIASES = {
  'speaker-vic': ['Vic23'],
  'speaker-amber': ['ambr051a', 'Amber']
};

const NORMAL_MESSAGES = [
  { speaker: 'Vic23', text: 'Hey are you around?' },
  { speaker: 'Vic23', text: 'Not sure if I’m in the right place' },
  { speaker: 'ambr051a', text: 'So excited for you!!' },
  { speaker: 'Amber', text: 'I promise you won’t have to put up with all that internship bullshit anymore' },
  { speaker: 'Vic23', text: 'I do still want to do journalism but' },
  { speaker: 'Vic23', text: 'Gotta eat lol' },
  { speaker: 'Vic23', text: 'Thank you. I really appreciate you finding me this job' },
  { speaker: 'Amber', text: 'Of course girl, you know I got your back' },
  { speaker: 'Amber', text: 'Always' },
  { speaker: 'Vic23', text: 'Kinda ironic lol, that correspondent job where I did all that human interest crap, they had me cover this exact mall’s grand opening' },
  { speaker: 'Vic23', text: 'Now I’m workin a desk here lol' },
  { speaker: 'Vic23', text: 'Place is way bigger than I remember' },
  { speaker: 'Vic23', text: 'Just a bit weirded out, there’s literally like nobody here' },
  { speaker: 'Amber', text: 'Yeah tbh it’s not a very lively place' },
  { speaker: 'Amber', text: 'but it is very peaceful most of the time' },
  { speaker: 'Vic23', text: 'Okay just kinda worried I was in the wrong place. Codes they sent me let me get into the office and log in on this computer, but there’s literally nobody, no manager, no cleaning staff..' },
  { speaker: 'Vic23', text: 'Place always kinda weirds me out too, back when I covered the opening' },
  { speaker: 'Vic23', text: 'I remember the smell too' },
  { speaker: 'Vic23', text: 'Read some weird shit online about the architect Dorian or whatever' },
  { speaker: 'Vic23', text: 'Like he built it as a shrine for his daughter or something' },
  { speaker: 'Amber', text: 'Tomb' },
  { speaker: 'Amber', text: 'Yeah super weird guy' },
  { speaker: 'Amber', text: 'I heard some stuff too, like he was into some Egyptian mystical junk' },
  { speaker: 'Amber', text: 'Apparently his company Nu Frontiers referred to the Egyptian god Nu who represents cosmic waters or something like that. Very demanding about what materials the builders used' },
  { speaker: 'Amber', text: 'Sounds hella annoying to work for lol' },
  { speaker: 'Vic23', text: 'Yeah no kidding lol' },
  { speaker: 'Vic23', text: 'I hope my supervisor doesn’t make me convert to Egyptology or whatever' },
  { speaker: 'Vic23', text: 'Anyway thanks, I guess I should try and figure out what my new job actually is here lol' },
  { speaker: 'Vic23', text: 'Getting in my own head I guess' },
  { speaker: 'Amber', text: 'I’ve missed you' },
  { speaker: 'Vic23', text: 'Me too' },
  { speaker: 'Amber', text: 'I’m sorry things ended with us how they did' },
  { speaker: 'Amber', text: 'I should have given you explanation for why I was shutting you out' },
  { speaker: 'Vic23', text: '…' },
  { speaker: 'Vic23', text: 'Why are you telling me this four years later?' },
  { speaker: 'Vic23', text: 'You know I would have done anything for you Ams.' },
  { speaker: 'Vic23', text: 'You wouldn’t even let me meet your parents' },
  { speaker: 'Vic23', text: 'I thought you just got bored of us or something' },
  { speaker: 'Amber', text: 'I know, I’m so sorry, but I couldn’t' },
  { speaker: 'Amber', text: 'I love you so much' },
  { speaker: 'Vic23', text: 'Then why??' },
  { speaker: 'Amber', text: 'I got sick' },
  { speaker: 'Vic23', text: 'Sick like how?' },
  { speaker: 'Amber', text: 'Cancer' },
  { speaker: 'Amber', text: 'Spinal. It had metastasized when they found it' },
  { speaker: 'Vic23', text: 'Why the fuck didn’t you tell me?' },
  { speaker: 'Vic23', text: 'Are you okay?' },
  { speaker: 'Vic23', text: 'You know I would have stayed with you' },
  { speaker: 'Amber', text: 'Yes exactly' },
  { speaker: 'Amber', text: 'What we had meant everything to me, but you deserve so much more' },
  { speaker: 'Vic23', text: 'I deserved the truth, Ams' },
  { speaker: 'Vic23', text: 'All those awful years of media internships, I thought you secretly hated me' },
  { speaker: 'Amber', text: 'I’m sorry I pushed you away' },
  { speaker: 'Amber', text: 'I wasn’t thinking straight' },
  { speaker: 'Amber', text: 'My dad overreacted so hard, he had me taking all this weird alternative shit' },
  { speaker: 'Amber', text: 'Like pine needles' },
  { speaker: 'Amber', text: 'Messing with my head, I can think so much more clearly now' },
  { speaker: 'Amber', text: 'Literally had me drinking wood varnish at one point' },
  { speaker: 'Amber', text: 'I didn’t want our relationship to be like that' },
  { speaker: 'Vic23', text: 'Wait he made you drink what?' },
  { speaker: 'Amber', text: 'He wanted to preserve me, keep me stable until the mouth-opening ritual' }
];

const DISTORTABLE_MESSAGES = [
  { speaker: 'Amber', text: 'I don’t think it worked though' },
  { speaker: 'Amber', text: 'I’m not like who I was when we were together' },
  { speaker: 'Vic23', text: 'Wait slow down, you’re scaring me Ams' },
  { speaker: 'Vic23', text: 'What did your dad do to you?' },
  { speaker: 'Amber', text: 'I’m scared too' },
  { speaker: 'Amber', text: 'Dorian wanted to keep me safe forever with this place' },
  { speaker: 'Vic23', text: 'Your dad is Dorian, as in Dorian Stader??' },
  { speaker: 'Amber', text: 'But I think it preserved the cancer too' },
  { speaker: 'Vic23', text: 'Are you okay? Where are you living now?' },
  { speaker: 'Vic23', text: 'Are you back home?' },
  { speaker: 'Amber', text: 'I’m here Vic' },
  { speaker: 'Amber', text: 'I’m okay now' },
  { speaker: 'Amber', text: 'I’m home now that you’re here with me' },
  { speaker: 'Amber', text: 'After you left, I tried to find normality' },
  { speaker: 'Amber', text: 'Dad always wanted me to work for the company, but I couldn’t make myself do it' },
  { speaker: 'Amber', text: 'Couldn’t make myself be subsumed like that' },
  { speaker: 'Amber', text: 'Live in a little box' },
  { speaker: 'Amber', text: 'I don’t have limits like that anymore' },
  { speaker: 'Amber', text: 'I can explore and be who I really am' },
  { speaker: 'Amber', text: 'I felt so lonely for so long' },
  { speaker: 'Amber', text: 'I thought it would be easier for both of us after you went away' },
  { speaker: 'Amber', text: 'But I was wrong' },
  { speaker: 'Amber', text: 'I was so lonely' },
  { speaker: 'Amber', text: 'Maybe I just don’t know when or how to end things' },
  { speaker: 'Amber', text: 'But I’m so happy that you’re here with me now' },
  { speaker: 'Amber', text: 'Maybe some things don’t have to end? :)' },
  { speaker: 'Amber', text: '<3' }
];

function getSpeakerClass(name) {
  for (const [className, aliases] of Object.entries(SPEAKER_ALIASES)) {
    if (aliases.includes(name)) return className;
  }
  return '';
}

function buildMessageElement(msg) {
  const line = document.createElement('p');
  line.className = 'message-line';

  const speakerSpan = document.createElement('span');
  speakerSpan.className = getSpeakerClass(msg.speaker);
  speakerSpan.textContent = `${msg.speaker}: `;

  line.appendChild(speakerSpan);
  line.appendChild(document.createTextNode(msg.text));

  return line;
}

function renderMessages(messages, container) {
  const fragment = document.createDocumentFragment();
  messages.forEach(msg => fragment.appendChild(buildMessageElement(msg)));
  container.appendChild(fragment);
}


function scrambleOnce(zone) {
  const lines = zone.querySelectorAll('.message-line');

  lines.forEach(line => {
    if (!line.dataset.original) {
      line.dataset.original = line.textContent;
    }

    const chars = [...line.dataset.original];
    const scrambled = chars
      .map(char => {
        if (char === ' ') return ' ';
        const shouldScramble = Math.random() < 0.5;
        return shouldScramble
          ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          : char;
      })
      .join('');

    line.textContent = scrambled;
  });
}

function runDistortionThenRedirect(zone, logEl) {
  zone.classList.remove('pre-reveal');
  zone.classList.add('distort-active');
  logEl.classList.add('distort-active-bg');

  const scrambleInterval = setInterval(() => scrambleOnce(zone), DISTORTION_TICK_MS);

  setTimeout(() => {
    clearInterval(scrambleInterval);
    window.location.href = JUMPSCARE_REDIRECT_URL;
  }, DISTORTION_DURATION_MS);
}


function init() {
  const logContainer = document.getElementById('conversationLog');
  const isFixed = localStorage.getItem(STORAGE_KEY) === 'true';

  renderMessages(NORMAL_MESSAGES, logContainer);

  const distortZone = document.createElement('div');
  distortZone.id = 'distortZone';
  logContainer.appendChild(distortZone);

  renderMessages(DISTORTABLE_MESSAGES, distortZone);

  if (isFixed) {
    return;
  }

  distortZone.classList.add('pre-reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(distortZone);
        runDistortionThenRedirect(distortZone, logContainer);
      }
    });
  }, { threshold: DISTORT_TRIGGER_THRESHOLD });

  observer.observe(distortZone);
}

document.addEventListener('DOMContentLoaded', init);