// Base URL for the backend API (admin login + events). This is a separate
// service from GitHub Pages, since GitHub Pages can only serve static files.
// UPDATE THIS after you deploy server.js somewhere (e.g. Render) —
// replace with your actual backend URL, no trailing slash.
window.API_BASE = 'https://fulshear-tsa-backend.onrender.com';

// Dropdown menu toggle
(function(){
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  let transitionOverlay = document.querySelector('.page-transition-overlay');
  if(!transitionOverlay){
    transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    transitionOverlay.setAttribute('aria-hidden', 'true');
    document.documentElement.appendChild(transitionOverlay);
  }
  let transitionTimer = null;
  let isTransitioning = false;

  if(dropdownBtn && dropdownMenu){
    dropdownBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', ()=>{
      dropdownMenu.classList.remove('active');
    });
  }

  const normalizePath = (value = '') => value.replace(/\/+$/, '') || '/';
  const currentPath = normalizePath(window.location.pathname);
  const transitionKey = 'site-page-transition';
  const shouldEnter = sessionStorage.getItem(transitionKey) === 'enter';
  const normalizedPath = currentPath;
  const isHomePage = normalizedPath === '/' || /\/index\.html?$/i.test(normalizedPath);
  document.querySelectorAll('.nav-btn').forEach(link=>{
    const href = link.getAttribute('href');
    if(href && currentPath.includes(href.replace('.html',''))){
      link.classList.add('active');
    }
  });
  const headerContainer = document.querySelector('.header-container');
  let lastHeaderState = false;
  let headerFrame = null;

  const updateHeaderState = () => {
    const collapseThreshold = window.innerHeight >= 900 ? 280 : 200;
    const expandThreshold = collapseThreshold - 120;
    const scrollY = window.scrollY;
    const shouldMinimize = scrollY > collapseThreshold || (lastHeaderState && scrollY > expandThreshold);

    if (shouldMinimize === lastHeaderState) {
      return;
    }

    lastHeaderState = shouldMinimize;
    document.body.classList.toggle('header-scrolled', shouldMinimize);
    headerContainer?.classList.toggle('is-scrolled', shouldMinimize);
  };

  const scheduleHeaderUpdate = () => {
    if (headerFrame) {
      return;
    }

    headerFrame = window.requestAnimationFrame(() => {
      headerFrame = null;
      updateHeaderState();
    });
  };

  if(headerContainer){
    headerContainer.classList.toggle('home-page', isHomePage);

    if(isHomePage){
      if(!headerContainer.querySelector('.header-video-bg')){
        const video = document.createElement('video');
        video.className = 'header-video-bg';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.poster = 'assets/img/fulshear-logo.png';
        video.setAttribute('aria-hidden', 'true');
        video.setAttribute('playsinline', '');
        video.innerHTML = '<source src="assets/video/header-home.mp4" type="video/mp4">';
        headerContainer.prepend(video);
      }
    } else {
      headerContainer.querySelector('.header-video-bg')?.remove();
    }
  }

  const logoLink = headerContainer?.querySelector('.logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', (event) => {
      const isMobileWidth = window.innerWidth <= 1024;
      const isMinimized = headerContainer.classList.contains('is-scrolled');
      if (isMobileWidth && isMinimized) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  const attachHeaderBehavior = () => {
    updateHeaderState();
    window.addEventListener('scroll', scheduleHeaderUpdate, { passive: true });
    window.addEventListener('resize', scheduleHeaderUpdate);
    window.addEventListener('load', updateHeaderState);
    setTimeout(updateHeaderState, 80);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHeaderBehavior, { once: true });
  } else {
    attachHeaderBehavior();
  }


  const finishPageEntry = () => {
    document.documentElement.style.visibility = 'visible';
    document.body.classList.remove('page-entering', 'page-transitioning');
    document.body.classList.add('page-loaded', 'page-entered');
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
  };

  const startPageEntry = () => {
    document.body.classList.add('page-entering');
    document.body.classList.remove('page-transitioning', 'page-loaded', 'page-entered');
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)';
    window.requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      startPageEntry();
      window.setTimeout(finishPageEntry, 900);
    }, { once: true });
  } else {
    startPageEntry();
    window.setTimeout(finishPageEntry, 900);
  }

  window.addEventListener('load', () => {
    if (shouldEnter) {
      sessionStorage.removeItem(transitionKey);
      transitionOverlay.classList.add('active');
      window.setTimeout(() => {
        transitionOverlay.classList.remove('active');
        isTransitioning = false;
      }, 360);
    } else {
      transitionOverlay.classList.remove('active');
      isTransitioning = false;
    }
  }, { once: true });

  document.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || target.getAttribute('target') === '_blank') return;

    const targetPath = normalizePath(new URL(href, window.location.href).pathname);
    const isSamePage = targetPath === currentPath || (targetPath === '/index.html' && currentPath === '/');
    if (isSamePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return;
    }

    const isExternal = /^https?:/i.test(href) && !href.includes(window.location.hostname);
    if (isExternal) return;

    if(isTransitioning){
      return;
    }

    e.preventDefault();
    isTransitioning = true;
    document.body.classList.add('page-transitioning');
    sessionStorage.setItem(transitionKey, 'enter');
    transitionOverlay.classList.add('active');

    if(transitionTimer){
      window.clearTimeout(transitionTimer);
    }
    transitionTimer = window.setTimeout(() => {
      window.location.assign(href);
    }, 300);
  }, true);

  const footer = document.getElementById('site-footer');
  if(footer){
    footer.addEventListener('mousemove', (event) => {
      const rect = footer.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      footer.style.setProperty('--spot-x', `${x}%`);
      footer.style.setProperty('--spot-y', `${y}%`);
      footer.classList.add('is-hovering');
    });

    footer.addEventListener('mouseleave', () => {
      footer.classList.remove('is-hovering');
    });
  }

  const form = document.getElementById('contact-form');
  const status = form?.querySelector('.form-status');
  if(form){
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = {
        name: formData.get('name')?.toString().trim() || '',
        email: formData.get('email')?.toString().trim() || '',
        message: formData.get('message')?.toString().trim() || '',
        submittedAt: new Date().toISOString()
      };

      if(status){
        status.textContent = 'Sending...';
      }

      try {
        const response = await fetch(window.API_BASE + '/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if(!response.ok){
          throw new Error('Request failed');
        }

        form.reset();
        if(status){
          status.textContent = 'Thanks! Your message was sent.';
        }
      } catch (error) {
        if(status){
          status.textContent = 'Sorry, something went wrong. Please try again later.';
        }
      }
    });
  }

  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  const parseJsonResponse = async (response) => {
    const text = await response.text();
    if(!text){
      return {};
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      return { error: text };
    }
  };

  const startEventEdit = (event) => {
    const eventForm = document.getElementById('home-event-form');
    const titleField = eventForm?.querySelector('input[name="event-title"]');
    const dateField = document.getElementById('home-event-date');
    const descriptionField = eventForm?.querySelector('textarea[name="event-description"]');
    const submitButton = document.getElementById('home-event-submit');
    const cancelButton = document.getElementById('home-event-cancel');
    const deleteButton = document.getElementById('home-event-delete');
    const status = document.getElementById('home-admin-status');

    if(!eventForm || !titleField || !dateField || !descriptionField){
      return;
    }

    if(event){
      titleField.value = event.title || '';
      dateField.value = event.date || '';
      descriptionField.value = event.description || '';
      eventForm.dataset.editingEventId = event.id || '';
      submitButton.textContent = 'Update Event';
      cancelButton.classList.remove('hidden');
      deleteButton.classList.remove('hidden');
      eventForm.classList.remove('hidden');
      if(status){
        status.textContent = `Editing "${event.title}".`;
      }
      titleField.focus();
      return;
    }

    eventForm.dataset.editingEventId = '';
    submitButton.textContent = 'Save Event';
    cancelButton.classList.add('hidden');
    deleteButton.classList.add('hidden');
  };

  const renderUpcomingEvents = async () => {
    const container = document.querySelector('.events-calendar-grid');
    if(!container){
      return;
    }

    try {
      const response = await fetch(window.API_BASE + '/api/events');
      if(!response.ok){
        throw new Error('Unable to load events');
      }
      const events = await response.json();
      const sortedEvents = events
        .filter(event => event && event.date)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

      if(!sortedEvents.length){
        container.innerHTML = '<div class="event-card"><div class="event-date"><span class="day">—</span><span class="month">TBA</span></div><div><h3>No events yet</h3><p>New events will appear here after an approved club member adds one.</p></div></div>';
        return;
      }

      const isAdminSession = Boolean(localStorage.getItem('tsaAuthToken'));
      container.innerHTML = sortedEvents.map(event => {
        const [year, month, day] = event.date.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        const monthLabel = date.toLocaleString('en-US', { month: 'short' });
        const dayLabel = date.getDate();
        return `
          <button type="button" class="event-card ${isAdminSession ? 'event-editable' : ''}" data-event-id="${escapeHtml(event.id || '')}">
            <div class="event-date"><span class="day">${dayLabel}</span><span class="month">${monthLabel}</span></div>
            <div>
              <h3>${escapeHtml(event.title)}</h3>
              <p>${escapeHtml(event.description || 'Club event added by an approved member.')}</p>
            </div>
          </button>`;
      }).join('');

      container.querySelectorAll('.event-card[data-event-id]').forEach(button => {
        button.addEventListener('click', () => {
          if(!isAdminSession){
            return;
          }
          const matchingEvent = sortedEvents.find(event => event.id === button.getAttribute('data-event-id'));
          if(matchingEvent){
            startEventEdit(matchingEvent);
          }
        });
      });
    } catch (error) {
      container.innerHTML = '<div class="event-card"><div class="event-date"><span class="day">!</span><span class="month">ERR</span></div><div><h3>Unable to load</h3><p>Please try again in a moment.</p></div></div>';
    }
  };

  const renderHomeCalendar = async () => {
    const grid = document.getElementById('home-calendar-grid');
    const monthLabel = document.getElementById('home-calendar-month-label');
    const selectedDayPanel = document.getElementById('home-selected-day-events');
    if(!grid || !monthLabel || !selectedDayPanel){
      return;
    }

    const state = {
      currentMonth: new Date(),
      selectedDate: null,
      events: []
    };

    try {
      const response = await fetch(window.API_BASE + '/api/events');
      if(response.ok){
        state.events = (await response.json()).filter(event => event && event.date);
      }
    } catch (error) {
      monthLabel.textContent = 'Unable to load calendar';
      grid.innerHTML = '<div class="selected-day-empty">Could not reach the events server. Please try again shortly.</div>';
      selectedDayPanel.innerHTML = '';
      return;
    }

    const formatDateKey = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const render = () => {
      const year = state.currentMonth.getFullYear();
      const month = state.currentMonth.getMonth();
      monthLabel.textContent = state.currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDay = (firstDay.getDay() + 6) % 7;
      const totalCells = Math.ceil((startDay + lastDay.getDate()) / 7) * 7;
      const cells = [];

      for(let index = 0; index < totalCells; index += 1){
        const date = new Date(year, month, index - startDay + 1);
        const isCurrentMonth = date.getMonth() === month;
        const dateKey = formatDateKey(date);
        const matches = state.events.filter(event => event.date === dateKey);
        const isSelected = state.selectedDate === dateKey;
        cells.push(`
          <button class="calendar-day ${isCurrentMonth ? '' : 'muted'} ${matches.length ? 'has-event' : ''} ${isSelected ? 'active' : ''}" data-date="${dateKey}" ${isCurrentMonth ? '' : 'disabled'}>
            <span class="calendar-day-number">${date.getDate()}</span>
            ${matches.length ? '<span class="calendar-dot"></span>' : ''}
          </button>`);
      }

      grid.innerHTML = cells.join('');
      grid.querySelectorAll('.calendar-day').forEach(button => {
        button.addEventListener('click', () => {
          state.selectedDate = button.getAttribute('data-date');
          render();
          renderSelectedEvents();
        });
      });

      renderSelectedEvents();
    };

    const renderSelectedEvents = () => {
      const selectedKey = state.selectedDate || formatDateKey(new Date());
      const matches = state.events.filter(event => event.date === selectedKey);
      if(!matches.length){
        selectedDayPanel.innerHTML = `<div class="selected-day-empty">No events scheduled for ${selectedKey}.</div>`;
        return;
      }

      const isAdminSession = Boolean(localStorage.getItem('tsaAuthToken'));
      selectedDayPanel.innerHTML = matches.map(event => `
        <button type="button" class="selected-day-card ${isAdminSession ? 'event-editable' : ''}" data-event-id="${escapeHtml(event.id || '')}">
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(event.description || 'Club event')}</p>
          <span>Added by ${escapeHtml(event.createdBy || 'approved member')}</span>
        </button>`).join('');

      selectedDayPanel.querySelectorAll('.selected-day-card[data-event-id]').forEach(button => {
        button.addEventListener('click', () => {
          if(!isAdminSession){
            return;
          }
          const matchingEvent = matches.find(event => event.id === button.getAttribute('data-event-id'));
          if(matchingEvent){
            startEventEdit(matchingEvent);
          }
        });
      });
    };

    document.getElementById('home-calendar-prev')?.addEventListener('click', () => {
      state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
      render();
    });

    document.getElementById('home-calendar-next')?.addEventListener('click', () => {
      state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
      render();
    });

    state.selectedDate = formatDateKey(new Date());
    render();
  };

  window.togglePasswordVisibility = function(targetIdOrEvent){
    var targetId = typeof targetIdOrEvent === 'string' ? targetIdOrEvent : null;
    var node = null;

    if(typeof targetIdOrEvent === 'object' && targetIdOrEvent !== null){
      if(targetIdOrEvent.currentTarget && targetIdOrEvent.currentTarget.getAttribute){
        node = targetIdOrEvent.currentTarget;
      } else if(targetIdOrEvent.target && targetIdOrEvent.target.getAttribute){
        node = targetIdOrEvent.target;
      } else if(targetIdOrEvent.getAttribute){
        node = targetIdOrEvent;
      }
    }

    if(!targetId && node){
      targetId = node.getAttribute('data-target') || node.name || node.id;
    }
    if(!targetId) return;

    var field = document.getElementById(targetId);
    if(!field){ field = document.querySelector('input[name="' + targetId + '"]'); }
    var button = document.querySelector('.password-toggle[data-target="' + targetId + '"]');
    if(!field || !button) return;

    var wasPassword = field.type === 'password';
    try { field.type = wasPassword ? 'text' : 'password'; } catch (e) { }
    try { button.textContent = wasPassword ? 'Hide' : 'Show'; } catch (e) { }
    try { button.setAttribute('aria-label', wasPassword ? 'Hide password' : 'Show password'); } catch (e) { }
    try { button.setAttribute('aria-pressed', wasPassword ? 'true' : 'false'); } catch (e) { }
    try { var wrapper = button.closest && button.closest('.password-field'); if(wrapper) wrapper.classList.toggle('showing-password', wasPassword); } catch (e) {}
    try { field.focus(); } catch (e) {}
  };

  const bindPasswordToggle = () => {
    document.querySelectorAll('.password-toggle').forEach(button => {
      if (button.dataset.passwordToggleBound === '1') return;
      button.dataset.passwordToggleBound = '1';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.togglePasswordVisibility(event);
      });
    });
  };

  const attachHomeAdminPanel = async () => {
    const loginForm = document.getElementById('home-login-form');
    const eventForm = document.getElementById('home-event-form');
    const adminStatus = document.getElementById('home-admin-status');
    const authNotice = document.getElementById('home-auth-notice');
    const eventDateField = document.getElementById('home-event-date');
    const usernameField = document.getElementById('home-login-username');
    const passwordField = document.getElementById('home-login-password');
    const submitButton = document.getElementById('home-event-submit');
    const cancelButton = document.getElementById('home-event-cancel');
    const deleteButton = document.getElementById('home-event-delete');

    if(!loginForm || !eventForm || !adminStatus){
      return;
    }

    const resetEventForm = () => {
      eventForm.reset();
      eventForm.dataset.editingEventId = '';
      if(submitButton){
        submitButton.textContent = 'Save Event';
      }
      cancelButton?.classList.add('hidden');
      deleteButton?.classList.add('hidden');
      if(eventDateField){
        eventDateField.value = new Date().toISOString().slice(0, 10);
      }
    };

    const token = localStorage.getItem('tsaAuthToken');
    if(token){
      try {
        const response = await fetch(window.API_BASE + '/api/admin/me', { headers: { Authorization: `Bearer ${token}` } });
        if(response.ok){
          const data = await parseJsonResponse(response);
          authNotice.textContent = `Signed in as ${data.username}.`;
          eventForm.classList.remove('hidden');
          loginForm.classList.add('hidden');
          adminStatus.textContent = 'Access granted. You can add or update calendar events now.';
          resetEventForm();
        } else {
          throw new Error('not-authenticated');
        }
      } catch (error) {
        localStorage.removeItem('tsaAuthToken');
        authNotice.textContent = '';
        adminStatus.textContent = 'Please sign in to manage events.';
      }
    }

    cancelButton?.addEventListener('click', () => {
      resetEventForm();
      adminStatus.textContent = 'Edit cancelled.';
    });

    deleteButton?.addEventListener('click', async () => {
      const eventId = eventForm.dataset.editingEventId;
      if(!eventId){
        return;
      }
      adminStatus.textContent = 'Deleting event...';
      try {
        const response = await fetch(`${window.API_BASE}/api/events/${encodeURIComponent(eventId)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('tsaAuthToken')}` }
        });
        const result = await parseJsonResponse(response);
        if(!response.ok || !result.success){
          throw new Error(result.error || 'Unable to delete event');
        }
        resetEventForm();
        adminStatus.textContent = 'Event deleted.';
        await renderHomeCalendar();
        await renderUpcomingEvents();
      } catch (error) {
        adminStatus.textContent = error.message;
      }
    });

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        username: usernameField?.value.trim() || '',
        password: passwordField?.value || ''
      };
      adminStatus.textContent = 'Signing in...';
      try {
        const response = await fetch(window.API_BASE + '/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await parseJsonResponse(response);
        if(!response.ok || !result.success){
          throw new Error(result.error || 'Unable to sign in');
        }
        localStorage.setItem('tsaAuthToken', result.token);
        authNotice.textContent = `Signed in as ${result.username}.`;
        eventForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        adminStatus.textContent = 'Access granted. You can add or update calendar events now.';
        passwordField.value = '';
        resetEventForm();
        await renderHomeCalendar();
        await renderUpcomingEvents();
      } catch (error) {
        adminStatus.textContent = error.message || 'Unable to sign in right now.';
        authNotice.textContent = '';
        eventForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
      }
    });

    eventForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(eventForm);
      const payload = {
        title: formData.get('event-title')?.toString().trim() || '',
        date: formData.get('event-date')?.toString().trim() || '',
        description: formData.get('event-description')?.toString().trim() || ''
      };
      if(!payload.title || !payload.date){
        adminStatus.textContent = 'Please add a title and date.';
        return;
      }

      const editingEventId = eventForm.dataset.editingEventId;
      const method = editingEventId ? 'PUT' : 'POST';
      const url = editingEventId ? `${window.API_BASE}/api/events/${encodeURIComponent(editingEventId)}` : window.API_BASE + '/api/events';
      adminStatus.textContent = editingEventId ? 'Updating event...' : 'Saving event...';
      try {
        const token = localStorage.getItem('tsaAuthToken');
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const result = await parseJsonResponse(response);
        if(!response.ok || !result.success){
          throw new Error(result.error || (editingEventId ? 'Unable to update event' : 'Unable to save event'));
        }
        resetEventForm();
        adminStatus.textContent = editingEventId ? 'Event updated.' : 'Event saved to the calendar.';
        await renderHomeCalendar();
        await renderUpcomingEvents();
      } catch (error) {
        adminStatus.textContent = error.message;
      }
    });
  };

  /* Home page: carousel rotation and FAQ flip cards */
  const initHomeInteractions = () => {
    document.querySelectorAll('.carousel').forEach((carousel) => {
      const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
      if(!slides.length){
        return;
      }

      let idx = 0;
      slides.forEach((slide, index) => slide.classList.toggle('active', index === 0));
      setInterval(() => {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
      }, 6000);
    });

    // FAQ flip cards
    document.querySelectorAll('.flip-card').forEach(card => {
      // wrap content in inner faces
      const ans = card.getAttribute('data-answer') || '';
      card.innerHTML = `\n        <div class="card-inner">\n          <div class="face front">${card.textContent}</div>\n          <div class="face back">${ans}</div>\n        </div>`;
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
  };

  // Initialize interactions when DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    bindPasswordToggle();
    attachHomeAdminPanel();
    renderUpcomingEvents();
    renderHomeCalendar();
    initHomeInteractions();
    if(document.getElementById('archive-login-modal')){
      initArchiveAccess();
    }
    if(document.getElementById('slides-login-modal')){
      initSlidesAccess();
    }
  });

  const initArchiveAccess = async () => {
    bindPasswordToggle();
    const overlay = document.getElementById('archive-login-modal');
    const form = document.getElementById('archive-login-form');
    const status = document.getElementById('archive-login-status');
    const content = document.getElementById('archive-content');
    const usernameField = document.getElementById('archive-login-username');
    const passwordField = document.getElementById('archive-login-password');

    if(!overlay || !form || !status || !content){
      return;
    }

    const showContent = async (token) => {
      try {
        const response = await fetch(window.API_BASE + '/api/admin/me', { headers: { Authorization: `Bearer ${token}` } });
        if(!response.ok){
          throw new Error('not-authenticated');
        }
        content.classList.remove('hidden');
        overlay.classList.add('hidden');
        status.textContent = 'Archive access granted.';
        passwordField.value = '';
      } catch (error) {
        localStorage.removeItem('tsaAuthToken');
        content.classList.add('hidden');
        overlay.classList.remove('hidden');
        form.classList.remove('hidden');
        status.textContent = 'Sign in to view the archive.';
      }
    };

    const token = localStorage.getItem('tsaAuthToken');
    if(token){
      await showContent(token);
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = 'Signing in...';
      try {
        const response = await fetch(window.API_BASE + '/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameField?.value.trim() || '',
            password: passwordField?.value || ''
          })
        });
        const result = await parseJsonResponse(response);
        if(!response.ok || !result.success){
          throw new Error(result.error || 'Unable to sign in');
        }
        localStorage.setItem('tsaAuthToken', result.token);
        await showContent(result.token);
        passwordField.value = '';
      } catch (error) {
        status.textContent = error.message;
      }
    });
  };

  const loadSlidesFromStorage = () => {
    try {
      const json = localStorage.getItem('tsaSlides');
      if(!json){
        return [];
      }
      return JSON.parse(json) || [];
    } catch (error) {
      return [];
    }
  };

  const saveSlidesToStorage = (slides) => {
    try {
      localStorage.setItem('tsaSlides', JSON.stringify(slides));
    } catch (error) {
      // ignore storage failures
    }
  };

  const renderSlidesList = (slides) => {
    const list = document.getElementById('slides-list');
    if(!list){
      return;
    }
    if(!slides.length){
      list.innerHTML = '<div class="slide-card"><div><h3>No slides added yet</h3><p>Save a meeting title, date, and link to begin.</p></div></div>';
      return;
    }

    list.innerHTML = slides.map(slide => `
      <div class="slide-card">
        <div>
          <h3>${escapeHtml(slide.title)}</h3>
          <p>${escapeHtml(slide.date)}</p>
          <p class="slide-url">${escapeHtml(slide.link)}</p>
        </div>
        <div class="slide-actions">
          <a class="btn primary" href="${escapeHtml(slide.link)}" target="_blank" rel="noreferrer">Look at meeting!</a>
        </div>
      </div>
    `).join('');
  };

  const initSlidesAccess = async () => {
    bindPasswordToggle();
    const overlay = document.getElementById('slides-login-modal');
    const form = document.getElementById('slides-login-form');
    const status = document.getElementById('slides-login-status');
    const content = document.getElementById('slides-content');
    const usernameField = document.getElementById('slides-login-username');
    const passwordField = document.getElementById('slides-login-password');
    const slidesForm = document.getElementById('slides-add-form');
    const formStatus = document.getElementById('slides-form-status');

    if(!overlay || !form || !status || !content || !slidesForm){
      return;
    }

    const showContent = async (token) => {
      try {
        const response = await fetch(window.API_BASE + '/api/admin/me', { headers: { Authorization: `Bearer ${token}` } });
        if(!response.ok){
          throw new Error('not-authenticated');
        }
        const slides = loadSlidesFromStorage();
        renderSlidesList(slides);
        content.classList.remove('hidden');
        overlay.classList.add('hidden');
        status.textContent = 'Slide access granted.';
        passwordField.value = '';
      } catch (error) {
        localStorage.removeItem('tsaAuthToken');
        content.classList.add('hidden');
        overlay.classList.remove('hidden');
        form.classList.remove('hidden');
        status.textContent = 'Sign in to manage meeting slides.';
      }
    };

    const token = localStorage.getItem('tsaAuthToken');
    if(token){
      await showContent(token);
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = 'Signing in...';
      try {
        const response = await fetch(window.API_BASE + '/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameField?.value.trim() || '',
            password: passwordField?.value || ''
          })
        });
        const result = await parseJsonResponse(response);
        if(!response.ok || !result.success){
          throw new Error(result.error || 'Unable to sign in');
        }
        localStorage.setItem('tsaAuthToken', result.token);
        await showContent(result.token);
        passwordField.value = '';
      } catch (error) {
        status.textContent = error.message;
      }
    });

    slidesForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const titleField = document.getElementById('slide-title');
      const dateField = document.getElementById('slide-date');
      const linkField = document.getElementById('slide-link');
      const title = titleField?.value.trim() || '';
      const date = dateField?.value || '';
      const link = linkField?.value.trim() || '';

      if(!title || !date || !link){
        if(formStatus){
          formStatus.textContent = 'Please fill in every field before saving.';
        }
        return;
      }

      const slides = loadSlidesFromStorage();
      slides.unshift({ id: Date.now().toString(), title, date, link });
      saveSlidesToStorage(slides);
      renderSlidesList(slides);
      titleField.value = '';
      dateField.value = '';
      linkField.value = '';
      if(formStatus){
        formStatus.textContent = 'Meeting slide saved.';
      }
    });
  };

  // Intro sequence handler - only runs once per session on the home page
  const initIntroSequence = () => {
    if (!isHomePage) {
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-complete');
      const overlay = document.querySelector('.intro-overlay');
      overlay?.classList.remove('active');
      overlay?.classList.remove('reveal');
      overlay?.setAttribute('aria-hidden', 'true');
      overlay?.style.setProperty('display', 'none');
      overlay?.style.setProperty('opacity', '0');
      overlay?.style.setProperty('visibility', 'hidden');
      return;
    }

    const overlay = document.querySelector('.intro-overlay');
    if (!overlay) {
      return;
    }

    const introKey = 'site-home-intro-shown';
    let shouldShow = true;
    try {
      shouldShow = sessionStorage.getItem(introKey) !== 'true';
    } catch (error) {
      shouldShow = true;
    }

    if (!shouldShow) {
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-complete');
      overlay.classList.remove('active');
      overlay.classList.remove('reveal');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.display = 'none';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      return;
    }

    try {
      sessionStorage.setItem(introKey, 'true');
    } catch (error) {
      // ignore storage errors
    }
    document.body.classList.remove('intro-complete');
    document.body.classList.add('intro-active');

    requestAnimationFrame(() => {
      overlay.classList.add('active', 'reveal');
      overlay.setAttribute('aria-hidden', 'false');
      overlay.style.display = 'grid';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
    });

    setTimeout(() => {
      document.body.classList.add('intro-complete');
      overlay.classList.remove('active');
      overlay.classList.remove('reveal');
      overlay.setAttribute('aria-hidden', 'true');
      // Let the CSS opacity transition play out before hiding it completely,
      // instead of yanking it away with display:none immediately.
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 650);
    }, 2600);
  };

  // Initialize intro on page load
  if(document.readyState === 'complete'){
    initIntroSequence();
  } else {
    window.addEventListener('load', initIntroSequence, {once:true});
  }

  // Delegated fallback: ensure any .password-toggle click triggers the toggle
  // if the button does not already have a direct binding.
  document.addEventListener('click', function(e){
    try {
      var node = e.target;
      while(node && node !== document){
        if(node.classList && node.classList.contains && node.classList.contains('password-toggle')){
          if(node.dataset && node.dataset.passwordToggleBound === '1'){
            return;
          }
          e.preventDefault();
          try { window.togglePasswordVisibility(node); } catch (err) {}
          return;
        }
        node = node.parentNode;
      }
    } catch (err) { /* ignore */ }
  });

})();