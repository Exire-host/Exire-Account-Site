(() => {
  'use strict';
  const config = window.EXIRE_CONFIG || {};
  const shell = document.getElementById('sidebarShell');
  const rail = document.getElementById('sidebarRail');
  const panel = document.getElementById('sidebarPanel');
  const closeButton = document.getElementById('sidebarClose');
  const mobileButton = document.getElementById('menuButton');
  const scrim = document.getElementById('mobileScrim');
  const links = [...document.querySelectorAll('.nav-link')];
  let closeTimer = 0;
  let lastFocus = null;
  panel.inert = true;
  const isMobile = () => window.matchMedia('(max-width: 620px)').matches;
  const openMenu = () => {
    window.clearTimeout(closeTimer);
    shell.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    rail.setAttribute('aria-expanded', 'true');
    mobileButton?.setAttribute('aria-expanded', 'true');
    if (isMobile()) scrim.classList.add('visible');
  };
  const closeMenu = (restoreFocus = false) => {
    window.clearTimeout(closeTimer);
    shell.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    rail.setAttribute('aria-expanded', 'false');
    mobileButton?.setAttribute('aria-expanded', 'false');
    scrim.classList.remove('visible');
    if (restoreFocus) (lastFocus || (isMobile() ? mobileButton : rail))?.focus();
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      if (!panel.matches(':hover') && !rail.matches(':hover') && !panel.contains(document.activeElement)) closeMenu();
    }, 280);
  };
  rail.addEventListener('click', () => {
    if (shell.classList.contains('is-open')) closeMenu();
    else { lastFocus = rail; openMenu(); }
  });
  rail.addEventListener('pointerenter', () => { if (!isMobile()) openMenu(); });
  rail.addEventListener('pointerleave', () => { if (!isMobile()) scheduleClose(); });
  panel.addEventListener('pointerenter', () => window.clearTimeout(closeTimer));
  panel.addEventListener('pointerleave', () => { if (!isMobile()) scheduleClose(); });
  mobileButton?.addEventListener('click', () => {
    if (shell.classList.contains('is-open')) closeMenu();
    else { lastFocus = mobileButton; openMenu(); closeButton.focus(); }
  });
  closeButton.addEventListener('click', () => closeMenu(true));
  scrim.addEventListener('click', () => closeMenu(true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && shell.classList.contains('is-open')) closeMenu(true);
  });
  links.forEach(link => link.addEventListener('click', () => closeMenu()));
  window.addEventListener('resize', () => {
    if (!isMobile()) scrim.classList.remove('visible');
    else if (shell.classList.contains('is-open')) scrim.classList.add('visible');
  });
  const sections = ['home','about','projects','discord','links'].map(id => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => {
        const active = link.getAttribute('href') === '#' + visible.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin:'-25% 0px -55% 0px',threshold:[0,.15,.35,.6]});
    sections.forEach(section => observer.observe(section));
  }
  const username = String(config.discordUsername || '').trim().replace(/^@/,'');
  const copyButton = document.getElementById('copyDiscord');
  const feedback = document.getElementById('copyFeedback');
  copyButton.addEventListener('click', async () => {
    if (!username) { feedback.textContent = 'Discord username is not configured.'; return; }
    try { await navigator.clipboard.writeText(username); feedback.textContent = 'Copied @' + username + ' to clipboard.'; }
    catch { feedback.textContent = 'Your Discord username: @' + username; }
  });
  const profileLink = document.getElementById('discordProfileLink');
  const userId = String(config.discordUserId || '').trim();
  if (/^\d{17,20}$/.test(userId)) {
    profileLink.href = 'https://discord.com/users/' + encodeURIComponent(userId);
    profileLink.hidden = false;
  }
  const inviteLink = document.getElementById('discordInviteLink');
  const invite = String(config.discordInvite || '').trim();
  if (/^https:\/\/(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]+\/?$/.test(invite)) {
    inviteLink.href = invite;
    inviteLink.hidden = false;
  }
  const githubLink = document.getElementById('githubLink');
  if (/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/?$/.test(config.githubUrl || '')) {
    githubLink.href = config.githubUrl;
    githubLink.hidden = false;
  }
  const youtubeLink = document.getElementById('youtubeLink');
  if (/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(config.youtubeUrl || '')) {
    youtubeLink.href = config.youtubeUrl;
    youtubeLink.hidden = false;
  }
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();