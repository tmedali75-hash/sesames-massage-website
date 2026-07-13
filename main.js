/* ============================================================
   SÉSAMES — Logique du site (rendu dynamique + interactions)
   ============================================================ */
(function () {
  const DATA = SesamesStore.load();

  /* ---------- Utilitaires ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const waLink = (msg = "") => {
    const num = (DATA.centre.whatsapp || "").replace(/\D/g, "");
    const text = encodeURIComponent(msg || `Bonjour Sésames, je souhaite prendre un rendez-vous.`);
    return `https://wa.me/${num}?text=${text}`;
  };

  /* ---------- Injection des infos du centre ---------- */
  function renderCentre() {
    $$(".js-logo").forEach(el => (el.src = DATA.centre.logo));
    $$(".js-nom").forEach(el => (el.textContent = DATA.centre.nom));
    $$(".js-slogan").forEach(el => (el.textContent = DATA.centre.slogan));
    $$(".js-tel").forEach(el => {
      el.textContent = DATA.centre.telephone;
      if (el.tagName === "A") el.href = `tel:${DATA.centre.telephone.replace(/\s/g, "")}`;
    });
    $$(".js-adresse").forEach(el => (el.textContent = DATA.centre.adresse));
    $$(".js-annee").forEach(el => (el.textContent = new Date().getFullYear()));
    $$(".js-wa-link").forEach(el => (el.href = waLink()));
    const map = $(".js-map");
    if (map) map.src = DATA.centre.mapsEmbed;
    const horairesEl = $(".js-horaires");
    if (horairesEl) {
      horairesEl.innerHTML = DATA.centre.horaires
        .map(h => `<li><span>${h.jour}</span><strong>${h.heures}</strong></li>`)
        .join("");
    }
    const reseauxEl = $(".js-reseaux");
    if (reseauxEl && DATA.centre.reseaux) {
      const links = [];
      if (DATA.centre.reseaux.facebook) links.push(`<a href="${DATA.centre.reseaux.facebook}" target="_blank" rel="noopener">Facebook</a>`);
      if (DATA.centre.reseaux.instagram) links.push(`<a href="${DATA.centre.reseaux.instagram}" target="_blank" rel="noopener">Instagram</a>`);
      reseauxEl.innerHTML = links.join("");
    }
  }

  /* ---------- À propos ---------- */
  function renderApropos() {
    const a = DATA.apropos;
    if (!a) return;
    const t = $(".js-apropos-titre"); if (t) t.textContent = a.titre;
    const txt = $(".js-apropos-texte"); if (txt) txt.textContent = a.texte;
    const fn = $(".js-fondateur-nom"); if (fn) fn.textContent = a.fondateur;
    const ft = $(".js-fondateur-titre"); if (ft) ft.textContent = a.fondateurTitre;
  }

  /* ---------- Services ---------- */
  function serviceCard(s) {
    return `
    <article class="service-card reveal" data-cat="${s.categorie}">
      <div class="service-media">
        <img src="${s.image}" alt="${s.nom}" loading="lazy">
        <span class="service-tag">${s.categorie === "hijama" ? "Hijama" : "Massage"}</span>
      </div>
      <div class="service-body">
        <h3>${s.nom}</h3>
        <p>${s.description}</p>
        <div class="service-meta">
          <span>⏱ ${s.duree} min</span>
          <span class="price">${s.prix} DT</span>
        </div>
        <div class="service-footer">
          <button class="btn btn-primary btn-sm js-reserver" data-service="${s.nom}">Réserver</button>
        </div>
      </div>
    </article>`;
  }

  function renderServices(filter = "all") {
    const grid = $(".js-services-grid");
    if (!grid) return;
    const list = DATA.services.filter(s => filter === "all" || s.categorie === filter);
    grid.innerHTML = list.map(serviceCard).join("");
    observeReveals();
    bindReserveButtons();
    bindTilt();
    // Peuple le select du formulaire de réservation
    const select = $("#resa-service");
    if (select) {
      select.innerHTML =
        `<option value="">Choisir un soin</option>` +
        DATA.services.map(s => `<option value="${s.nom}">${s.nom} — ${s.prix} DT</option>`).join("");
    }
  }

  function bindTabs() {
    $$(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        $$(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderServices(btn.dataset.filter);
      });
    });
  }

  /* ---------- Bienfaits ---------- */
  const benefitIcons = ["✦", "✧", "❋", "☾", "✿", "❖"];
  function renderBienfaits() {
    const grid = $(".js-benefits-grid");
    if (!grid) return;
    grid.innerHTML = DATA.bienfaits
      .map(
        (b, i) => `
      <div class="benefit-card reveal reveal-delay-${i % 3}">
        <div class="benefit-icon">${benefitIcons[i % benefitIcons.length]}</div>
        <h3>${b.titre}</h3>
        <p>${b.texte}</p>
      </div>`
      )
      .join("");
    observeReveals();
  }

  /* ---------- Galerie ---------- */
  function renderGalerie() {
    const grid = $(".js-gallery-grid");
    if (!grid) return;
    grid.innerHTML = DATA.galerie
      .map(
        (src, i) => `
      <div class="gallery-item reveal reveal-delay-${i % 3}" data-src="${src}">
        <img src="${src}" alt="Galerie Sésames ${i + 1}" loading="lazy">
      </div>`
      )
      .join("");
    observeReveals();
    $$(".gallery-item").forEach(item => {
      item.addEventListener("click", () => openLightbox(item.dataset.src));
    });
  }

  function openLightbox(src) {
    const lb = $("#lightbox");
    $("#lightbox-img").src = src;
    lb.classList.add("open");
  }
  function bindLightbox() {
    $("#lightbox-close").addEventListener("click", () => $("#lightbox").classList.remove("open"));
    $("#lightbox").addEventListener("click", e => {
      if (e.target.id === "lightbox") e.target.classList.remove("open");
    });
  }

  /* ---------- Témoignages ---------- */
  function renderTemoignages() {
    const grid = $(".js-testimonials-grid");
    if (!grid) return;
    grid.innerHTML = DATA.temoignages
      .map(
        (t, i) => `
      <div class="testimonial-card reveal reveal-delay-${i % 3}">
        <div class="stars">${"★".repeat(t.note)}${"☆".repeat(5 - t.note)}</div>
        <p class="quote">« ${t.texte} »</p>
        <p class="testimonial-name">${t.nom}</p>
      </div>`
      )
      .join("");
    observeReveals();
  }

  /* ---------- Chiffres clés (compteurs animés) ---------- */
  function renderStats() {
    const grid = $(".js-stats-grid");
    if (!grid || !DATA.stats) return;
    grid.innerHTML = DATA.stats
      .map(
        (s, i) => `
      <div class="stat-card reveal reveal-delay-${i % 3}">
        <div class="stat-number" data-target="${s.valeur}" data-suffix="${s.suffixe || ""}">0${s.suffixe || ""}</div>
        <div class="stat-label">${s.label}</div>
      </div>`
      )
      .join("");
    observeReveals();
    observeCounters();
  }

  let countersObserver;
  function observeCounters() {
    if (!countersObserver) {
      countersObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              countersObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
    }
    $$(".stat-number").forEach(el => countersObserver.observe(el));
  }

  function animateCounter(el) {
    const target = Number(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Effet tilt 3D sur les cartes de services ---------- */
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function bindTilt() {
    if (!canHover) return;
    $$(".service-card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateY = ((x - cx) / cx) * 6;
        const rotateX = -((y - cy) / cy) * 6;
        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Barre de progression de scroll ---------- */
  function bindScrollProgress() {
    const bar = $(".js-scroll-bar");
    if (!bar) return;
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
    });
  }

  /* ---------- Reveal au scroll ---------- */
  let observer;
  function observeReveals() {
    if (!observer) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
    }
    $$(".reveal:not(.in-view)").forEach(el => observer.observe(el));
  }

  /* ---------- Navigation ---------- */
  function bindNav() {
    const nav = $(".js-nav");
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    });
    const toggle = $(".js-nav-toggle");
    const links = $(".js-nav-links");
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    $$(".js-nav-links a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
  }

  /* ---------- Modal réservation ---------- */
  function bindReserveButtons() {
    $$(".js-reserver").forEach(btn => {
      btn.addEventListener("click", () => openReservation(btn.dataset.service));
    });
  }
  function openReservation(serviceName) {
    $("#resa-modal").classList.add("open");
    if (serviceName) $("#resa-service").value = serviceName;
    document.body.style.overflow = "hidden";
  }
  function closeReservation() {
    $("#resa-modal").classList.remove("open");
    document.body.style.overflow = "";
  }
  function bindModal() {
    $$(".js-open-resa").forEach(el => el.addEventListener("click", () => openReservation("")));
    $("#resa-close").addEventListener("click", closeReservation);
    $("#resa-modal").addEventListener("click", e => {
      if (e.target.id === "resa-modal") closeReservation();
    });
  }

  /* ---------- Validation des formulaires ---------- */
  function validateField(field, rules) {
    const group = field.closest(".field");
    let valid = true;
    if (rules.required && !field.value.trim()) valid = false;
    if (rules.phone && field.value && !/^[+\d][\d\s().-]{6,}$/.test(field.value.trim())) valid = false;
    if (rules.email && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) valid = false;
    group.classList.toggle("error", !valid);
    return valid;
  }

  function showMsg(el, text, ok = true) {
    el.textContent = text;
    el.classList.remove("success", "err");
    el.classList.add("show", ok ? "success" : "err");
    setTimeout(() => el.classList.remove("show"), 5000);
  }

  function bindReservationForm() {
    const form = $("#resa-form");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const nom = $("#resa-nom");
      const tel = $("#resa-tel");
      const service = $("#resa-service");
      const date = $("#resa-date");
      const okNom = validateField(nom, { required: true });
      const okTel = validateField(tel, { required: true, phone: true });
      const okService = validateField(service, { required: true });
      const okDate = validateField(date, { required: true });
      const msgEl = $("#resa-msg");
      if (!(okNom && okTel && okService && okDate)) {
        showMsg(msgEl, "Merci de vérifier les champs indiqués en rouge.", false);
        return;
      }
      const reservation = {
        id: "r" + Date.now(),
        nom: nom.value.trim(),
        telephone: tel.value.trim(),
        service: service.value,
        date: date.value,
        message: $("#resa-message").value.trim(),
        creeLe: new Date().toISOString()
      };
      DATA.reservations = DATA.reservations || [];
      DATA.reservations.push(reservation);
      SesamesStore.save(DATA);
      showMsg(msgEl, "Votre demande a bien été envoyée. Nous vous confirmons rapidement votre créneau !", true);
      form.reset();
      setTimeout(closeReservation, 1600);
    });
  }

  function bindContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const nom = $("#contact-nom");
      const email = $("#contact-email");
      const message = $("#contact-message");
      const okNom = validateField(nom, { required: true });
      const okEmail = validateField(email, { required: true, email: true });
      const okMsg = validateField(message, { required: true });
      const msgEl = $("#contact-msg");
      if (!(okNom && okEmail && okMsg)) {
        showMsg(msgEl, "Merci de vérifier les champs indiqués en rouge.", false);
        return;
      }
      showMsg(msgEl, "Merci ! Votre message a bien été transmis à notre équipe.", true);
      form.reset();
    });
  }

  /* ---------- Année copyright & init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderCentre();
    renderApropos();
    renderStats();
    renderServices();
    renderBienfaits();
    renderGalerie();
    renderTemoignages();
    bindTabs();
    bindNav();
    bindModal();
    bindLightbox();
    bindReservationForm();
    bindContactForm();
    bindScrollProgress();
  });
})();
