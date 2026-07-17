/* ============================================================
   SÉSAMES — Espace administrateur
   Mot de passe par défaut : firas.selmi.692005
   (modifiable à tout moment depuis l'onglet "Général → Sécurité"
   une fois connecté à l'espace administrateur)
   ============================================================ */
(function () {
  const ADMIN_KEY = "sesames_admin_pass";
  const DEFAULT_PASS = "firas.selmi.692005";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const uid = p => p + Math.random().toString(36).slice(2, 8);

  let DATA = SesamesStore.load();

  function getPass() {
    try {
      return localStorage.getItem(ADMIN_KEY) || DEFAULT_PASS;
    } catch (e) {
      console.warn("Sésames: stockage local indisponible, mot de passe par défaut utilisé.", e);
      return DEFAULT_PASS;
    }
  }

  /* ---------- Synchronisation du logo & nom (identique à la page publique) ---------- */
  function syncBrand() {
    $$(".js-logo").forEach(el => (el.src = DATA.centre.logo));
    $$(".js-nom").forEach(el => (el.textContent = DATA.centre.nom));
  }

  /* ---------- Authentification ---------- */
  function initAuth() {
    syncBrand();
    const loginScreen = $("#login-screen");
    const panel = $("#admin-panel");
    const isAuthed = sessionStorage.getItem("sesames_admin_ok") === "1";
    if (isAuthed) {
      loginScreen.style.display = "none";
      panel.style.display = "block";
      syncBrand();
      renderAll();
    }
    $("#login-form").addEventListener("submit", e => {
      e.preventDefault();
      const val = $("#login-pass").value;
      if (val === getPass()) {
        sessionStorage.setItem("sesames_admin_ok", "1");
        loginScreen.style.display = "none";
        panel.style.display = "block";
        syncBrand();
        renderAll();
      } else {
        $("#login-error").textContent = "Mot de passe incorrect.";
      }
    });
    $("#logout-btn").addEventListener("click", () => {
      sessionStorage.removeItem("sesames_admin_ok");
      location.reload();
    });
  }

  /* ---------- Navigation des onglets ---------- */
  function initTabs() {
    $$(".admin-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        $$(".admin-tab").forEach(t => t.classList.remove("active"));
        $$(".admin-panel-section").forEach(s => s.classList.remove("active"));
        tab.classList.add("active");
        $("#panel-" + tab.dataset.tab).classList.add("active");
      });
    });
  }

  function toast(text, ok = true) {
    const el = $("#admin-toast");
    el.textContent = text;
    el.className = "admin-toast show " + (ok ? "ok" : "err");
    setTimeout(() => el.classList.remove("show"), 3000);
  }

  function persist() {
    const ok = SesamesStore.save(DATA);
    if (ok) {
      toast("Modifications enregistrées ✓");
    } else {
      toast("Stockage local indisponible : les modifications n'ont pas pu être enregistrées dans ce navigateur.", false);
    }
  }

  /* ================= GÉNÉRAL ================= */
  function renderGeneral() {
    $("#gen-nom").value = DATA.centre.nom;
    $("#gen-slogan").value = DATA.centre.slogan;
    $("#gen-tel").value = DATA.centre.telephone;
    $("#gen-wa").value = DATA.centre.whatsapp;
    $("#gen-adresse").value = DATA.centre.adresse;
    $("#gen-maps").value = DATA.centre.mapsEmbed;
    $("#gen-fb").value = DATA.centre.reseaux.facebook || "";
    $("#gen-ig").value = DATA.centre.reseaux.instagram || "";
    $("#gen-logo-preview").src = DATA.centre.logo;
    $("#gen-apropos-titre").value = DATA.apropos.titre;
    $("#gen-apropos-texte").value = DATA.apropos.texte;
    $("#gen-fondateur").value = DATA.apropos.fondateur;
    $("#gen-fondateur-titre").value = DATA.apropos.fondateurTitre;
    renderHoraires();
    renderStatsAdmin();
  }

  function renderStatsAdmin() {
    const wrap = $("#gen-stats");
    if (!wrap || !DATA.stats) return;
    wrap.innerHTML = DATA.stats
      .map(
        (s, i) => `
      <div class="admin-row" style="grid-template-columns:1fr 90px 1fr;">
        <input type="text" value="${sesamesEscapeHtml(s.label)}" data-i="${i}" data-f="label" class="js-stat-field" placeholder="Libellé">
        <input type="number" value="${sesamesEscapeHtml(s.valeur)}" data-i="${i}" data-f="valeur" class="js-stat-field" placeholder="Valeur">
        <input type="text" value="${sesamesEscapeHtml(s.suffixe || "")}" data-i="${i}" data-f="suffixe" class="js-stat-field" placeholder="Suffixe (+, %, ...)">
      </div>`
      )
      .join("");
    $$(".js-stat-field").forEach(inp =>
      inp.addEventListener("change", () => {
        const i = inp.dataset.i, f = inp.dataset.f;
        DATA.stats[i][f] = f === "valeur" ? Number(inp.value) || 0 : inp.value;
        persist();
      })
    );
  }

  function renderHoraires() {
    const wrap = $("#gen-horaires");
    wrap.innerHTML = DATA.centre.horaires
      .map(
        (h, i) => `
      <div class="admin-row">
        <input type="text" value="${sesamesEscapeHtml(h.jour)}" data-i="${i}" data-f="jour" class="js-horaire">
        <input type="text" value="${sesamesEscapeHtml(h.heures)}" data-i="${i}" data-f="heures" class="js-horaire">
        <button class="icon-btn js-del-horaire" data-i="${i}" title="Supprimer">✕</button>
      </div>`
      )
      .join("");
    $$(".js-horaire").forEach(inp =>
      inp.addEventListener("change", () => {
        DATA.centre.horaires[inp.dataset.i][inp.dataset.f] = inp.value;
      })
    );
    $$(".js-del-horaire").forEach(btn =>
      btn.addEventListener("click", () => {
        DATA.centre.horaires.splice(btn.dataset.i, 1);
        renderHoraires();
      })
    );
  }

  function bindGeneral() {
    $("#gen-form").addEventListener("submit", e => {
      e.preventDefault();
      DATA.centre.nom = $("#gen-nom").value;
      DATA.centre.slogan = $("#gen-slogan").value;
      DATA.centre.telephone = $("#gen-tel").value;
      DATA.centre.whatsapp = $("#gen-wa").value;
      DATA.centre.adresse = $("#gen-adresse").value;
      DATA.centre.mapsEmbed = $("#gen-maps").value;
      DATA.centre.reseaux.facebook = $("#gen-fb").value;
      DATA.centre.reseaux.instagram = $("#gen-ig").value;
      DATA.apropos.titre = $("#gen-apropos-titre").value;
      DATA.apropos.texte = $("#gen-apropos-texte").value;
      DATA.apropos.fondateur = $("#gen-fondateur").value;
      DATA.apropos.fondateurTitre = $("#gen-fondateur-titre").value;
      persist();
    });
    $("#gen-add-horaire").addEventListener("click", () => {
      DATA.centre.horaires.push({ jour: "Jour", heures: "Heures" });
      renderHoraires();
    });
    $("#gen-logo-input").addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        DATA.centre.logo = reader.result;
        syncBrand();
        persist();
      };
      reader.readAsDataURL(file);
    });
    $("#change-pass-form").addEventListener("submit", e => {
      e.preventDefault();
      const val = $("#new-pass").value.trim();
      if (val.length < 4) {
        toast("Le mot de passe doit contenir au moins 4 caractères.", false);
        return;
      }
      try {
        localStorage.setItem(ADMIN_KEY, val);
        $("#new-pass").value = "";
        toast("Mot de passe mis à jour ✓");
      } catch (err) {
        toast("Stockage local indisponible : le mot de passe n'a pas pu être changé dans ce navigateur.", false);
      }
    });
  }

  /* ================= SERVICES ================= */
  function serviceRow(s) {
    return `
    <div class="admin-card" data-id="${sesamesEscapeHtml(s.id)}">
      <div class="admin-card-grid">
        <select class="js-s-cat">
          <option value="massage" ${s.categorie === "massage" ? "selected" : ""}>Massage</option>
          <option value="hijama" ${s.categorie === "hijama" ? "selected" : ""}>Hijama</option>
        </select>
        <input type="text" class="js-s-nom" value="${sesamesEscapeHtml(s.nom)}" placeholder="Nom du service">
        <input type="number" class="js-s-duree" value="${sesamesEscapeHtml(s.duree)}" placeholder="Durée (min)">
        <input type="number" class="js-s-prix" value="${sesamesEscapeHtml(s.prix)}" placeholder="Prix (DT)">
      </div>
      <textarea class="js-s-desc" rows="2" placeholder="Description">${sesamesEscapeHtml(s.description)}</textarea>
      <input type="text" class="js-s-image" value="${sesamesEscapeHtml(s.image)}" placeholder="URL de l'image">
      <div class="admin-card-actions">
        <button class="btn btn-outline btn-sm js-s-save">Enregistrer</button>
        <button class="btn btn-sm admin-danger js-s-del">Supprimer</button>
      </div>
    </div>`;
  }

  function renderServices() {
    const wrap = $("#services-list");
    wrap.innerHTML = DATA.services.map(serviceRow).join("");
    $$("#services-list .admin-card").forEach(card => {
      const id = card.dataset.id;
      card.querySelector(".js-s-save").addEventListener("click", () => {
        const s = DATA.services.find(x => x.id === id);
        s.categorie = card.querySelector(".js-s-cat").value;
        s.nom = card.querySelector(".js-s-nom").value;
        s.duree = Number(card.querySelector(".js-s-duree").value) || 0;
        s.prix = Number(card.querySelector(".js-s-prix").value) || 0;
        s.description = card.querySelector(".js-s-desc").value;
        s.image = card.querySelector(".js-s-image").value;
        persist();
      });
      card.querySelector(".js-s-del").addEventListener("click", () => {
        if (!confirm("Supprimer ce service ?")) return;
        DATA.services = DATA.services.filter(x => x.id !== id);
        persist();
        renderServices();
      });
    });
  }

  function bindServices() {
    $("#add-service").addEventListener("click", () => {
      DATA.services.unshift({
        id: uid("s"),
        categorie: "massage",
        nom: "Nouveau service",
        description: "Description du soin",
        duree: 60,
        prix: 90,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop"
      });
      renderServices();
      persist();
    });
  }

  /* ================= GALERIE ================= */
  function renderGalerie() {
    const wrap = $("#gallery-list");
    wrap.innerHTML = DATA.galerie
      .map(
        (src, i) => `
      <div class="admin-row">
        <img src="${sesamesEscapeHtml(src)}" class="admin-thumb">
        <input type="text" value="${sesamesEscapeHtml(src)}" data-i="${i}" class="js-gal-url">
        <button class="icon-btn js-gal-del" data-i="${i}">✕</button>
      </div>`
      )
      .join("");
    $$(".js-gal-url").forEach(inp =>
      inp.addEventListener("change", () => {
        DATA.galerie[inp.dataset.i] = inp.value;
        persist();
        renderGalerie();
      })
    );
    $$(".js-gal-del").forEach(btn =>
      btn.addEventListener("click", () => {
        DATA.galerie.splice(btn.dataset.i, 1);
        persist();
        renderGalerie();
      })
    );
  }
  function bindGalerie() {
    $("#add-gallery").addEventListener("click", () => {
      const url = $("#new-gallery-url").value.trim();
      if (!url) return;
      DATA.galerie.push(url);
      $("#new-gallery-url").value = "";
      persist();
      renderGalerie();
    });
  }

  /* ================= TÉMOIGNAGES ================= */
  function renderTemoignages() {
    const wrap = $("#testi-list");
    wrap.innerHTML = DATA.temoignages
      .map(
        (t, i) => `
      <div class="admin-card">
        <div class="admin-card-grid">
          <input type="text" value="${sesamesEscapeHtml(t.nom)}" data-i="${i}" data-f="nom" class="js-t-field" placeholder="Nom">
          <select data-i="${i}" data-f="note" class="js-t-field">
            ${[5, 4, 3, 2, 1].map(n => `<option value="${n}" ${t.note === n ? "selected" : ""}>${n} étoiles</option>`).join("")}
          </select>
        </div>
        <textarea data-i="${i}" data-f="texte" class="js-t-field" rows="2">${sesamesEscapeHtml(t.texte)}</textarea>
        <div class="admin-card-actions">
          <button class="btn btn-sm admin-danger js-t-del" data-i="${i}">Supprimer</button>
        </div>
      </div>`
      )
      .join("");
    $$(".js-t-field").forEach(el =>
      el.addEventListener("change", () => {
        const i = el.dataset.i, f = el.dataset.f;
        DATA.temoignages[i][f] = f === "note" ? Number(el.value) : el.value;
        persist();
      })
    );
    $$(".js-t-del").forEach(btn =>
      btn.addEventListener("click", () => {
        DATA.temoignages.splice(btn.dataset.i, 1);
        persist();
        renderTemoignages();
      })
    );
  }
  function bindTemoignages() {
    $("#add-testi").addEventListener("click", () => {
      DATA.temoignages.unshift({ nom: "Nouveau client", texte: "Témoignage à modifier.", note: 5 });
      persist();
      renderTemoignages();
    });
  }

  /* ================= RÉSERVATIONS ================= */
  function renderReservations() {
    const wrap = $("#resa-list");
    const list = (DATA.reservations || []).slice().reverse();
    if (!list.length) {
      wrap.innerHTML = `<p class="admin-empty">Aucune demande de réservation pour le moment.</p>`;
      return;
    }
    wrap.innerHTML = list
      .map(
        r => `
      <div class="admin-card">
        <div class="admin-card-grid">
          <strong>${sesamesEscapeHtml(r.nom)}</strong>
          <span>${sesamesEscapeHtml(r.telephone)}</span>
          <span>${sesamesEscapeHtml(r.service)}</span>
          <span>${sesamesEscapeHtml(r.date)}</span>
        </div>
        ${r.message ? `<p style="margin:6px 0 0;color:var(--ink-soft);font-size:.88rem;">${sesamesEscapeHtml(r.message)}</p>` : ""}
        <div class="admin-card-actions">
          <button class="btn btn-sm admin-danger js-resa-del" data-id="${sesamesEscapeHtml(r.id)}">Supprimer</button>
        </div>
      </div>`
      )
      .join("");
    $$(".js-resa-del").forEach(btn =>
      btn.addEventListener("click", () => {
        DATA.reservations = DATA.reservations.filter(r => r.id !== btn.dataset.id);
        persist();
        renderReservations();
      })
    );
  }

  /* ---------- Rendu global ---------- */
  function renderAll() {
    syncBrand();
    renderGeneral();
    renderServices();
    renderGalerie();
    renderTemoignages();
    renderReservations();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAuth();
    initTabs();
    bindGeneral();
    bindServices();
    bindGalerie();
    bindTemoignages();
  });
})();
