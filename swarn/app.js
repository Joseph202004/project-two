/* Swarn — connected prototype
 * Built from SWARN_DESIGN_PROMPT_AND_WIREFRAMES.md
 *
 * Service rules enforced throughout:
 *  - Status never communicated by colour alone (every status = icon + text).
 *  - Sent / Accepted / Arrived render only when the matching event has fired.
 *  - No arrival countdowns, progress percentages, survival or outcome claims.
 *  - Medical guidance appears only as a labelled placeholder awaiting clinical review.
 *  - Emergency calling is reachable from every screen of the request journey.
 *  - Practice mode never contacts a responder or places a call.
 *  - All names, addresses and times are fictional prototype content.
 */

/* ------------------------------------------------------------------ icons */
const I = {
  check: '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5"/></svg>',
  clock: '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="8" cy="8" r="6.3"/><path d="M8 4.4V8l2.5 1.6" stroke-linecap="round"/></svg>',
  alert: '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M8 2.2L1.6 13.4h12.8L8 2.2z" stroke-linejoin="round"/><path d="M8 6.6v3M8 11.6v.1"/></svg>',
  info:  '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="8" cy="8" r="6.3"/><path d="M8 7.3v4M8 4.9v.1" stroke-linecap="round"/></svg>',
  dot:   '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="8" cy="8" r="3.4"/></svg>',
  phone: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5.2 1.8c.5-.3 1.1-.1 1.4.4l1.2 2.1c.3.5.2 1.1-.3 1.4l-.9.7c-.2.2-.3.4-.2.7.3 1 1.5 2.2 2.5 2.5.3.1.5 0 .7-.2l.7-.9c.3-.5.9-.6 1.4-.3l2.1 1.2c.5.3.7.9.4 1.4l-.7 1.2c-.4.7-1.2 1.1-2 1C7.4 15.9 1.1 9.6 1 5c0-.8.3-1.6 1-2l1.2-.7z"/></svg>',
  back:  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 3L4.5 8l5 5"/></svg>',
  chev:  '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>',
  home:  '<svg width="19" height="19" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M3.4 9L11 3.2 18.6 9v9a1 1 0 01-1 1h-13a1 1 0 01-1-1V9z"/></svg>',
  learn: '<svg width="19" height="19" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M3 4.6h6a2.4 2.4 0 012.4 2.4v11A2 2 0 009.4 17H3V4.6zM19 4.6h-6A2.4 2.4 0 0010.6 7v11A2 2 0 0112.6 17H19V4.6z"/></svg>',
  act:   '<svg width="19" height="19" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11h4l2.2-5 3.4 10 2.2-5H19"/></svg>',
  prof:  '<svg width="19" height="19" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="7.4" r="3.5"/><path d="M4.2 18.4a6.8 6.8 0 0113.6 0"/></svg>',
  avail: '<svg width="19" height="19" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7.6"/><path d="M11 6.6V11l3 2"/></svg>',
  req:   '<svg width="19" height="19" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.6h14M4 11h14M4 16.4h9"/></svg>'
};

/* ------------------------------------------------------------------ state */
const FRESH = () => ({
  lang: 'English',
  signedIn: false,
  practice: false,
  tab: 'Home',
  rtab: 'Availability',
  ctab: 'Overview',
  who: 'Me',
  incident: {
    stage: 'none',              // none | searching | assigned | arrived | closed
    address: '12 Nehru Road, Sector 4',
    entrance: '',
    sentAt: '18:42',
    updatedAt: '18:42',
    responder: null,
    accessDelivery: null,       // null | Confirmed | Pending | Failed
    professional: 'Not confirmed'
  },
  responder: { available: false, verificationValid: true, assignment: null, arrivedAt: null },
  modal: null,
  toast: null
});
let S = FRESH();

const RESPONDER = { name: 'A. Fernandes', role: 'Verified first-aid responder', initials: 'AF' };

/* ------------------------------------------------------------- components */
const st = (kind, label) => {
  const ic = { ok: I.check, wait: I.clock, stop: I.alert, info: I.info }[kind] || I.dot;
  return `<span class="status status--${kind}">${ic}<span>${label}</span></span>`;
};
const banner = (kind, title, text) => {
  const ic = { warn: I.alert, stop: I.alert, ok: I.check, info: I.info }[kind] || I.info;
  return `<div class="banner banner--${kind}">${ic}<div><b>${title}</b>${text || ''}</div></div>`;
};
const btn = (label, o = {}) => {
  const cls = ['btn', o.variant ? 'btn--' + o.variant : '', o.row ? 'btn--row' : '', o.cls || ''].join(' ');
  const attr = [o.go ? `data-go="${o.go}"` : '', o.act ? `data-act="${o.act}"` : '',
                o.arg ? `data-arg="${o.arg}"` : '', o.disabled ? 'disabled' : ''].join(' ');
  const lead = o.icon ? o.icon : '';
  const tail = o.chev ? `<span class="chev">${I.chev}</span>` : '';
  return `<button type="button" class="${cls}" ${attr}>${lead}<span>${label}</span>${tail}</button>`;
};
const callBtn = (label = 'Call emergency services') =>
  btn(label, { variant: 'emergency', icon: I.phone, act: 'call' });
