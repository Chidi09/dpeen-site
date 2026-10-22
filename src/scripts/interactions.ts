import DOMPurify from 'dompurify';
import { enquirySchema } from '../lib/enquiry';

export function initializeInteractions(): void {
  const menu = document.getElementById('main-menu');
  const toggle = document.getElementById('menu-toggle');
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    menu?.classList.toggle('hidden', !expanded);
    menu?.classList.toggle('flex', expanded);
  });
  menu?.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      toggle?.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      menu.classList.remove('flex');
    }),
  );
  const donation =
    document.querySelector<HTMLDialogElement>('#donation-dialog');
  const enquiry = document.querySelector<HTMLDialogElement>('#enquiry-dialog');
  document
    .querySelectorAll<HTMLElement>('[data-donate]')
    .forEach((button) =>
      button.addEventListener('click', () => donation?.showModal()),
    );
  document.querySelectorAll<HTMLElement>('[data-enquiry]').forEach((button) =>
    button.addEventListener('click', () => {
      const interest =
        enquiry?.querySelector<HTMLSelectElement>('[name=interest]');
      if (interest)
        interest.value = button.dataset.enquiry || 'Partner as a Hub';
      enquiry?.showModal();
    }),
  );
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => {
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const controls = dialog.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]',
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    });
    dialog
      .querySelector('[data-close]')
      ?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        const r = dialog.getBoundingClientRect();
        if (
          event.clientX < r.left ||
          event.clientX > r.right ||
          event.clientY < r.top ||
          event.clientY > r.bottom
        )
          dialog.close();
      }
    });
    dialog.addEventListener('close', () =>
      document.body.classList.remove('dialog-open'),
    );
    new MutationObserver(() =>
      document.body.classList.toggle(
        'dialog-open',
        !!document.querySelector('dialog[open]'),
      ),
    ).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  const copyButton = document.getElementById('copy-account');
  let copyReset: ReturnType<typeof setTimeout>;
  copyButton?.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    const label = copyButton.querySelector('[data-copy-label]');
    try {
      await navigator.clipboard.writeText('1031463749');
      clearTimeout(copyReset);
      copyButton.classList.add('is-copied');
      if (label) label.textContent = 'Copied';
      if (status)
        status.textContent =
          'Account number copied. Paste it into your banking app.';
      copyReset = setTimeout(() => {
        copyButton.classList.remove('is-copied');
        if (label) label.textContent = 'Copy';
        if (status) status.textContent = '';
      }, 2600);
    } catch {
      const number = document.querySelector('.donation-account-number');
      if (number) {
        const range = document.createRange();
        range.selectNodeContents(number);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      if (status)
        status.textContent =
          'The account number is selected. Please copy it to your banking app.';
    }
  });
  initializeMotion();
  initializeHeader();
  initializeScrollSpy();
  initializeHeroPause();
  initializeCookieNotice();
  document
    .querySelectorAll<HTMLFormElement>('[data-enquiry-form]')
    .forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const status = form.querySelector<HTMLElement>('[role=status]');
        const button = form.querySelector<HTMLButtonElement>('[type=submit]');
        if (!button || button.disabled) return;
        const data = new FormData(form);
        const clean = (name: string): string =>
          DOMPurify.sanitize(String(data.get(name) || ''), {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
          });
        const result = enquirySchema.safeParse({
          fullName: clean('fullName'),
          email: clean('email'),
          interest: clean('interest'),
          message: clean('message'),
        });
        if (!result.success) {
          form.dataset.state = 'error';
          if (status)
            status.textContent =
              result.error.issues[0]?.message || 'Please check the form.';
          return;
        }
        button.disabled = true;
        form.dataset.state = 'sending';
        const buttonLabel = button.querySelector('span') || button;
        buttonLabel.textContent = 'Sending…';
        form.setAttribute('aria-busy', 'true');
        if (status) status.textContent = '';
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...result.data,
              website: data.get('website') || '',
            }),
          });
          if (!response.ok) throw new Error('Delivery failed');
          form.reset();
          form.dataset.state = 'success';
          if (status)
            status.textContent =
              'Thank you. Your message has been sent to DPEEN.';
        } catch {
          form.dataset.state = 'error';
          if (status)
            status.textContent =
              'Your message could not be sent. Please try again or email info@dpeenetwork.com directly. Your details are still here.';
        } finally {
          button.disabled = false;
          buttonLabel.textContent = 'Send message';
          form.removeAttribute('aria-busy');
        }
      });
    });
}

function initializeMotion(): void {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll<HTMLElement>(
      '.mission-statement, .mission-principles, .program-heading, .journey-stage, .opportunity-heading, .opportunity-card, .scholarship-row, .leadership-heading, .trustee-card, .closing-layout, .contact-grid',
    )
    .forEach((element) => {
      if (element.getBoundingClientRect().top < innerHeight) return;
      element.classList.add('reveal-on-scroll');
      const siblings = Array.from(element.parentElement?.children || []);
      element.style.setProperty(
        '--reveal-delay',
        `${Math.min(siblings.indexOf(element), 3) * 65}ms`,
      );
      observer.observe(element);
    });
  preference.addEventListener('change', () => {
    if (preference.matches) {
      document.documentElement.classList.remove('motion-ready');
      document
        .querySelectorAll('.reveal-on-scroll')
        .forEach((element) => element.classList.add('is-revealed'));
      observer.disconnect();
    }
  });
}

function initializeHeader(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  const update = () =>
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initializeScrollSpy(): void {
  if (!('IntersectionObserver' in window)) return;
  const links = new Map<string, HTMLAnchorElement>();
  document
    .querySelectorAll<HTMLAnchorElement>('#main-menu a[href^="/#"]')
    .forEach((link) => links.set(link.hash.slice(1), link));
  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);
  if (!sections.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link, id) => {
          if (id === entry.target.id)
            link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
  const hero = document.querySelector('.campaign-hero');
  if (hero)
    new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting)
          links.forEach((link) => link.removeAttribute('aria-current'));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    ).observe(hero);
}

function initializeHeroPause(): void {
  const hero = document.querySelector<HTMLElement>('.campaign-hero');
  if (!hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) =>
    hero.classList.toggle('is-offscreen', !entry?.isIntersecting),
  ).observe(hero);
}

const NOTICE_KEY = 'dpeen-notice';

function initializeCookieNotice(): void {
  const notice = document.querySelector<HTMLElement>('.cookie-notice');
  if (!notice) return;
  try {
    if (localStorage.getItem(NOTICE_KEY)) return;
  } catch {
    // Storage can be blocked; show the notice on every visit instead.
  }
  const show = () => {
    notice.hidden = false;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => notice.classList.add('is-visible')),
    );
  };
  if (document.readyState === 'complete') setTimeout(show, 900);
  else
    window.addEventListener('load', () => setTimeout(show, 900), {
      once: true,
    });
  notice
    .querySelector('[data-cookie-dismiss]')
    ?.addEventListener('click', () => {
      try {
        localStorage.setItem(NOTICE_KEY, '1');
      } catch {
        // Nothing to remember the choice with; hide for this visit only.
      }
      notice.classList.remove('is-visible');
      setTimeout(() => (notice.hidden = true), 260);
    });
}
