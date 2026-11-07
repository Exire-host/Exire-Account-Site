(() => {
  'use strict';

  const config = window.EXIRE_CONFIG || {};
  const sidebar = document.getElementById('profileRail');
  const menuButton = document.getElementById('mobileMenu');
  const scrim = document.getElementById('mobileScrim');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const isMobile = () => window.matchMedia('(max-width: 620px)').matches;

  document.documentElement.classList.add('js-ready');

  function setMenu(open, restoreFocus = false) {
    if (!sidebar || !menuButton || !scrim) return;
    sidebar.classList.toggle('menu-open', open);
    scrim.classList.toggle('visible', open && isMobile());
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'close menu' : 'open menu');
    if (restoreFocus && !open) menuButton.focus();
  }

  menuButton?.addEventListener('click', () => {
    setMenu(!sidebar.classList.contains('menu-open'));
  });
  scrim?.addEventListener('click', () => setMenu(false, true));
  navLinks.forEach(link => link.addEventListener('click', () => {
    if (isMobile()) setMenu(false);
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sidebar?.classList.contains('menu-open')) {
      setMenu(false, true);
    }
  });
  window.addEventListener('resize', () => {
    if (!isMobile()) setMenu(false);
  });

  const sections = ['home', 'about', 'projects', 'discord', 'links']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const current = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + current.target.id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, .15, .35, .6] });
    sections.forEach(section => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    document.querySelectorAll('.reveal').forEach((element, index) => {
      element.style.transitionDelay = Math.min(index % 3, 2) * 45 + 'ms';
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  }

  const username = String(config.discordUsername || '').trim().replace(/^@/, '');
  const copyButton = document.getElementById('copyDiscord');
  const feedback = document.getElementById('copyFeedback');
  copyButton?.addEventListener('click', async () => {
    if (!username) {
      if (feedback) feedback.textContent = 'discord username not configured';
      return;
    }
    try {
      await navigator.clipboard.writeText(username);
      if (feedback) feedback.textContent = 'copied ' + username;
    } catch {
      if (feedback) feedback.textContent = 'username is ' + username;
    }
  });

  const profileLink = document.getElementById('discordProfileLink');
  const userId = String(config.discordUserId || '').trim();
  if (profileLink && /^\d{17,20}$/.test(userId)) {
    profileLink.href = 'https://discord.com/users/' + encodeURIComponent(userId);
    profileLink.hidden = false;
  }

  const inviteLink = document.getElementById('discordInviteLink');
  const invite = String(config.discordInvite || '').trim();
  if (inviteLink && /^https:\/\/(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]+\/?$/.test(invite)) {
    inviteLink.href = invite;
    inviteLink.hidden = false;
  }

  const githubLink = document.getElementById('githubLink');
  const githubUrl = String(config.githubUrl || '').trim();
  if (githubLink && /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/?$/.test(githubUrl)) {
    githubLink.href = githubUrl;
    githubLink.hidden = false;
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();