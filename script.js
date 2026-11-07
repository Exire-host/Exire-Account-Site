(() => {
  'use strict';

  const config = window.EXIRE_CONFIG || {};
  const menuButton = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setMenu(open) {
    if (!menuButton || !nav) return;
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'close menu' : 'open menu');
  }

  menuButton?.addEventListener('click', () => {
    setMenu(!nav.classList.contains('is-open'));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) setMenu(false);
  });

  if ('IntersectionObserver' in window) {
    const sections = ['home', 'about', 'projects', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean);

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
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .1, .3, .55] });

    sections.forEach(section => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: .05 });

    document.querySelectorAll('.reveal').forEach((element, index) => {
      const delay = reduceMotion ? 0 : Math.min(index % 4, 3) * 70;
      element.style.setProperty('--reveal-delay', delay + 'ms');
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(element => {
      element.classList.add('is-visible');
    });
  }

  const username = String(config.discordUsername || '').trim().replace(/^@/, '');
  const copyButton = document.getElementById('copyDiscord');
  const feedback = document.getElementById('copyFeedback');

  copyButton?.addEventListener('click', async () => {
    if (!username) {
      if (feedback) feedback.textContent = 'discord username not set';
      return;
    }

    try {
      await navigator.clipboard.writeText(username);
      if (feedback) feedback.textContent = 'copied ' + username;
    } catch {
      if (feedback) feedback.textContent = 'your username is ' + username;
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
})();