const field = (label, ph, hint) => `<div class="field"><label>${label}</label>
  <input class="input" placeholder="${ph}" aria-label="${label}" />
  ${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
const area = (label, ph, hint) => `<div class="field"><label>${label}</label>
  <textarea class="textarea" placeholder="${ph}" aria-label="${label}"></textarea>
  ${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
const kv = (k, v) => `<div class="kv"><span>${k}</span><strong>${v}</strong></div>`;
const map = (pin, caption, tall) => `<div class="map ${tall ? 'tall' : ''}" role="img"
  aria-label="Prototype map placeholder. ${pin}">
  <div class="pin"><span>${pin}</span><i></i></div>
  <div class="caption">${caption || 'Illustrative map — not live data'}</div></div>`;
const clinical = (text) => `<div class="placeholder"><span class="tag">Awaiting clinical review</span>
  <p>${text}</p><p class="fine" style="margin:0">Placeholder for professionally approved guidance.
  No treatment instructions are generated by this prototype.</p></div>`;
const tl = (state, title, meta) =>
  `<div class="tl ${state}"><span class="dot">${state === 'done' ? I.check : ''}</span>
   <div class="tx"><b>${title}</b><span>${meta}</span></div></div>`;
const choice = (label, checked, act, arg) =>
  `<button type="button" role="radio" class="choice" aria-checked="${checked}"
    data-act="${act}" data-arg="${arg}"><span class="dot"></span>${label}</button>`;
const toggleRow = (name, desc, on, id) => `<div class="toggle"><div class="tx"><b>${name}</b><span>${desc}</span></div>
  <button type="button" class="switch" role="switch" aria-checked="${on}" data-act="flip" data-arg="${id}">
  ${on ? I.check + 'On' : 'Off'}</button></div>`;

const tabbar = (active) => `<nav class="tabbar" aria-label="Main">
  ${[['Home', I.home, 'U04'], ['Learn', I.learn, 'U13'], ['Activity', I.act, 'U16'], ['Profile', I.prof, 'U17']]
    .map(([n, ic, go]) => `<button type="button" data-go="${go}" aria-current="${active === n}">${ic}${n}</button>`).join('')}
</nav>`;
const rtabbar = (active) => `<nav class="tabbar" aria-label="Responder">
  ${[['Availability', I.avail, 'R03'], ['Requests', I.req, 'R04'], ['Activity', I.act, 'R09a'], ['Profile', I.prof, 'R09b']]
    .map(([n, ic, go]) => `<button type="button" data-go="${go}" aria-current="${active === n}">${ic}${n}</button>`).join('')}
</nav>`;

const appbar = (title, sub, right) => `<header class="appbar">
  <div class="title">${title}${sub ? `<span class="sub">${sub}</span>` : ''}</div>${right || ''}</header>`;
const backbar = (title, go, right) => `<header class="appbar">
  <button type="button" class="backlink" data-go="${go}">${I.back}${title}</button>${right || ''}</header>`;

/* active-incident return card, shown when navigation is otherwise available */
const returnCard = () => {
  if (S.incident.stage === 'none' || S.incident.stage === 'closed') return '';
  const dest = { searching: 'U06', assigned: 'U07', arrived: 'U10' }[S.incident.stage];
  return `<div class="card" style="border-color:var(--accent-line); background:var(--accent-soft)">
    <span class="k">Active request</span>
    <h4>You have a community request in progress</h4>
    ${st(S.incident.stage === 'searching' ? 'wait' : 'info',
        S.incident.stage === 'searching' ? 'No responder accepted yet' :
        S.incident.stage === 'assigned' ? 'Responder travelling to scene' : 'Responder arrived')}
    ${btn('Return to active request', { variant: 'primary', go: dest })}</div>`;
};

/* ------------------------------------------------------------------ screens */
const SCREENS = {};
const def = (id, o) => { SCREENS[id] = Object.assign({ id, kind: 'mobile' }, o); };

/* ============================ FIRST USE ============================ */
def('U01', {
  group: 'Public — first use', title: 'Language selection',
  note: 'Emergency help bypasses onboarding entirely. Languages listed match the pilot community.',
  render: () => `${appbar('<span class="wordmark">SWARN</span>')}
  <div class="body">
    <h2 class="sec">Choose your language</h2>
    <div role="radiogroup" aria-label="Language" style="display:flex;flex-direction:column;gap:8px">
      ${['English', 'हिन्दी (Hindi)', 'मराठी (Marathi)'].map(l =>
        `<button type="button" role="radio" class="choice" style="justify-content:flex-start"
          aria-checked="${S.lang === l}" data-act="lang" data-arg="${l}"><span class="dot"></span>${l}</button>`).join('')}
    </div>
    ${btn('Continue', { variant: 'primary', go: 'U02' })}
    <div class="divider"></div>
    ${callBtn('Emergency help')}
    <p class="fine">Emergency help works without choosing a language or creating an account.</p>
  </div>`
});

def('U02', {
  group: 'Public — first use', title: 'Introduction',
  note: 'One introduction screen, not a carousel. Community response and professional services are named as separate things.',
  render: () => `${appbar('<span class="wordmark">SWARN</span>', null,
    `<button class="iconbtn" data-go="U04">Skip</button>`)}
  <div class="body">
    <h2 class="sec">Help your community respond</h2>
    <p class="lead">Request nearby trained support and connect with emergency services.</p>
    <div class="card">
      ${['Request help', 'Follow response updates', 'Prepare before emergencies']
        .map(t => `<div style="display:flex;gap:10px;align-items:center;font-size:14px">${I.check}${t}</div>`).join('')}
    </div>
    ${btn('Continue without account', { variant: 'primary', go: 'U04' })}
    ${btn('Sign in / Create account', { go: 'U03' })}
    ${banner('info', 'Professional emergency services remain a separate response.',
      'Swarn does not dispatch ambulances and does not replace emergency services.')}
  </div>`
});

def('U03', {
  group: 'Public — first use', title: 'Optional sign-in',
  note: 'Sign-in never blocks emergency access. Accounts only persist training records and profile.',
  render: () => `${backbar('Sign in', 'U02')}
  <div class="body">
    <p class="lead">Save your training and profile. An account is optional.</p>
    <div class="field"><label>Phone number</label>
      <div style="display:flex;gap:8px">
        <select class="select" style="width:104px" aria-label="Country code"><option>+91</option><option>+44</option></select>
        <input class="input" placeholder="Number" aria-label="Phone number" />
      </div></div>
    ${btn('Send verification code', { variant: 'primary', go: 'U03b' })}
    ${btn('Continue without account', { variant: 'quiet', go: 'U04' })}
    <div class="divider"></div>
    ${btn('Privacy notice', { variant: 'quiet', row: true, chev: true, go: 'U20b' })}
  </div>`
});

def('U03b', {
  group: 'Public — first use', title: 'Verification code',
  note: 'Companion to U03: code entry, resend, incorrect-code error, and change-number path.',
  render: () => `${backbar('Verification', 'U03')}
  <div class="body">
    <h2 class="sec">Enter the 6-digit code</h2>
    <p class="lead">Sent to +91 ••••• 40218.</p>
    <input class="input" style="letter-spacing:.5em;font-size:20px;text-align:center" placeholder="——————" aria-label="Verification code" />
    ${banner('stop', 'That code was not correct.', 'Check the code and try again, or request a new one.')}
    ${btn('Verify and continue', { variant: 'primary', act: 'signin' })}
    ${btn('Resend code', { variant: 'quiet' })}
    ${btn('Change number', { variant: 'quiet', go: 'U03' })}
    ${btn('Continue without account', { variant: 'quiet', go: 'U04' })}
  </div>`
});

/* ============================ REQUEST HELP ============================ */
def('U04', {
  group: 'Public — request help', title: 'Public home',
  note: 'One obvious primary action. When an incident is active, preparedness content is replaced by a Return to active request card.',
  render: () => `${appbar('<span class="wordmark">SWARN</span>',
    'Community: Sector 4 pilot area', `<button class="iconbtn" data-go="U01">Language</button>`)}
  <div class="body">
    ${returnCard()}
    <h2 class="sec">Need emergency help?</h2>
    ${callBtn('CALL EMERGENCY SERVICES')}
    ${btn('REQUEST NEARBY RESPONDER', { variant: 'primary', go: 'U05' })}
    ${banner('info', 'Nearby responders provide community assistance.',
      'They are trained volunteers, not professional emergency services.')}
    ${S.incident.stage === 'none' || S.incident.stage === 'closed' ? `
      <h3 class="sub">Prepare before an emergency</h3>
      ${btn('Find training', { row: true, chev: true, go: 'U14' })}
      ${btn('Try a practice scenario', { row: true, chev: true, go: 'U15' })}` : ''}
  </div>
  ${tabbar('Home')}`
});

def('U05', {
  group: 'Public — request help', title: 'Location and minimal details',
  note: 'Progressive disclosure, no symptom questionnaire, no registration. Witnesses are never asked to diagnose — "I am not sure" is a first-class answer.',
  render: () => `${backbar('Request nearby help', 'U04')}
  ${S.practice ? '' : ''}
  <div class="body tight">
    ${callBtn('Call emergency services')}
    <h3 class="sub">Where is help needed?</h3>
    ${map('Scene pin — drag to adjust', 'Editable pin · illustrative map')}
    <input class="input" value="${S.incident.address}" aria-label="Detected address" />
    ${btn('Change or enter address manually', { variant: 'quiet' })}
    ${field('Entrance, floor or landmark', 'Optional — e.g. blue gate, 2nd floor')}
    <h3 class="sub">Who needs help?</h3>
    <div class="choicerow" role="radiogroup" aria-label="Who needs help">
      ${choice('Me', S.who === 'Me', 'who', 'Me')}${choice('Someone else', S.who === 'Someone else', 'who', 'Someone else')}
    </div>
    <h3 class="sub">What happened?</h3>
    ${area('Brief description', 'In your own words — optional')}
    ${btn('I am not sure', { variant: 'quiet' })}
    ${field('Contact for this incident', 'Callback number')}
    ${banner('info', 'Location and incident details are shared with assigned responders and coordinators.',
      'Nothing is shared with other nearby users.')}
    ${btn('SEND REQUEST', { variant: 'primary', act: 'send' })}
  </div>`
});

def('U06', {
  group: 'Public — request help', title: 'Searching for a responder',
  note: 'No countdown, no progress percentage, no guarantee. Only the Sent event is confirmed, so only Sent is shown.',
  render: () => `${appbar('Active request', 'Community request')}
  <div class="body">
    ${st('ok', 'Request sent 18:42')}
    <h2 class="sec">Looking for an available responder</h2>
    ${st('wait', 'No responder has accepted yet')}
    <div class="card"><span class="k">Scene</span>
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
        <strong style="font-size:14px">${S.incident.address}</strong>
        ${btn('Edit', { variant: 'sm', go: 'U09' })}</div></div>
    <div class="card">
      <span class="k">Professional emergency services</span>
      ${st('stop', 'Dispatch status not confirmed')}
      <p class="fine">Swarn has not contacted emergency services for you. Calling opens your phone dialler; it does not confirm ambulance dispatch.</p>
      ${callBtn('Call emergency services')}
    </div>
    ${btn('Support while waiting', { row: true, chev: true, go: 'U08' })}
    ${btn('Add access information', { row: true, chev: true, go: 'U09' })}
    ${btn('Cancel community request', { variant: 'danger-ghost', act: 'askCancel' })}
    <div class="divider"></div>
    <p class="fine">Prototype controls: ${btn('Simulate responder accepting', { variant: 'sm', act: 'accept' })}
      ${btn('Simulate no responder', { variant: 'sm', go: 'X05' })}</p>
  </div>`
});

def('U07', {
  group: 'Public — request help', title: 'Responder assigned',
  note: 'Accepted is shown only because an acceptance event fired. Any estimate is labelled an estimate and carries its update time.',
  render: () => `${appbar('Active request', 'Community request')}
  <div class="body">
    ${st('ok', 'A responder has accepted')}
    <div class="card">
      <div style="display:flex;gap:12px;align-items:center">
        <span class="avatar">${RESPONDER.initials}</span>
        <div class="tx"><b style="font-size:15.5px">${RESPONDER.name}</b>
        <span style="font-size:12.5px;color:var(--text-3)">${RESPONDER.role}</span></div>
      </div>
      <div class="divider"></div>
      ${kv('Qualification', 'Community first aid (verified)')}
      ${kv('Status', 'Travelling to scene')}
      ${kv('Last confirmed update', '18:46')}
      ${banner('info', 'Community responder — not an ambulance.', 'Arrival time is not guaranteed and is not estimated by this prototype.')}
    </div>
    ${map('Approximate progress', 'Approximate area only · updated 18:46')}
    ${btn('Contact responder', { variant: 'primary', go: 'U09' })}
    ${btn('Add entrance details', { row: true, chev: true, go: 'U09' })}
    ${btn('Support while waiting', { row: true, chev: true, go: 'U08' })}
    ${callBtn('Call emergency services')}
    ${btn('Request details', { variant: 'quiet', row: true, chev: true, go: 'U16' })}
    <div class="divider"></div>
    <p class="fine">Prototype controls: ${btn('Responder marks arrived', { variant: 'sm', act: 'arrive' })}
      ${btn('Responder withdraws', { variant: 'sm', go: 'X06' })}</p>
  </div>`
});

def('U08', {
  group: 'Public — request help', title: 'Support while waiting',
  note: 'No invented CPR, medication, diagnosis or treatment text. One item at a time, with read-aloud and text options.',
  render: () => `${backbar('Active request', 'U07')}
  <div class="body">
    <h2 class="sec">Support while waiting</h2>
    ${btn('Connect to emergency service', { variant: 'emergency', icon: I.phone, act: 'call' })}
    ${clinical('Approved guidance for this situation will appear here, one clear step at a time, in the language you selected.')}
    <div class="btnrow">${btn('Read aloud', { variant: 'quiet' })}${btn('Text display', { variant: 'quiet' })}</div>
    <div class="card"><span class="k">Responder</span>
      ${S.incident.stage === 'assigned' ? st('info', 'Travelling to scene — updated 18:46')
        : S.incident.stage === 'arrived' ? st('ok', 'Arrived 18:51') : st('wait', 'No responder accepted yet')}</div>
    ${btn('Return to request', { variant: 'primary', go: S.incident.stage === 'arrived' ? 'U10' : S.incident.stage === 'assigned' ? 'U07' : 'U06' })}
  </div>`
});

def('U09', {
  group: 'Public — request help', title: 'Contact and access details',
  note: 'Focused coordination rather than a chat interface. Delivery of each update is explicitly confirmed, pending or failed.',
  render: () => `${backbar('Contact responder', S.incident.stage === 'arrived' ? 'U10' : S.incident.stage === 'assigned' ? 'U07' : 'U06')}
  <div class="body">
    ${S.incident.stage === 'searching'
      ? banner('warn', 'No responder is assigned yet.', 'Access details you add now will be shared as soon as someone accepts.')
      : `<div class="card"><div style="display:flex;gap:11px;align-items:center">
          <span class="avatar">${RESPONDER.initials}</span>
          <div class="tx"><b>${RESPONDER.name}</b><span>${RESPONDER.role}</span></div></div>
          ${btn('Call responder', { variant: 'primary', icon: I.phone, act: 'call' })}</div>`}
    <h3 class="sub">Quick access information</h3>
    ${field('Entrance / gate', 'e.g. Blue gate on Nehru Road')}
    ${field('Floor / room', 'e.g. 2nd floor, flat 204')}
    ${field('Landmark', 'e.g. opposite the pharmacy')}
    ${btn('SEND UPDATE', { variant: 'primary', act: 'sendAccess' })}
    <div class="card flat"><span class="k">Delivery</span>
      ${S.incident.accessDelivery === 'Confirmed' ? st('ok', 'Confirmed — delivered 18:48')
        : S.incident.accessDelivery === 'Failed' ? st('stop', 'Failed — not delivered')
        : S.incident.accessDelivery === 'Pending' ? st('wait', 'Pending — not yet confirmed')
        : st('info', 'No update sent yet')}
      ${S.incident.accessDelivery === 'Failed' ? btn('Retry — your text is saved', { variant: 'sm', act: 'sendAccess' }) : ''}
    </div>
    ${callBtn('Call emergency services')}
  </div>`
});

def('U10', {
  group: 'Public — request help', title: 'Responder arrived',
  note: 'Community arrival does not imply professional arrival — professional handover stays explicitly "not yet recorded".',
  render: () => `${appbar('Active request', 'Community request')}
  <div class="body">
    ${st('ok', 'Responder marked Arrived')}
    <div class="card">
      <div style="display:flex;gap:11px;align-items:center">
        <span class="avatar">${RESPONDER.initials}</span>
        <div class="tx"><b>${RESPONDER.name}</b><span>${RESPONDER.role}</span></div></div>
      ${kv('Location', S.incident.address)}
      ${kv('Reported at', '18:51')}
      ${btn('View responder identification', { variant: 'quiet', row: true, chev: true })}
      ${btn('I cannot find the responder', { variant: 'quiet', row: true, chev: true, go: 'X07' })}
    </div>
    ${btn('Add relevant information', { row: true, chev: true, go: 'U09' })}
    ${callBtn('Call emergency services')}
    <div class="card"><span class="k">Professional handover</span>
      ${st('wait', 'Not yet recorded')}
      <p class="fine">A community responder arriving does not mean emergency services have arrived.</p></div>
    <div class="divider"></div>
    <p class="fine">Prototype control: ${btn('Close community response', { variant: 'sm', act: 'close' })}</p>
  </div>`
});

def('U11', {
  group: 'Public — request help', title: 'Community response closed',
  note: 'Describes the community response only, never a medical outcome. No celebratory messaging.',
  render: () => `${appbar('Response update')}
  <div class="body">
    ${st('info', 'Community response closed')}
    <h2 class="sec">Community response closed</h2>
    <div class="card">
      ${kv('Reason', 'Handover to emergency services')}
      ${kv('Recorded by', 'Community responder')}
      ${kv('Time', '19:04')}
    </div>
    ${banner('info', 'This describes the community response, not the patient&rsquo;s medical outcome.',
      'Swarn does not record or report clinical results.')}
    ${btn('View incident summary', { variant: 'primary', go: 'U16' })}
    ${btn('Give feedback', { go: 'U12' })}
    ${btn('Give feedback later', { variant: 'quiet', go: 'U04' })}
    ${btn('Return home', { variant: 'quiet', go: 'U04' })}
  </div>`
});

def('U12', {
  group: 'Public — request help', title: 'Feedback',
  note: 'Optional, skippable, completable later. Asks about clarity and problems — never about clinical outcome.',
  render: () => `${backbar('Feedback', 'U11', `<button class="iconbtn" data-go="U04">Skip</button>`)}
  <div class="body">
    <h3 class="sub">Was it clear what to do next?</h3>
    <div class="choicerow" role="radiogroup" aria-label="Was it clear what to do next">
      ${choice('Yes', false, 'noop', '1')}${choice('Partly', false, 'noop', '2')}${choice('No', false, 'noop', '3')}
    </div>
    <h3 class="sub">Did you encounter a problem?</h3>
    <div class="choicerow">
      ${['Communication', 'Location', 'Response updates', 'Other'].map(t =>
        `<button type="button" class="pill" aria-pressed="false" data-act="noop">${t}</button>`).join('')}
    </div>
    ${area('Comments', 'Optional')}
    ${btn('Submit feedback', { variant: 'primary', act: 'feedback' })}
    ${btn('Report a service concern', { variant: 'quiet', row: true, chev: true })}
  </div>`
});

/* ============================ PREPAREDNESS & PROFILE ============================ */
def('U13', {
  group: 'Public — prepare & profile', title: 'Learn',
  render: () => `${appbar('Learn')}
  <div class="body">
    ${returnCard()}
    <h2 class="sec">Prepare with your community</h2>
    ${btn('Local training sessions', { row: true, chev: true, go: 'U14' })}
    ${btn('Practice using Swarn', { row: true, chev: true, go: 'U15' })}
    ${btn('Responder programme', { row: true, chev: true, go: 'R01' })}
    <h3 class="sub">My training</h3>
    <div class="empty">No upcoming sessions.<br />Registered sessions will appear here.</div>
  </div>
  ${tabbar('Learn')}`
});

def('U14', {
  group: 'Public — prepare & profile', title: 'Training detail',
  note: 'Includes registration confirmation, full-session, cancellation and no-local-session states.',
  render: () => `${backbar('Training session', 'U13')}
  <div class="body">
    <h2 class="sec">Community first aid — basics</h2>
    <div class="card">
      ${kv('Provider', 'Sector 4 Health Trust')}
      ${kv('Date and time', 'Sat 27 Sep, 10:00–13:00')}
      ${kv('Location', 'Community Hall, Nehru Road')}
      ${kv('Language', 'English and Hindi')}
      ${kv('Cost', 'Free')}
      ${kv('Accessibility', 'Step-free access; seating provided')}
    </div>
    <h3 class="sub">What the session covers</h3>
    <p class="lead">An introduction to recognising an emergency, calling for help, and safe bystander actions. Delivered by the provider, not by Swarn.</p>
    ${btn('REGISTER', { variant: 'primary', act: 'register' })}
    ${banner('warn', 'Sessions can fill up.', 'If the session is full you can join the waiting list; you will be told either way.')}
    <div class="divider"></div>
    <h3 class="sub">Other states</h3>
    ${btn('Show: no local sessions', { variant: 'sm', go: 'U14b' })}
  </div>`
});

def('U14b', {
  group: 'Public — prepare & profile', title: 'Training — empty state',
  note: 'No-local-session state. Never implies training is unavailable everywhere.',
  render: () => `${backbar('Training sessions', 'U13')}
  <div class="body">
    <div class="empty">No sessions are currently scheduled in Sector 4.</div>
    ${banner('info', 'This covers the pilot area only.', 'Other providers may run sessions nearby.')}
    ${btn('Notify me when a session is scheduled', { variant: 'primary' })}
    ${btn('Try a practice scenario instead', { go: 'U15' })}
  </div>`
});

def('U15', {
  group: 'Public — prepare & profile', title: 'Practice mode',
  note: 'Persistent PRACTICE label on every reused screen. No real alerts, no real calls, no responder contacted.',
  render: () => `${backbar('Practice', 'U13')}
  <div class="body">
    <h2 class="sec">Try requesting help</h2>
    <p class="lead">Explore a fictional situation. No responder will be contacted and no call will be placed.</p>
    ${banner('warn', 'Practice mode is clearly labelled at all times.', 'A banner stays on screen so practice can never be mistaken for a real request.')}
    ${btn('Start practice', { variant: 'primary', act: 'practiceOn' })}
    ${btn('Exit practice', { variant: 'quiet', act: 'practiceOff' })}
  </div>`
});

def('U16', {
  group: 'Public — prepare & profile', title: 'Activity',
  note: 'Limits sensitive detail in the list; includes an empty state.',
  render: () => `${appbar('Activity')}
  <div class="body">
    ${returnCard()}
    <h3 class="sub">Previous community requests</h3>
    ${S.incident.stage === 'closed' ? `
      <button type="button" class="listitem" data-go="U11"><div class="tx">
        <b>18 Sep · Handover to emergency services</b><span>View summary</span></div>
        <span class="chev">${I.chev}</span></button>` : ''}
    <button type="button" class="listitem" data-go="U11"><div class="tx">
      <b>2 Aug · No responder available</b><span>View summary</span></div><span class="chev">${I.chev}</span></button>
    ${S.incident.stage === 'none' ? `<div class="empty">Requests you make will be listed here.</div>` : ''}
    <p class="fine">Summaries describe the community response only. Medical details are not stored here.</p>
  </div>
  ${tabbar('Activity')}`
});

def('U17', {
  group: 'Public — prepare & profile', title: 'Profile',
  note: 'Responder mode appears only for approved, eligible users.',
  render: () => `${appbar('Profile')}
  <div class="body tight">
    ${returnCard()}
    <div class="card"><div style="display:flex;gap:11px;align-items:center">
      <span class="avatar">${S.signedIn ? 'RS' : '?'}</span>
      <div class="tx"><b>${S.signedIn ? 'R. Sharma' : 'Guest'}</b>
      <span>${S.signedIn ? 'Signed in' : 'Not signed in — emergency access still works'}</span></div></div>
      ${S.signedIn ? '' : btn('Sign in', { variant: 'sm', go: 'U03' })}</div>
    ${btn('Emergency information', { row: true, chev: true, go: 'U18' })}
    ${btn('Trusted contacts', { row: true, chev: true, go: 'U19' })}
    ${btn('Language and accessibility', { row: true, chev: true, go: 'U20a' })}
    ${btn('Privacy and permissions', { row: true, chev: true, go: 'U20b' })}
    ${btn('Help and service concerns', { row: true, chev: true })}
    <div class="divider"></div>
    ${btn('Apply to become a responder', { go: 'R01' })}
    ${S.responder.verificationValid ? btn('Switch to responder mode', { variant: 'primary', go: 'R03' }) : ''}
    <p class="fine">Responder mode is shown only to approved responders.</p>
  </div>
  ${tabbar('Profile')}`
});

def('U18', {
  group: 'Public — prepare & profile', title: 'Optional emergency information',
  note: 'Secondary feature, never required, never automatically exposed to all nearby volunteers.',
  render: () => `${backbar('Emergency information', 'U17')}
  <div class="body tight">
    ${banner('info', 'All of this is optional.', 'You can request help without filling in anything here.')}
    <p class="fine">Last updated: not yet saved</p>
    ${field('Name', 'Optional')}
    ${field('Allergies', 'Optional')}
    ${field('Current medications', 'Optional')}
    ${field('Relevant conditions', 'Optional')}
    ${banner('warn', 'Information is self-reported.', 'It is not verified by a clinician and may be incomplete.')}
    ${btn('Who can access this?', { variant: 'quiet', row: true, chev: true })}
    ${btn('Sharing preferences', { variant: 'quiet', row: true, chev: true })}
    ${btn('Save', { variant: 'primary' })}
    ${btn('Delete emergency information', { variant: 'danger-ghost' })}
  </div>`
});

def('U19', {
  group: 'Public — prepare & profile', title: 'Trusted contacts',
  render: () => `${backbar('Trusted contacts', 'U17')}
  <div class="body tight">
    <button type="button" class="listitem"><div class="tx"><b>M. Sharma</b><span>Sister</span></div>
      ${btn('Edit', { variant: 'sm' })}${btn('Remove', { variant: 'sm' })}</button>
    ${btn('Add contact', { go: 'U19' })}
    <h3 class="sub">Incident notifications</h3>
    <div class="card">
      ${toggleRow('When a request is sent', 'Contact is told a request was made.', true, 'n1')}
      ${toggleRow('When a responder accepts', 'Contact is told someone is coming.', false, 'n2')}
    </div>
    ${banner('info', 'What is shared', 'Contacts receive the time and status of your request. They do not receive medical details or your live location.')}
    ${btn('Save preferences', { variant: 'primary' })}
  </div>`
});

def('U20a', {
  group: 'Public — prepare & profile', title: 'Language and accessibility',
  note: 'U20 expands into two screens. This one: language, text size, audio support, reduced motion.',
  render: () => `${backbar('Language and accessibility', 'U17')}
  <div class="body tight">
    <div class="card">
      <div class="toggle"><div class="tx"><b>App language</b><span>Used for all screens and read-aloud.</span></div>
        <select class="select" style="width:130px" aria-label="App language"><option>English</option><option>हिन्दी</option><option>मराठी</option></select></div>
      <div class="divider"></div>
      <div class="toggle"><div class="tx"><b>Text size</b><span>Larger text reflows; nothing is cut off.</span></div>
        <select class="select" style="width:118px" aria-label="Text size"><option>Default</option><option>Large</option><option>Largest</option></select></div>
      <div class="divider"></div>
      ${toggleRow('Read aloud support', 'Screens and guidance can be spoken.', true, 'a1')}
      <div class="divider"></div>
      ${toggleRow('Reduce motion', 'Removes movement and transitions.', S.motion === true, 'a2')}
      <div class="divider"></div>
      ${toggleRow('High contrast text', 'Increases contrast against backgrounds.', false, 'a3')}
    </div>
    ${banner('info', 'Status is never shown by colour alone.', 'Every status in Swarn carries an icon and a written label.')}
  </div>`
});

def('U20b', {
  group: 'Public — prepare & profile', title: 'Privacy and permissions',
  note: 'U20 expands into two screens. This one: location permission, emergency-profile access, notifications, deletion requests.',
  render: () => `${backbar('Privacy and permissions', 'U17')}
  <div class="body tight">
    <div class="card"><span class="k">Location</span>
      <p class="fine">Location is used to place your scene pin and to find nearby responders while a request is active. You can always enter an address by hand.</p>
      ${toggleRow('Share location while requesting', 'Only during an active request.', true, 'p1')}</div>
    <div class="card"><span class="k">Emergency information access</span>
      <p class="fine">Shared only with a responder assigned to your request and with coordinators. Never with all nearby volunteers.</p>
      ${toggleRow('Share with assigned responder', 'Applies to this device.', false, 'p2')}</div>
    <div class="card"><span class="k">Notifications</span>
      ${toggleRow('Response updates', 'Status changes for your request.', true, 'p3')}
      ${toggleRow('Training reminders', 'Sessions you registered for.', false, 'p4')}</div>
    ${btn('Request account and data deletion', { variant: 'danger-ghost' })}
    ${btn('Read the full privacy notice', { variant: 'quiet', row: true, chev: true })}
  </div>`
});

/* ============================ RESPONDER MODE ============================ */
def('R01', {
  group: 'Responder mode', title: 'Responder application',
  render: () => `${backbar('Responder application', 'U17')}
  <div class="body tight">
    <h2 class="sec">Join the community programme</h2>
    ${field('Personal details', 'Full name')}
    ${field('Relevant qualification', 'e.g. Basic first aid')}
    ${field('Issuing organization', 'Who issued it')}
    ${field('Expiry date, if applicable', 'DD / MM / YYYY')}
    ${btn('Upload verification evidence', { row: true, chev: true })}
    ${btn('Read responsibilities', { variant: 'quiet', row: true, chev: true })}
    ${banner('info', 'Applications are reviewed by a coordinator.', 'You cannot receive requests until verification is complete.')}
    ${btn('Submit application', { variant: 'primary', go: 'R02' })}
  </div>`
});

def('R02', {
  group: 'Responder mode', title: 'Verification status',
  note: 'Pending applicants cannot receive operational requests — stated plainly, not implied.',
  render: () => `${appbar('Application status')}
  <div class="body">
    ${st('wait', 'Pending review')}
    <h2 class="sec">Your application is being reviewed</h2>
    <p class="lead">A coordinator checks your qualification and issuing organization. This usually takes a few days.</p>
    ${banner('warn', 'You cannot receive requests yet.', 'Availability stays switched off until your application is approved.')}
    <div class="card"><span class="k">Other application states</span>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${st('info', 'More information needed — upload a clearer certificate')}
        ${st('ok', 'Approved — availability unlocked')}
        ${st('stop', 'Not approved — reason given, reapplication possible')}
      </div></div>
    ${btn('Contact programme support', { row: true, chev: true })}
    ${btn('Return to public mode', { variant: 'quiet', go: 'U17' })}
    <div class="divider"></div>
    <p class="fine">Prototype control: ${btn('Approve this application', { variant: 'sm', go: 'R03' })}</p>
  </div>`
});

def('R03', {
  group: 'Responder mode', title: 'Responder home',
  note: 'Availability is blocked when required verification expires. Location use is explained where it is switched on.',
  render: () => `${appbar('<span class="wordmark">SWARN</span> · Responder', 'Sector 4 pilot area',
    `<button class="iconbtn" data-go="U17">Public mode</button>`)}
  <div class="body">
    <div class="card">
      <span class="k">Availability</span>
      ${S.responder.verificationValid ? `
        <div class="choicerow" role="radiogroup" aria-label="Availability">
          ${choice('Unavailable', !S.responder.available, 'avail', 'off')}
          ${choice('Available', S.responder.available, 'avail', 'on')}
        </div>
        ${S.responder.available ? st('ok', 'Available — you may receive requests') : st('info', 'Unavailable — you will not receive requests')}
        <p class="fine">While available, your approximate location is used to match you to nearby requests. It is not shown to the public.</p>`
        : banner('stop', 'Availability is disabled.', 'Your first-aid certification has expired. Renew it to receive requests again.')}
    </div>
    <div class="card">
      ${kv('Area', 'Sector 4 pilot area')}
      ${kv('Qualification', S.responder.verificationValid ? 'Verified — expires 12 Mar 2026' : 'Expired 2 Sep 2025')}
    </div>
    ${S.responder.assignment ? `<div class="card" style="border-color:var(--accent-line);background:var(--accent-soft)">
        <span class="k">Active assignment</span><h4>Incident INC-4821</h4>
        ${btn('Open assignment', { variant: 'primary', go: 'R05' })}</div>` : ''}
    <div class="card"><span class="k">Programme notice</span>
      <p class="fine">Refresher session for Sector 4 responders on 27 Sep. Verification renewal opens 60 days before expiry.</p></div>
    <div class="divider"></div>
    <p class="fine">Prototype controls: ${btn('Send an invitation', { variant: 'sm', go: 'R04' })}
      ${btn('Expire verification', { variant: 'sm', act: 'expire' })}</p>
  </div>
  ${rtabbar('Availability')}`
});

def('R04', {
  group: 'Responder mode', title: 'Incident invitation',
  note: 'Minimal information before assignment: approximate area only, and everything is labelled caller-reported.',
  render: () => `${appbar('Nearby request')}
  <div class="body">
    ${st('wait', 'Awaiting your response')}
    <h2 class="sec">Nearby request</h2>
    <div class="card">
      ${kv('Approximate area', 'Nehru Road, Sector 4')}
      ${kv('Distance', 'About 600 m')}
      ${kv('Requested', '18:42')}
      <div class="divider"></div>
      <span class="k">Reported situation</span>
      <p class="lead" style="font-size:13.5px">&ldquo;Someone collapsed near the market gate. I am not sure what happened.&rdquo;</p>
      ${banner('warn', 'Information is caller-reported.', 'It has not been verified and may be incomplete or inaccurate.')}
    </div>
    ${btn('ACCEPT REQUEST', { variant: 'primary', act: 'rAccept' })}
    ${btn('Decline', { variant: 'quiet', go: 'R03' })}
    <p class="fine">The exact address is shared only after you accept.</p>
  </div>
  ${rtabbar('Requests')}`
});

def('R05', {
  group: 'Responder mode', title: 'Assigned incident',
  note: '"Unable to continue" triggers reassignment and updates the requester — it is never a silent exit.',
  render: () => `${appbar('Assigned incident', 'INC-4821')}
  <div class="body">
    ${st('info', 'Assigned — travelling to scene')}
    ${map('Scene', 'Exact location · illustrative map')}
    <div class="card">
      ${kv('Address', S.incident.address)}
      ${kv('Entrance', 'Blue gate on Nehru Road')}
      ${btn('Open navigation', { row: true, chev: true })}
      ${btn('Contact caller', { row: true, chev: true, icon: I.phone })}
    </div>
    ${btn('Reported situation', { variant: 'quiet', row: true, chev: true, go: 'R04' })}
    <div class="card"><span class="k">Professional response status</span>
      ${st('stop', 'Unknown — not confirmed to Swarn')}
      <p class="fine">Swarn has no confirmed information about ambulance dispatch for this incident.</p></div>
    ${btn('I HAVE ARRIVED', { variant: 'primary', act: 'rArrive' })}
    ${btn('Unable to continue', { variant: 'danger-ghost', act: 'unable' })}
  </div>`
});

def('R06', {
  group: 'Responder mode', title: 'On-scene coordination',
  note: 'Documentation must never take priority over care — entry is minimal and can be completed later.',
  render: () => `${appbar('At the scene', 'INC-4821')}
  <div class="body">
    ${st('ok', 'Arrived 18:51')}
    ${banner('info', 'Record only what you can safely record.', 'Documentation can be completed after the response. It never takes priority over care.')}
    <div class="btnrow">
      ${btn('Contact professional service', { icon: I.phone })}
      ${btn('Contact coordinator', { icon: I.phone })}
    </div>
    <h3 class="sub">Incident observations</h3>
    ${btn('Add observation', { row: true, chev: true })}
    ${btn('Record action and time', { row: true, chev: true })}
    <div class="card flat">
      ${tl('done', 'Arrived at scene', '18:51 · recorded by you')}
      ${tl('done', 'Observation added', '18:54 · recorded by you')}
    </div>
    ${btn('Authorized patient information', { variant: 'quiet', row: true, chev: true })}
    ${btn('PREPARE HANDOVER', { variant: 'primary', go: 'R07' })}
  </div>`
});

def('R07', {
  group: 'Responder mode', title: 'Handover summary',
  note: 'Firsthand observations are separated from caller reports. Missing information is listed, never filled in.',
  render: () => `${backbar('Handover summary', 'R06')}
  <div class="body tight">
    <div class="card">
      ${kv('Incident reported', '18:42')}
      ${kv('Responder arrived', '18:51')}
    </div>
    <div class="card"><span class="k">Caller-reported information</span>
      <p class="fine">&ldquo;Someone collapsed near the market gate. Not sure what happened.&rdquo; — reported by caller, 18:42.</p></div>
    <div class="card"><span class="k">Responder observations (firsthand)</span>
      <p class="fine">18:54 — person responsive and seated, breathing without difficulty. Recorded by ${RESPONDER.name}.</p></div>
    <div class="card"><span class="k">Recorded actions</span>
      <p class="fine">18:52 — stayed with person and kept area clear.<br />18:56 — called for professional support.</p></div>
    ${banner('warn', 'Missing information', 'Time of collapse · whether the person has been unwell today · any medication taken.')}
    ${banner('info', 'No clinical values are generated.', 'This prototype never invents vital signs or clinical measurements.')}
    <div class="btnrow">${btn('Show summary', {})}${btn('Record handover', { variant: 'primary', go: 'R08' })}</div>
  </div>`
});

def('R08', {
  group: 'Responder mode', title: 'Close participation',
  note: 'Closing participation records the community response only — never a medical outcome.',
  render: () => `${appbar('Close participation', 'INC-4821')}
  <div class="body">
    <h3 class="sub">What happened?</h3>
    <div role="radiogroup" aria-label="What happened" style="display:flex;flex-direction:column;gap:8px">
      ${['Handover completed', 'Cancelled by coordinator', 'Unable to complete response', 'Other'].map((t, i) =>
        `<button type="button" role="radio" class="choice" style="justify-content:flex-start"
          aria-checked="${i === 0}" data-act="noop"><span class="dot"></span>${t}</button>`).join('')}
    </div>
    ${area('Relevant details', 'Optional')}
    ${banner('info', 'This does not record a medical outcome.', 'Swarn records participation in the community response only.')}
    ${btn('Confirm', { variant: 'primary', act: 'rClose' })}
    ${btn('Report an issue', { variant: 'quiet', row: true, chev: true })}
    ${btn('Access volunteer support', { variant: 'quiet', row: true, chev: true })}
  </div>`
});

def('R09a', {
  group: 'Responder mode', title: 'Responder activity',
  render: () => `${appbar('Activity', 'Responder mode')}
  <div class="body">
    <h3 class="sub">Past assignments</h3>
    <button type="button" class="listitem" data-go="R07"><div class="tx">
      <b>INC-4821 · 18 Sep</b><span>Handover completed · your summary</span></div><span class="chev">${I.chev}</span></button>
    <button type="button" class="listitem"><div class="tx">
      <b>INC-4688 · 2 Sep</b><span>Stood down before arrival</span></div><span class="chev">${I.chev}</span></button>
    <div class="divider"></div>
    ${btn('Submit a correction to a summary', { variant: 'quiet', row: true, chev: true })}
    ${btn('Report a concern', { variant: 'quiet', row: true, chev: true })}
    <p class="fine">You can see the summaries you recorded. You cannot see other responders&rsquo; records.</p>
  </div>
  ${rtabbar('Activity')}`
});

def('R09b', {
  group: 'Responder mode', title: 'Responder profile',
  render: () => `${appbar('Profile', 'Responder mode')}
  <div class="body tight">
    <div class="card"><div style="display:flex;gap:11px;align-items:center">
      <span class="avatar">${RESPONDER.initials}</span>
      <div class="tx"><b>${RESPONDER.name}</b><span>${RESPONDER.role}</span></div></div>
      ${S.responder.verificationValid ? st('ok', 'Verification valid') : st('stop', 'Verification expired')}</div>
    <div class="card">
      ${kv('Qualification documents', '2 on file')}
      ${kv('Expiry', S.responder.verificationValid ? '12 Mar 2026' : 'Expired 2 Sep 2025')}
      ${btn('Renew verification', { variant: 'sm', go: 'X10' })}
    </div>
    ${btn('Training sessions', { row: true, chev: true, go: 'U13' })}
    ${btn('Notification preferences', { row: true, chev: true })}
    ${btn('Programme support', { row: true, chev: true })}
    <div class="divider"></div>
    ${btn('Switch to public mode', { variant: 'quiet', go: 'U04' })}
  </div>
  ${rtabbar('Profile')}`
});

/* ============================ COORDINATOR DASHBOARD ============================ */
const deskShell = (activeNav, content) => `
  <header class="deskbar"><span class="wordmark">SWARN</span>
    <span style="font-size:13px;color:var(--text-2)">Coordinator · Sector 4 pilot area</span>
    <span class="grow"></span>
    <span class="proto-tag">Sample data</span>
    <button class="iconbtn">Account</button></header>
  <div class="desk-layout">
    <nav class="desknav" aria-label="Coordinator sections">
      ${[['Overview', 'C01'], ['Incidents', 'C02'], ['Responders', 'C03'], ['Coverage', 'C04'], ['Reviews', 'C05'], ['Settings', 'C01']]
        .map(([n, go]) => `<button type="button" data-go="${go}" aria-current="${activeNav === n}">${n}</button>`).join('')}
    </nav>
    <div class="deskbody">${content}</div>
  </div>`;

def('C01', {
  group: 'Coordinator dashboard', kind: 'desktop', title: 'Overview',
  note: 'No lives-saved metrics or responder performance scores. A data-freshness indicator makes staleness visible.',
  render: () => deskShell('Overview', `
    <div>
      <h2 class="sec" style="margin-bottom:9px">Requests needing attention</h2>
      <div class="filterrow">
        <button class="pill" aria-pressed="true">Unaccepted (2)</button>
        <button class="pill" aria-pressed="false">Assignment issue (1)</button>
        <button class="pill" aria-pressed="false">Other (0)</button>
      </div>
    </div>
    <div class="card" style="padding:0">
      <table class="tbl"><caption class="sr">Active incidents</caption>
        <thead><tr><th>ID</th><th>Area</th><th>Status</th><th>Assigned</th><th>Last update</th><th></th></tr></thead>
        <tbody>
          <tr><td><strong>INC-4821</strong></td><td>Nehru Road</td><td>${st('ok', 'Responder arrived')}</td>
            <td>${RESPONDER.name}</td><td>18:51</td><td>${btn('Open', { variant: 'sm', go: 'C02' })}</td></tr>
          <tr><td><strong>INC-4823</strong></td><td>Market gate</td><td>${st('wait', 'No responder accepted')}</td>
            <td>—</td><td>18:47</td><td>${btn('Open', { variant: 'sm', go: 'C02' })}</td></tr>
          <tr><td><strong>INC-4824</strong></td><td>Sector 4 east</td><td>${st('stop', 'Responder withdrew')}</td>
            <td>Reassigning</td><td>18:44</td><td>${btn('Open', { variant: 'sm', go: 'C02' })}</td></tr>
          <tr><td><strong>INC-4825</strong></td><td>Nehru Road</td><td>${st('info', 'Possible duplicate')}</td>
            <td>—</td><td>18:43</td><td>${btn('Review', { variant: 'sm', go: 'X08' })}</td></tr>
        </tbody></table>
    </div>
    <div class="freshness">${I.check}<span>Connected · incident data last refreshed 18:52. Times shown are last confirmed updates, not live positions.</span></div>`)
});

def('C02', {
  group: 'Coordinator dashboard', kind: 'desktop', title: 'Incident detail',
  note: 'Every timeline entry carries its source and time. Professional response status is shown as confirmed or unknown — never assumed.',
  render: () => deskShell('Incidents', `
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <button class="iconbtn" data-go="C01">${I.back} Incidents</button>
      <h2 class="sec" style="margin:0">INC-4821</h2>
      ${st('ok', 'Responder arrived')}
    </div>
    <div class="deskcols wide-right">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><span class="k">Location and access</span>
          ${map('Scene', 'Illustrative map · not live tracking', true)}
          ${kv('Address', S.incident.address)}
          ${kv('Entrance', 'Blue gate on Nehru Road')}</div>
        <div class="card"><span class="k">Caller contact</span>
          ${kv('Callback number', '+91 ••••• 40218')}
          ${btn('Call caller', { variant: 'sm', icon: I.phone })}</div>
        <div class="card"><span class="k">Assigned responder</span>
          ${kv('Name', RESPONDER.name)}
          ${kv('Verified role', 'Community first aid')}
          ${btn('Contact responder', { variant: 'sm', icon: I.phone })}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><span class="k">Event timeline</span>
          <div class="timeline">
            ${tl('done', 'Request received', '18:42 · caller')}
            ${tl('done', 'Responder assigned', '18:46 · ' + RESPONDER.name + ' accepted')}
            ${tl('done', 'Access details updated', '18:48 · caller · delivery confirmed')}
            ${tl('done', 'Responder marked arrived', '18:51 · responder')}
            ${tl('pend', 'Handover / closure', 'Not yet recorded')}
          </div>
          ${area('Add coordination note', 'Note — your name and the time are recorded with it')}
          ${btn('Add note', { variant: 'sm' })}</div>
        <div class="card"><span class="k">Professional response status</span>
          ${st('stop', 'Unknown — no confirmed source')}
          <p class="fine">No integration with emergency services dispatch is in place for this pilot. Status must not be inferred from the caller placing a call.</p></div>
      </div>
    </div>
    <div class="btnrow" style="max-width:640px">
      ${btn('Manage assignment', {})}${btn('Resolve duplicate', { go: 'X08' })}${btn('Close with reason', { variant: 'primary', act: 'coordClose' })}
    </div>`)
});

def('C03', {
  group: 'Coordinator dashboard', kind: 'desktop', title: 'Responder verification',
  note: 'Every decision records a reason and a reviewer.',
  render: () => deskShell('Responders', `
    <h2 class="sec" style="margin:0">Responder applications</h2>
    <div class="deskcols">
      <div class="card">
        <div class="filterrow">
          <button class="pill" aria-pressed="true">Pending (3)</button>
          <button class="pill" aria-pressed="false">Needs information (1)</button>
          <button class="pill" aria-pressed="false">Expiring (2)</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
          ${[['A. Fernandes', 'Community first aid · submitted 12 Sep'],
             ['P. Iyer', 'First responder · submitted 14 Sep'],
             ['S. Khan', 'Nursing assistant · submitted 16 Sep']].map(([n, m], i) =>
            `<button type="button" class="listitem" style="${i === 0 ? 'border-color:var(--accent-line);background:var(--accent-soft)' : ''}">
              <span class="avatar">${n.split(' ')[1][0]}</span>
              <div class="tx"><b>${n}</b><span>${m}</span></div></button>`).join('')}
        </div>
      </div>
      <div class="card">
        <span class="k">Selected applicant</span>
        <h4>A. Fernandes</h4>
        ${kv('Identity', 'Verified against programme record')}
        ${kv('Qualification', 'Community first aid')}
        ${kv('Issuing organization', 'Sector 4 Health Trust')}
        ${kv('Expiry', '12 Mar 2026')}
        <div class="divider"></div>
        <span class="k">Evidence documents</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${btn('Certificate.pdf', { variant: 'sm' })}${btn('ID confirmation.pdf', { variant: 'sm' })}</div>
        <div class="divider"></div>
        <span class="k">Verification history</span>
        <p class="fine">14 Sep — application received.<br />15 Sep — organization confirmed certificate by email.</p>
        ${area('Reason for decision', 'Recorded with your name and the time')}
        <div class="btnrow">${btn('Request information', {})}${btn('Do not approve', { variant: 'danger-ghost' })}${btn('Approve', { variant: 'primary' })}</div>
      </div>
    </div>`)
});

def('C04', {
  group: 'Coordinator dashboard', kind: 'desktop', title: 'Coverage and availability',
  note: 'Coverage limitations are labelled. Exact responder locations are not exposed beyond operational necessity.',
  render: () => deskShell('Coverage', `
    <div style="display:flex;align-items:center;gap:12px">
      <h2 class="sec" style="margin:0">Coverage</h2><span class="grow" style="flex:1"></span>
      <select class="select" style="width:210px" aria-label="Area filter"><option>Sector 4 pilot area</option><option>Sector 4 east</option></select>
    </div>
    <div class="deskcols">
      <div class="card"><span class="k">Supported area</span>
        ${map('Sector 4 pilot area', 'Approximate coverage · illustrative', true)}
        ${banner('warn', 'Coverage limitations', 'Sector 4 east has had no available responder since 16:00. Requests there should be handled as no-coverage.')}</div>
      <div class="card"><span class="k">Available verified responders</span>
        <table class="tbl"><thead><tr><th>Responder</th><th>Role</th><th>Area</th><th>Updated</th></tr></thead>
          <tbody>
            <tr><td>A. Fernandes</td><td>First aid</td><td>Nehru Road</td><td>18:50</td></tr>
            <tr><td>P. Iyer</td><td>First responder</td><td>Market gate</td><td>18:47</td></tr>
          </tbody></table>
        <p class="fine">Areas are approximate. Exact responder locations are not displayed.</p>
        <div class="divider"></div>
        <span class="k">Verification issues</span>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            ${st('stop', 'S. Khan — certification expired')}${btn('Open record', { variant: 'sm', go: 'C03' })}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            ${st('wait', 'P. Iyer — expires in 21 days')}${btn('Open record', { variant: 'sm', go: 'C03' })}</div>
        </div></div>
    </div>`)
});

def('C05', {
  group: 'Coordinator dashboard', kind: 'desktop', title: 'Incident review',
  note: 'Review captures service issues and a named follow-up owner — not clinical judgement.',
  render: () => deskShell('Reviews', `
    <div style="display:flex;align-items:center;gap:12px">
      <button class="iconbtn" data-go="C01">${I.back} Overview</button>
      <h2 class="sec" style="margin:0">Review incident INC-4821</h2></div>
    <div class="card"><span class="k">Recorded timeline</span>
      <div class="timeline">
        ${tl('done', 'Request received', '18:42 · caller')}
        ${tl('done', 'Responder assigned', '18:46 · responder accepted')}
        ${tl('done', 'Responder arrived', '18:51 · responder')}
        ${tl('done', 'Handover recorded', '19:04 · responder')}
        ${tl('done', 'Community response closed', '19:04 · coordinator')}
      </div></div>
    <div class="deskcols">
      <div class="card"><span class="k">Requester feedback</span>
        <p class="fine">&ldquo;Partly clear. I did not understand whether an ambulance had been called.&rdquo;</p>
        ${st('info', 'Reported problem: response updates')}</div>
      <div class="card"><span class="k">Responder feedback</span>
        <p class="fine">&ldquo;Entrance details arrived late. Gate was locked on arrival.&rdquo;</p>
        ${st('info', 'Reported problem: location and access')}</div>
    </div>
    <div class="card"><span class="k">Identified service issue</span>
      <div class="deskcols">
        <div class="field"><label>Category</label>
          <select class="select" aria-label="Category"><option>Clarity of professional dispatch status</option>
            <option>Access information timing</option><option>Assignment delay</option></select></div>
        <div class="field"><label>Follow-up owner</label>
          <select class="select" aria-label="Follow-up owner"><option>Programme lead</option><option>Design team</option></select></div>
      </div>
      ${area('Notes', 'What will change, and how it will be checked')}
      <div class="filterrow"><span class="k" style="margin-right:4px">Status</span>
        <button class="pill" aria-pressed="true">Open</button>
        <button class="pill" aria-pressed="false">In progress</button>
        <button class="pill" aria-pressed="false">Resolved</button></div>
      ${btn('Save review', { variant: 'primary', cls: 'btn--sm' })}
    </div>`)
});

/* ============================ EXCEPTION STATES ============================ */
const exc = (id, title, note, body, kind) => def(id, { group: 'Exception states', title, note, kind: kind || 'mobile', render: body });

exc('X01', 'Location permission denied',
  'Manual address and map-pin entry remain fully available — permission is never a dead end.',
  () => `${backbar('Request nearby help', 'U04')}
  <div class="body">
    ${banner('warn', 'Swarn cannot access your location.', 'You can still request help by entering the address yourself.')}
    ${map('Tap to place the pin', 'Manual pin placement')}
    ${field('Address', 'Street, area, city')}
    ${field('Entrance, floor or landmark', 'Optional')}
    ${btn('Continue with this address', { variant: 'primary', go: 'U05' })}
    ${btn('Open device location settings', { variant: 'quiet' })}
    ${callBtn('Call emergency services')}
  </div>`);

exc('X02', 'Outside supported community',
  'Explains that community response is unavailable here, and keeps emergency calling prominent.',
  () => `${backbar('Request nearby help', 'U04')}
  <div class="body">
    ${st('stop', 'Community response unavailable here')}
    <h2 class="sec">Swarn does not operate in this area yet</h2>
    <p class="lead">The pilot currently covers Sector 4 only. No community responder can be assigned at this location.</p>
    ${callBtn('CALL EMERGENCY SERVICES')}
    ${banner('info', 'Emergency services are unaffected.', 'They serve this area regardless of whether Swarn operates here.')}
    ${btn('Check covered areas', { variant: 'quiet', row: true, chev: true })}
    ${btn('Return home', { variant: 'quiet', go: 'U04' })}
  </div>`);

exc('X03', 'Request not sent',
  'Says plainly that it was not delivered — never leaves a failed request looking sent.',
  () => `${appbar('Request not sent')}
  <div class="body">
    ${st('stop', 'Not delivered')}
    <h2 class="sec">Your request was not sent</h2>
    <p class="lead">No responder has been contacted. Your details have been kept so you can try again.</p>
    ${btn('Try again', { variant: 'primary', act: 'send' })}
    ${callBtn('CALL EMERGENCY SERVICES')}
    ${btn('Edit request details', { variant: 'quiet', go: 'U05' })}
  </div>`);

exc('X04', 'Connection lost after sending',
  'Shows the last confirmed status and its time. Progress is never invented while offline.',
  () => `${appbar('Active request', 'Connection lost')}
  <div class="body">
    ${banner('warn', 'You are offline.', 'Status cannot be updated until the connection returns.')}
    <div class="card"><span class="k">Last confirmed status</span>
      ${st('ok', 'Request sent')}
      ${kv('Last confirmed update', '18:42')}
      <p class="fine">Anything that happened after this time is unknown. Swarn will not guess.</p></div>
    ${callBtn('Call emergency services')}
    ${btn('Retry connection', { variant: 'primary' })}
    ${btn('View request details', { variant: 'quiet', go: 'U06' })}
  </div>`);

exc('X05', 'No responder accepted',
  'States it clearly and keeps professional emergency contact in reach. No false hope, no fake retry countdown.',
  () => `${appbar('Active request')}
  <div class="body">
    ${st('stop', 'No responder has accepted')}
    <h2 class="sec">Community assistance is not confirmed</h2>
    <p class="lead">No available responder has accepted your request in Sector 4.</p>
    ${callBtn('CALL EMERGENCY SERVICES')}
    <div class="card">${kv('Last confirmed update', '18:47')}
      ${btn('View current request status', { go: 'U06' })}</div>
    ${btn('Keep the request open', { variant: 'quiet' })}
    ${btn('Cancel community request', { variant: 'danger-ghost', act: 'askCancel' })}
  </div>`);

exc('X06', 'Responder withdraws',
  'Stale arrival information is removed immediately and reassignment status is explained.',
  () => `${appbar('Active request', 'Assignment changed')}
  <div class="body">
    ${st('stop', 'Your assigned responder withdrew')}
    ${banner('warn', 'Previous arrival information no longer applies.', 'It has been removed so it cannot be mistaken for current status.')}
    <div class="card"><span class="k">Current status</span>
      ${st('wait', 'Looking for another responder')}
      ${kv('Last confirmed update', '18:49')}
      <p class="fine">A coordinator has been notified. There is no guarantee another responder is available.</p></div>
    ${callBtn('CALL EMERGENCY SERVICES')}
    ${btn('View request status', { go: 'U06' })}
  </div>`);

exc('X07', 'Cannot find responder',
  'Offers contact and a location correction rather than leaving the requester stuck.',
  () => `${backbar('Active request', 'U10')}
  <div class="body">
    <h2 class="sec">Cannot find the responder?</h2>
    ${btn('Call responder', { variant: 'primary', icon: I.phone, act: 'call' })}
    ${btn('Correct the location or entrance', { row: true, chev: true, go: 'U09' })}
    <div class="card"><span class="k">Responder identification</span>
      <div style="display:flex;gap:11px;align-items:center">
        <span class="avatar">${RESPONDER.initials}</span>
        <div class="tx"><b>${RESPONDER.name}</b><span>${RESPONDER.role} · ID SW-2291</span></div></div>
      <p class="fine">Verified responders can show this identifier on request.</p></div>
    ${callBtn('Call emergency services')}
    ${btn('Report a problem with this response', { variant: 'quiet', row: true, chev: true })}
  </div>`);

exc('X08', 'Possible duplicate (coordinator)',
  'A coordinator reviews and links records. Nothing is silently discarded.', () => deskShell('Incidents', `
    <div style="display:flex;align-items:center;gap:12px">
      <button class="iconbtn" data-go="C01">${I.back} Overview</button>
      <h2 class="sec" style="margin:0">Possible duplicate</h2>${st('info', 'Needs review')}</div>
    ${banner('info', 'Two requests may describe the same incident.',
      'Neither record is deleted. Linking preserves both and keeps one active response.')}
    <div class="deskcols">
      ${[['INC-4823', '18:43', 'Market gate', 'Caller A'], ['INC-4825', '18:45', 'Market gate (60 m away)', 'Caller B']]
        .map(([id, t, loc, c]) => `<div class="card"><span class="k">${id}</span>
          ${kv('Received', t)}${kv('Location', loc)}${kv('Reported by', c)}
          <p class="fine">&ldquo;Someone collapsed near the market gate.&rdquo;</p></div>`).join('')}
    </div>
    ${area('Reason for the decision', 'Recorded with your name and the time')}
    <div class="btnrow" style="max-width:620px">
      ${btn('Keep both as separate incidents', {})}
      ${btn('Link as duplicate', { variant: 'primary' })}
    </div>
    <p class="fine">Both callers are told what happened to their request.</p>`), 'desktop');

exc('X09', 'Accidental request — cancellation',
  'Confirms cancellation, notifies assigned responders, and states that it does not cancel any separate emergency call.',
  () => `${appbar('Active request')}
  <div class="body"><p class="lead">The cancellation dialog is shown over the active request.</p>
    ${btn('Show cancellation dialog', { variant: 'primary', act: 'askCancel' })}
    ${btn('Open active request', { variant: 'quiet', go: 'U06' })}</div>
  <div class="scrim"><div class="modal" role="dialog" aria-modal="true" aria-label="Cancel community request">
    <h4>Cancel community request?</h4>
    <p class="fine">Assigned responders will be notified. This does not cancel any separate emergency call you have made.</p>
    ${btn('Keep request active', { variant: 'primary', go: 'U06' })}
    ${btn('Cancel community request', { variant: 'danger-ghost', act: 'confirmCancel' })}
  </div></div>`);

exc('X10', 'Verification expired (responder)',
  'Availability is disabled and renewal steps are shown. The responder is never left guessing why.',
  () => `${backbar('Verification', 'R09b')}
  <div class="body">
    ${st('stop', 'Verification expired 2 Sep 2025')}
    <h2 class="sec">Availability is switched off</h2>
    <p class="lead">You cannot receive requests until your first-aid certification is renewed and verified.</p>
    ${banner('warn', 'This is not a suspension.', 'Your programme membership is unchanged. Only operational availability is paused.')}
    <div class="card"><span class="k">Renewal steps</span>
      ${tl('done', 'Book a refresher session', 'Sessions listed under Learn')}
      ${tl('pend', 'Upload your new certificate', 'Reviewed by a coordinator')}
      ${tl('pend', 'Verification confirmed', 'Availability is restored')}</div>
    ${btn('Find a refresher session', { variant: 'primary', go: 'U14' })}
    ${btn('Upload new certificate', {})}
    ${btn('Restore verification (prototype)', { variant: 'quiet', act: 'restore' })}
  </div>`);

exc('X11', 'Failed information update',
  'Input is preserved and retry is offered. The requester is told the update did not arrive.',
  () => `${backbar('Contact responder', 'U07')}
  <div class="body">
    ${banner('stop', 'Your access details were not delivered.', 'The responder has not received them. Your text has been kept.')}
    <div class="field"><label>Entrance / gate</label>
      <input class="input" value="Blue gate on Nehru Road" aria-label="Entrance" /></div>
    <div class="field"><label>Floor / room</label>
      <input class="input" value="2nd floor, flat 204" aria-label="Floor" /></div>
    <div class="card flat"><span class="k">Delivery</span>${st('stop', 'Failed — not delivered')}</div>
    ${btn('Retry sending', { variant: 'primary', act: 'sendAccess' })}
    ${btn('Call responder instead', { icon: I.phone, act: 'call' })}
    ${callBtn('Call emergency services')}
  </div>`);

exc('X12', 'Session expired',
  'Emergency calling is preserved through the expiry. Account recovery is explained separately.',
  () => `${appbar('<span class="wordmark">SWARN</span>')}
  <div class="body">
    ${banner('warn', 'You have been signed out.', 'Your session expired. Saved training and profile are unaffected.')}
    ${callBtn('CALL EMERGENCY SERVICES')}
    ${btn('REQUEST NEARBY RESPONDER', { variant: 'primary', go: 'U05' })}
    <p class="fine">Requesting help does not require an account.</p>
    <div class="divider"></div>
    ${btn('Sign in again', { go: 'U03' })}
    ${btn('Recover account access', { variant: 'quiet', row: true, chev: true })}
  </div>`);

/* ------------------------------------------------------------ screen map */
const FLOWS = [
  { name: 'First use', cards: [
    { id: 'U01', t: 'Language selection', p: 'Entry point.', b: [['Continue', 'U02'], ['Emergency help', 'bypasses onboarding']] },
    { id: 'U02', t: 'Introduction', p: 'One screen, not a carousel.', b: [['Continue without account', 'U04'], ['Sign in', 'U03']] },
    { id: 'U03', t: 'Optional sign-in', p: 'Never blocks emergency access.', b: [['Send code', 'U03b'], ['Skip', 'U04']] }
  ]},
  { name: 'Request help — core journey', cards: [
    { id: 'U04', t: 'Public home', p: 'Primary action; active incident replaces preparedness content.', b: [['Request', 'U05'], ['Call', 'dialler']] },
    { id: 'U05', t: 'Location and details', p: 'Minimal input, no diagnosis asked.', b: [['Send request', 'U06'], ['Permission denied', 'X01'], ['Outside area', 'X02'], ['Send failed', 'X03']] },
    { id: 'U06', t: 'Searching', p: 'Only the Sent event is confirmed.', b: [['Accepted', 'U07'], ['None accepted', 'X05'], ['Offline', 'X04'], ['Cancel', 'X09']] },
    { id: 'U07', t: 'Responder assigned', p: 'Accepted shown on event only.', b: [['Arrived', 'U10'], ['Withdrew', 'X06'], ['Support', 'U08'], ['Access details', 'U09']] },
    { id: 'U10', t: 'Responder arrived', p: 'Professional handover still unrecorded.', b: [['Closed', 'U11'], ['Cannot find', 'X07']] },
    { id: 'U11', t: 'Response closed', p: 'Community response only, not outcome.', b: [['Feedback', 'U12'], ['Home', 'U04']] }
  ]},
  { name: 'Prepare and profile', cards: [
    { id: 'U13', t: 'Learn', p: 'Training, practice, responder programme.', b: [['Session', 'U14'], ['Practice', 'U15'], ['Apply', 'R01']] },
    { id: 'U15', t: 'Practice mode', p: 'Reuses request screens under a persistent label.', b: [['Start', 'U05 labelled PRACTICE']] },
    { id: 'U17', t: 'Profile', p: 'Responder mode only for approved users.', b: [['Emergency info', 'U18'], ['Contacts', 'U19'], ['Accessibility', 'U20a'], ['Privacy', 'U20b']] }
  ]},
  { name: 'Responder', cards: [
    { id: 'R01', t: 'Application', p: 'Qualification and evidence.', b: [['Submit', 'R02']] },
    { id: 'R02', t: 'Verification status', p: 'Pending cannot receive requests.', b: [['Approved', 'R03']] },
    { id: 'R03', t: 'Responder home', p: 'Availability gated on valid verification.', b: [['Invitation', 'R04'], ['Expired', 'X10']] },
    { id: 'R04', t: 'Invitation', p: 'Approximate area only before accepting.', b: [['Accept', 'R05'], ['Decline', 'R03']] },
    { id: 'R05', t: 'Assigned incident', p: 'Exact address released after acceptance.', b: [['Arrived', 'R06'], ['Unable to continue', 'reassignment → X06']] },
    { id: 'R06', t: 'On-scene', p: 'Minimal documentation during care.', b: [['Prepare handover', 'R07']] },
    { id: 'R07', t: 'Handover summary', p: 'Firsthand vs reported, gaps listed.', b: [['Record handover', 'R08']] }
  ]},
  { name: 'Coordinator', cards: [
    { id: 'C01', t: 'Overview', p: 'Attention queue and freshness indicator.', b: [['Open incident', 'C02'], ['Duplicate', 'X08']] },
    { id: 'C02', t: 'Incident detail', p: 'Sourced timeline; dispatch status unknown unless confirmed.', b: [['Close with reason', 'U11 for requester']] },
    { id: 'C03', t: 'Verification', p: 'Decision with reason and reviewer.', b: [['Approve', 'R03 unlocked']] },
    { id: 'C04', t: 'Coverage', p: 'Limitations labelled; no exact locations.', b: [['Responder record', 'C03']] },
    { id: 'C05', t: 'Incident review', p: 'Service issue and named owner.', b: [] }
  ]}
];

def('MAP', {
  group: 'Overview', title: 'Annotated screen map', kind: 'map',
  note: 'Navigation and conditional branches across the three interfaces. Click any screen id to open it.',
  render: () => `<div class="mapview">
    <div class="legend">
      <span>${st('ok', 'Confirmed event')}</span>
      <span>${st('wait', 'Awaiting confirmation')}</span>
      <span>${st('stop', 'Unavailable or failed')}</span>
      <span>${st('info', 'Information only')}</span>
    </div>
    ${FLOWS.map(f => `<section><h2>${f.name}</h2><div class="flowgrid">
      ${f.cards.map(c => `<div class="flowcard">
        <h4><code>${c.id}</code> ${c.t}</h4>
        <p>${c.p}</p>
        ${c.b.map(([l, d]) => `<div class="branch"><b>${l}</b> → ${SCREENS[d] ? `<code>${d}</code>` : d}</div>`).join('')}
        ${btn('Open ' + c.id, { variant: 'sm', go: c.id })}
      </div>`).join('')}
    </div></section>`).join('')}
    <section><h2>Exception states</h2><div class="flowgrid">
      ${Object.values(SCREENS).filter(s => s.group === 'Exception states').map(s => `<div class="flowcard">
        <h4><code>${s.id}</code> ${s.title}</h4><p>${s.note}</p>
        ${btn('Open ' + s.id, { variant: 'sm', go: s.id })}</div>`).join('')}
    </div></section>
  </div>`
});

/* ------------------------------------------------------------------ router */
let current = 'MAP';
const ORDER = ['MAP', 'U01', 'U02', 'U03', 'U03b', 'U04', 'U05', 'U06', 'U07', 'U08', 'U09', 'U10', 'U11', 'U12',
  'U13', 'U14', 'U14b', 'U15', 'U16', 'U17', 'U18', 'U19', 'U20a', 'U20b',
  'R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09a', 'R09b',
  'C01', 'C02', 'C03', 'C04', 'C05',
  'X01', 'X02', 'X03', 'X04', 'X05', 'X06', 'X07', 'X08', 'X09', 'X10', 'X11', 'X12'];

function go(id) {
  if (!SCREENS[id]) return;
  current = id;
  S.modal = null;   // dialogs never survive a screen change
  if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  render();
  document.getElementById('live').textContent = SCREENS[id].title + ' — screen ' + id;
}

function renderSide() {
  const groups = {};
  ORDER.forEach(id => { const s = SCREENS[id]; (groups[s.group] ||= []).push(s); });
  document.getElementById('side').innerHTML =
    `<div class="brandbar"><span class="mark">SW</span>
      <span><b>Swarn</b><small>Connected prototype · ${ORDER.length} screens</small></span></div>` +
    Object.entries(groups).map(([g, items]) => `<h3>${g}</h3>` + items.map(s =>
      `<button type="button" class="nav" data-go="${s.id}" aria-current="${current === s.id}">
        <code>${s.id}</code><span>${s.title}</span></button>`).join('')).join('');
}

function render() {
  renderSide();
  const s = SCREENS[current];
  const canvas = document.getElementById('canvas');
  const practice = S.practice && ['U05', 'U06', 'U07', 'U08', 'U09', 'U10'].includes(current);
  const pbar = practice ? `<div class="practice-bar">${I.alert} Practice — no real alerts</div>` : '';

  let device;
  if (s.kind === 'map') device = s.render();
  else if (s.kind === 'desktop') device = `<div class="desk"><div class="desk-screen">${s.render()}${overlay()}</div></div>`;
  else device = `<div class="phone"><div class="phone-screen">
      <div class="statusbar"><span>18:52</span><span>Prototype</span></div>
      ${pbar}${s.render()}${overlay()}</div></div>`;

  canvas.innerHTML = `
    <div class="screen-head"><span class="sid">${s.id}</span>
      <div class="tx"><h1>${s.title}</h1><p>${s.group}</p></div>
      <div style="display:flex;gap:8px">
        ${btn('Screen map', { variant: 'sm', go: 'MAP' })}
      </div></div>
    ${s.note ? `<div class="rule-note"><b>Design rule.</b> ${s.note}</div>` : ''}
    ${device}`;
  canvas.scrollIntoView({ block: 'start' });
}

function overlay() {
  let out = '';
  if (S.modal === 'cancel') out += `<div class="scrim"><div class="modal" role="dialog" aria-modal="true" aria-label="Cancel community request">
    <h4>Cancel community request?</h4>
    <p class="fine">Assigned responders will be notified. This does not cancel any separate emergency call you have made.</p>
    ${btn('Keep request active', { variant: 'primary', act: 'closeModal' })}
    ${btn('Cancel community request', { variant: 'danger-ghost', act: 'confirmCancel' })}</div></div>`;
  if (S.modal === 'call') out += `<div class="scrim"><div class="modal" role="dialog" aria-modal="true" aria-label="Calling">
    <h4>${S.practice ? 'Practice mode — no call placed' : 'Opening your phone dialler'}</h4>
    <p class="fine">${S.practice
      ? 'In practice mode Swarn never places a call and never contacts a responder.'
      : 'Swarn hands the number to your phone. Opening a call does not confirm that an ambulance has been dispatched.'}</p>
    ${btn('Close', { variant: 'primary', act: 'closeModal' })}</div></div>`;
  if (S.toast) out += `<div class="toast">${I.check}<div>${S.toast}</div></div>`;
  return out;
}

const ACTIONS = {
  noop: () => {},
  lang: (a) => { S.lang = a; },
  who: (a) => { S.who = a; },
  flip: () => {},
  signin: () => { S.signedIn = true; go('U04'); },
  call: () => { S.modal = 'call'; },
  closeModal: () => { S.modal = null; },
  send: () => {
    if (S.practice) { S.incident.stage = 'searching'; go('U06'); return; }
    S.incident.stage = 'searching'; S.incident.sentAt = '18:42'; go('U06');
  },
  accept: () => { S.incident.stage = 'assigned'; S.incident.responder = RESPONDER; go('U07'); },
  arrive: () => { S.incident.stage = 'arrived'; go('U10'); },
  close: () => { S.incident.stage = 'closed'; go('U11'); },
  askCancel: () => { S.modal = 'cancel'; },
  confirmCancel: () => { S.modal = null; S.incident.stage = 'none'; S.toast = 'Community request cancelled. Assigned responders were notified.'; go('U04'); },
  sendAccess: () => { S.incident.accessDelivery = 'Confirmed'; S.toast = 'Access details delivered at 18:48.'; },
  feedback: () => { S.toast = 'Feedback submitted. Thank you.'; go('U04'); },
  register: () => { S.toast = 'Registered for Sat 27 Sep, 10:00. A reminder will be sent.'; },
  practiceOn: () => { S.practice = true; S.incident.stage = 'none'; go('U05'); },
  practiceOff: () => { S.practice = false; S.incident.stage = 'none'; go('U13'); },
  avail: (a) => { S.responder.available = a === 'on'; },
  expire: () => { S.responder.verificationValid = false; S.responder.available = false; go('X10'); },
  restore: () => { S.responder.verificationValid = true; go('R03'); },
  rAccept: () => { S.responder.assignment = 'INC-4821'; S.incident.stage = 'assigned'; go('R05'); },
  rArrive: () => { S.responder.arrivedAt = '18:51'; S.incident.stage = 'arrived'; go('R06'); },
  unable: () => { S.responder.assignment = null; S.toast = 'Coordinator notified. The requester has been told reassignment is in progress.'; go('X06'); },
  rClose: () => { S.responder.assignment = null; S.incident.stage = 'closed'; S.toast = 'Participation closed. No medical outcome was recorded.'; go('R09a'); },
  coordClose: () => { S.incident.stage = 'closed'; S.toast = 'Incident closed with a recorded reason.'; go('C01'); }
};

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-act]');
  if (!t) return;
  const act = t.getAttribute('data-act');
  if (act) {
    const fn = ACTIONS[act];
    if (fn) {
      S.toast = null;
      fn(t.getAttribute('data-arg'));
      if (!['send', 'accept', 'arrive', 'close', 'confirmCancel', 'feedback', 'practiceOn', 'practiceOff',
            'expire', 'restore', 'rAccept', 'rArrive', 'unable', 'rClose', 'coordClose', 'signin'].includes(act)) render();
      if (S.toast) setTimeout(() => { S.toast = null; render(); }, 4200);
    }
    return;
  }
  go(t.getAttribute('data-go'));
});

/* toolbar */
document.getElementById('btn-theme').addEventListener('click', () => {
  const now = document.documentElement.getAttribute('data-theme');
  const next = now === 'dark' ? 'light' : now === 'light' ? '' : 'dark';
  if (next) document.documentElement.setAttribute('data-theme', next);
  else document.documentElement.removeAttribute('data-theme');
});
document.getElementById('btn-motion').addEventListener('click', (e) => {
  const on = document.body.getAttribute('data-motion') === 'reduced';
  document.body.setAttribute('data-motion', on ? '' : 'reduced');
  e.currentTarget.setAttribute('aria-pressed', String(!on));
});
document.getElementById('btn-reset').addEventListener('click', () => { S = FRESH(); go('MAP'); });

window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#', '');
  if (SCREENS[id] && id !== current) go(id);
});

go(SCREENS[location.hash.replace('#', '')] ? location.hash.replace('#', '') : 'MAP');
