const state = {
  currentUser: null,
  users: [],
  campaigns: [],
  alerts: [],
  vaccines: [],
  records: [],
  posts: [],
  selectedCampaignId: null,
  selectedAlertId: null,
  currentRoute: "home"
};

const routes = ["home", "campaigns", "admin", "vaccination", "posts", "alerts"];

document.addEventListener("DOMContentLoaded", init);

function init() {
  bindEvents();
  restoreSession();
}

function bindEvents() {
  byId("loginForm")?.addEventListener("submit", handleLogin);
  byId("logoutBtn")?.addEventListener("click", logout);
  byId("openRegister")?.addEventListener("click", () => showModal("accountModal"));
  byId("saveAccount")?.addEventListener("click", handleAccountCreate);
  byId("campaignForm")?.addEventListener("submit", saveCampaign);
  byId("clearCampaignBtn")?.addEventListener("click", resetCampaignForm);
  byId("deleteCampaignBtn")?.addEventListener("click", deleteCampaign);
  
  byId("alertForm")?.addEventListener("submit", saveAlert); 
  byId("clearAlertBtn")?.addEventListener("click", resetAlertForm);
  byId("deleteAlertBtn")?.addEventListener("click", deleteAlert);

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => showRoute(button.dataset.route));
  });

  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => showAdminTab(button.dataset.adminTab));
  });

  document.querySelectorAll("[data-vaccine-tab]").forEach((button) => {
    button.addEventListener("click", () => showVaccineTab(button.dataset.vaccineTab));
  });

  window.addEventListener("hashchange", () => {
    const route = normalizeRoute(location.hash.replace("#", ""));
    if (state.currentUser) showRoute(route, false);
  });
}

async function restoreSession() {
  const savedUser = sessionStorage.getItem("usuarioCorrente");
  if (!savedUser) {
    showLogin();
    return;
  }

  try {
    state.currentUser = JSON.parse(savedUser);
    await startApp();
  } catch {
    sessionStorage.removeItem("usuarioCorrente");
    showLogin();
  }
}

async function handleLogin(event) {
  event.preventDefault();
  setMessage("loginMessage", "");

  const login = byId("loginUsuario").value.trim();
  const password = byId("loginSenha").value.trim();

  if (!login || !password) {
    setMessage("loginMessage", "Informe login e senha.", "danger");
    return;
  }

  try {
    const users = await fetchJson("/usuarios");
    const user = users.find((item) => item.login === login && item.senha === password);

    if (!user) {
      setMessage("loginMessage", "Login ou senha inválidos.", "danger");
      return;
    }

    state.currentUser = {
      id: user.id,
      login: user.login,
      nome: user.nome || user.login,
      email: user.email || ""
    };
    sessionStorage.setItem("usuarioCorrente", JSON.stringify(state.currentUser));
    byId("loginForm").reset();
    await startApp();
  } catch {
    setMessage("loginMessage", "Não foi possível aceder ao servidor.", "danger");
  }
}

async function handleAccountCreate() {
  const form = byId("accountForm");
  const name = byId("accountName").value.trim();
  const email = byId("accountEmail").value.trim();
  const login = byId("accountLogin").value.trim();
  const password = byId("accountPassword").value.trim();
  const confirm = byId("accountPassword2").value.trim();

  if (!name || !email || !login || !password || !confirm) {
    alert("Preencha todos os campos da conta.");
    return;
  }

  if (password !== confirm) {
    alert("As senhas não conferem.");
    return;
  }

  const users = await fetchJson("/usuarios");
  if (users.some((user) => user.login === login || user.email === email)) {
    alert("Já existe uma conta com esse login ou e-mail.");
    return;
  }

  await fetchJson("/usuarios", {
    method: "POST",
    body: {
      login,
      senha: password,
      nome: name,
      email
    }
  });

  form.reset();
  hideModal("accountModal");
  setMessage("loginMessage", "Conta criada. Entre com o seu login e senha.", "success");
}

async function startApp() {
  byId("loginScreen").classList.add("d-none");
  byId("appScreen").classList.remove("d-none");
  byId("bottomNav").classList.remove("d-none");
  byId("currentUser").textContent = state.currentUser.nome || state.currentUser.login;
  applyRoleVisibility();

  await loadData();
  const route = normalizeRoute(location.hash.replace("#", ""));
  showRoute(route || "home");
}

function showLogin() {
  byId("loginScreen").classList.remove("d-none");
  byId("appScreen").classList.add("d-none");
  byId("bottomNav").classList.add("d-none");
}

function logout() {
  sessionStorage.removeItem("usuarioCorrente");
  state.currentUser = null;
  document.body.classList.remove("is-admin", "is-user");
  location.hash = "";
  showLogin();
}

async function loadData() {
  const [users, campaigns, alerts, vaccines, records, posts] = await Promise.all([
    fetchJson("/usuarios"),
    fetchJson("/campanhas"),
    fetchJson("/alertas"),
    fetchJson("/vacinas"),
    fetchJson("/registros"),
    fetchJson("/postos_saude")
  ]);

  state.users = users;
  state.campaigns = campaigns;
  state.alerts = alerts;
  state.vaccines = vaccines;
  state.records = records;
  state.posts = posts;

  renderAll();
}

function renderAll() {
  renderHome();
  renderActiveCampaigns();
  renderAdmin();
  renderCampaigns();
  renderAlertsAdmin();
  renderPosts();
}

function showRoute(routeName, updateHash = true) {
  const route = normalizeRoute(routeName);
  state.currentRoute = route;

  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  byId(`view-${route}`)?.classList.add("active");

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === route);
  });

  if (updateHash && location.hash !== `#${route}`) {
    location.hash = route;
  }

  if (route === "admin") renderAdmin();
  if (route === "campaigns") renderActiveCampaigns();
  if (route === "vaccination") renderVaccines();
  if (route === "alerts") renderAlerts();
}

function normalizeRoute(routeName) {
  const route = routes.includes(routeName) ? routeName : "home";

  if (!isAdmin() && route === "admin") {
    return "campaigns";
  }

  if (isAdmin() && route === "campaigns") {
    return "admin";
  }

  return route;
}

function showAdminTab(tab) {
  const normalized = tab === "alerts" ? "alerts" : "campaigns";
  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTab === normalized);
  });
  document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.remove("active"));
  byId(`admin-${normalized}`).classList.add("active");
}

function showVaccineTab(tab) {
  const normalized = ["list", "calendar", "history"].includes(tab) ? tab : "list";
  document.querySelectorAll("[data-vaccine-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.vaccineTab === normalized);
  });
  document.querySelectorAll(".vaccine-panel").forEach((panel) => panel.classList.remove("active"));
  byId(`vaccines-${normalized}`).classList.add("active");
}

function applyRoleVisibility() {
  document.body.classList.toggle("is-admin", isAdmin());
  document.body.classList.toggle("is-user", !isAdmin());
}

function isAdmin() {
  return state.currentUser?.login === "admin";
}

function activeCampaigns() {
  return state.campaigns.filter((campaign) => String(campaign.status || "").toLowerCase() === "ativa");
}

function renderHome() {
  byId("metricCampaigns").textContent = activeCampaigns().length;
  byId("metricAlerts").textContent = state.alerts.length;
  byId("metricVaccines").textContent = visibleVaccines().length;
  updateAlertBadges();
}

function renderActiveCampaigns() {
  const list = byId("activeCampaignsList");
  if (!list) return;

  const campaigns = activeCampaigns();

  if (!campaigns.length) {
    list.innerHTML = emptyState("Nenhuma campanha ativa no momento.", "Quando uma campanha estiver aberta, ela aparecerá aqui.");
    return;
  }

  list.innerHTML = campaigns.map((campaign) => `
    <article class="app-card campaign-card">
      <div class="panel-icon"><i class="bi bi-megaphone"></i></div>
      <div>
        <span class="badge-soft badge-active">Ativa</span>
        <h2>${escapeHtml(campaign.vacina)}</h2>
        <p>${escapeHtml(campaign.publico_alvo)}</p>
        <div class="campaign-period"><i class="bi bi-calendar3"></i> ${formatDate(campaign.data_inicio)} até ${formatDate(campaign.data_fim)}</div>
      </div>
    </article>
  `).join("");
}

function renderAdmin() {
  byId("adminCampaignCount").textContent = state.campaigns.length;
  byId("adminAlertCount").textContent = state.alerts.length;
  byId("adminUnreadCount").textContent = state.alerts.filter((alertItem) => !alertItem.lido).length;
}

function renderCampaigns() {
  const tbody = byId("campaignTable")?.querySelector("tbody");
  if (!tbody) return;

  byId("campaignListStatus").textContent = `${state.campaigns.length} cadastradas`;
  tbody.innerHTML = state.campaigns.map((campaign) => `
    <tr data-campaign-id="${escapeHtml(campaign.id)}" class="${campaign.id === state.selectedCampaignId ? "selected-row" : ""}">
      <td>
        <div class="table-title">${escapeHtml(campaign.vacina)}</div>
        <div class="table-subtitle">Clique para editar</div>
      </td>
      <td>${formatDate(campaign.data_inicio)} até ${formatDate(campaign.data_fim)}</td>
      <td>${escapeHtml(campaign.publico_alvo)}</td>
      <td><span class="badge-soft ${statusClass(campaign.status)}">${escapeHtml(campaign.status)}</span></td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-campaign-id]").forEach((row) => {
    row.addEventListener("click", () => fillCampaignForm(row.dataset.campaignId));
  });
}

function fillCampaignForm(id) {
  const campaign = state.campaigns.find((item) => String(item.id) === String(id));
  if (!campaign) return;

  state.selectedCampaignId = campaign.id;
  byId("campaignFormTitle").textContent = "Editar campanha";
  byId("campaignSaveText").textContent = "Atualizar campanha";
  byId("deleteCampaignBtn").classList.remove("d-none");
  byId("campaignVaccine").value = campaign.vacina || "";
  byId("campaignStart").value = campaign.data_inicio || "";
  byId("campaignEnd").value = campaign.data_fim || "";
  byId("campaignAudience").value = campaign.publico_alvo || "";
  byId("campaignStatus").value = campaign.status || "Ativa";
  renderCampaigns();
}

async function saveCampaign(event) {
  event.preventDefault();
  const payload = {
    vacina: byId("campaignVaccine").value.trim(),
    data_inicio: byId("campaignStart").value,
    data_fim: byId("campaignEnd").value,
    publico_alvo: byId("campaignAudience").value.trim(),
    status: byId("campaignStatus").value
  };

  if (!payload.vacina || !payload.data_inicio || !payload.data_fim || !payload.publico_alvo) {
    alert("Preencha todos os dados da campanha.");
    return;
  }

  if (payload.data_fim < payload.data_inicio) {
    alert("A data final não pode ser anterior à data de início.");
    return;
  }

  if (state.selectedCampaignId) {
    await fetchJson(`/campanhas/${state.selectedCampaignId}`, { method: "PATCH", body: payload });
  } else {
    await fetchJson("/campanhas", { method: "POST", body: payload });
  }

  resetCampaignForm();
  await loadData();
  showAdminTab("campaigns");
}

async function deleteCampaign() {
  if (!state.selectedCampaignId || !confirm("Excluir esta campanha?")) return;
  await fetchJson(`/campanhas/${state.selectedCampaignId}`, { method: "DELETE" });
  resetCampaignForm();
  await loadData();
  showAdminTab("campaigns");
}

function resetCampaignForm() {
  state.selectedCampaignId = null;
  byId("campaignForm").reset();
  byId("campaignFormTitle").textContent = "Nova campanha";
  byId("campaignSaveText").textContent = "Salvar campanha";
  byId("deleteCampaignBtn").classList.add("d-none");
  renderCampaigns();
}

function renderAlertsAdmin() {
  const tbody = byId("alertTable")?.querySelector("tbody");
  if (!tbody) return;

  byId("alertListStatus").textContent = `${state.alerts.length} cadastrados`;
  tbody.innerHTML = state.alerts.map((alertItem) => `
    <tr data-alert-id="${escapeHtml(alertItem.id)}" class="${alertItem.id === state.selectedAlertId ? "selected-row" : ""}">
      <td>
        <div class="table-title">${escapeHtml(alertItem.titulo)}</div>
        <div class="table-subtitle">${escapeHtml(alertItem.descricao_curta)}</div>
      </td>
      <td><span class="badge-soft ${alertTypeClass(alertItem.tipo)}">${alertItem.tipo === "warning" ? "Atenção" : "Informativo"}</span></td>
      <td><span class="badge-soft ${alertItem.lido ? "badge-read" : "badge-unread"}">${alertItem.lido ? "Lido" : "Não lido"}</span></td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-alert-id]").forEach((row) => {
    row.addEventListener("click", () => fillAlertForm(row.dataset.alertId));
  });
}

function fillAlertForm(id) {
  const alertItem = state.alerts.find((item) => String(item.id) === String(id));
  if (!alertItem) return;

  state.selectedAlertId = alertItem.id;
  byId("alertFormTitle").textContent = "Editar aviso";
  byId("alertSaveText").textContent = "Atualizar aviso";
  byId("deleteAlertBtn").classList.remove("d-none");
  byId("alertType").value = alertItem.tipo || "info";
  byId("alertIcon").value = alertItem.icone || "bi-info-circle-fill";
  byId("alertTitle").value = alertItem.titulo || "";
  byId("alertDescription").value = alertItem.descricao_curta || "";
  byId("alertModalTitle").value = alertItem.modal_titulo || "";
  byId("alertBody").value = stripUnsafeHtml(alertItem.modal_corpo || "");
  byId("alertFooter").value = alertItem.modal_rodape || "";
  renderAlertsAdmin();
}

async function saveAlert(event) {
  event.preventDefault();
  
  const payload = {
    tipo: byId("alertType")?.value || "info",
    icone: byId("alertIcon")?.value.trim() || "bi-info-circle-fill",
    titulo: byId("alertTitle")?.value.trim() || "",
    descricao_curta: byId("alertDescription")?.value.trim() || "",
    modal_titulo: byId("alertModalTitle")?.value.trim() || "",
    modal_corpo: byId("alertBody")?.value.trim() || "",
    modal_rodape: byId("alertFooter")?.value.trim() || "",
    lido: false 
  };

  if (!payload.titulo || !payload.descricao_curta) {
    alert("Preencha o título e a descrição curta do aviso.");
    return;
  }

  if (state.selectedAlertId) {
    await fetchJson(`/alertas/${state.selectedAlertId}`, { method: "PATCH", body: payload });
  } else {
    await fetchJson("/alertas", { method: "POST", body: payload });
  }

  resetAlertForm();
  await loadData();
  showAdminTab("alerts");
}

async function deleteAlert() {
  if (!state.selectedAlertId || !confirm("Excluir este aviso?")) return;
  await fetchJson(`/alertas/${state.selectedAlertId}`, { method: "DELETE" });
  resetAlertForm();
  await loadData();
  showAdminTab("alerts");
}

function resetAlertForm() {
  state.selectedAlertId = null;
  byId("alertForm").reset();
  byId("alertFormTitle").textContent = "Novo aviso";
  byId("alertSaveText").textContent = "Salvar aviso";
  byId("deleteAlertBtn").classList.add("d-none");
  renderAlertsAdmin();
}

function renderVaccines() {
  const vaccines = visibleVaccines();
  const completed = vaccines.filter((vaccine) => vaccine.concluida).length;
  const percent = vaccines.length ? Math.round((completed / vaccines.length) * 100) : 0;

  byId("progressPercent").textContent = `${percent}%`;
  byId("progressBar").style.width = `${percent}%`;
  byId("progressText").textContent = `${completed} de ${vaccines.length} vacinas concluídas`;

  renderVaccineList(vaccines);
  renderCalendar(vaccines);
  renderHistory(vaccines);
}

function renderVaccineList(vaccines) {
  const list = byId("vaccineList");
  if (!list) return;

  if (!vaccines.length) {
    list.innerHTML = emptyState("Nenhuma vacina cadastrada.");
    return;
  }

  list.innerHTML = vaccines.map((vaccine) => `
    <article class="vaccine-card ${vaccine.concluida ? "vaccine-done" : "vaccine-pending"}">
      <div class="vaccine-main">
        <div class="vaccine-icon"><i class="bi ${vaccine.concluida ? "bi-shield-check" : "bi-shield-plus"}"></i></div>
        <div>
          <div class="vaccine-title-row">
            <h3>${escapeHtml(vaccine.nome)}</h3>
            <span class="badge-soft ${vaccine.concluida ? "badge-read" : "badge-warning"}">${vaccine.concluida ? "Concluída" : "Pendente"}</span>
          </div>
          <p>${vaccine.concluida ? `Aplicada em ${formatDate(vaccine.dataConclusao)}` : "Aguardando agendamento ou registro."}</p>
          <div class="vaccine-meta">
            ${vaccine.dataProximaDose ? `<span><i class="bi bi-calendar3"></i> Próxima: ${formatDate(vaccine.dataProximaDose)}</span>` : ""}
            ${vaccine.campanha ? `<span><i class="bi bi-megaphone"></i> ${escapeHtml(vaccine.nomeCampanha || "Campanha ativa")}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="item-actions">
        <button class="action-button" title="${vaccine.concluida ? "Marcar como pendente" : "Marcar como concluída"}" data-toggle-vaccine="${escapeHtml(vaccine.id)}">
          <i class="bi ${vaccine.concluida ? "bi-arrow-counterclockwise" : "bi-check2-circle"}"></i>
          ${vaccine.concluida ? "Reabrir" : "Concluir"}
        </button>
        <button class="icon-button soft-button" title="Ocultar vacina" aria-label="Ocultar vacina" data-hide-vaccine="${escapeHtml(vaccine.id)}">
          <i class="bi bi-eye-slash"></i>
        </button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-toggle-vaccine]").forEach((button) => {
    button.addEventListener("click", () => toggleVaccine(button.dataset.toggleVaccine));
  });

  list.querySelectorAll("[data-hide-vaccine]").forEach((button) => {
    button.addEventListener("click", () => hideVaccine(button.dataset.hideVaccine));
  });
}

async function toggleVaccine(id) {
  const vaccine = state.vaccines.find((item) => String(item.id) === String(id));
  if (!vaccine) return;

  const done = !vaccine.concluida;
  await fetchJson(`/vacinas/${id}`, {
    method: "PATCH",
    body: {
      concluida: done,
      dataConclusao: done ? todayIso() : null,
      dataProximaDose: done ? nextDoseFor(vaccine.nome) : null
    }
  });
  await loadData();
  renderVaccines();
}

async function hideVaccine(id) {
  if (!confirm("Ocultar esta vacina da carteira?")) return;
  await fetchJson(`/vacinas/${id}`, { method: "PATCH", body: { visivel: false } });
  await loadData();
  renderVaccines();
}

function renderCalendar(vaccines) {
  const list = byId("calendarList");
  if (!list) return;

  const scheduled = vaccines
    .filter((vaccine) => vaccine.dataProximaDose)
    .sort((a, b) => String(a.dataProximaDose).localeCompare(String(b.dataProximaDose)));

  if (!scheduled.length) {
    list.innerHTML = emptyState("Nenhuma próxima dose registrada.");
    return;
  }

  list.innerHTML = scheduled.map((vaccine) => {
    const status = dateStatus(vaccine.dataProximaDose);
    return `
      <article class="timeline-item">
        <div class="timeline-dot"><i class="bi bi-calendar3"></i></div>
        <div>
          <h3>${escapeHtml(vaccine.nome)}</h3>
          <p>Próxima dose: ${formatDate(vaccine.dataProximaDose)}</p>
        </div>
        <span class="badge-soft ${status.className}">${status.label}</span>
      </article>
    `;
  }).join("");
}

function renderHistory(vaccines) {
  const list = byId("historyList");
  if (!list) return;

  const history = vaccines
    .filter((vaccine) => vaccine.dataConclusao)
    .sort((a, b) => String(b.dataConclusao).localeCompare(String(a.dataConclusao)));

  if (!history.length) {
    list.innerHTML = emptyState("Nenhuma dose concluída ainda.");
    return;
  }

  list.innerHTML = history.map((vaccine) => `
    <article class="timeline-item">
      <div class="timeline-dot done"><i class="bi bi-check2"></i></div>
      <div>
        <h3>${escapeHtml(vaccine.nome)}</h3>
        <p>Dose registrada em ${formatDate(vaccine.dataConclusao)}</p>
      </div>
      <span class="badge-soft badge-read">Concluída</span>
    </article>
  `).join("");
}

function renderPosts() {
  const list = byId("postsList");
  if (!list) return;

  if (!state.posts.length) {
    list.innerHTML = emptyState("Nenhum posto cadastrado.");
    return;
  }

  list.innerHTML = state.posts.map((post) => `
    <article class="app-card post-card">
      <div class="post-card-header">
        <div class="post-icon"><i class="bi bi-hospital"></i></div>
        <span class="badge-soft badge-active">Atendimento</span>
      </div>
      <h2>${escapeHtml(post.nome)}</h2>
      <div class="post-info">
        <span><i class="bi bi-geo-alt"></i>${escapeHtml(post.endereco)}</span>
        <span><i class="bi bi-clock"></i>${escapeHtml(post.horario || "Horário comercial")}</span>
      </div>
      <a class="post-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${post.nome}${post.endereco} Belo Horizonte MG`)}" target="_blank" rel="noopener">
        <i class="bi bi-map"></i>
        Ver rota
      </a>
    </article>
  `).join("");
}

function renderAlerts() {
  const list = byId("alertsList");
  if (!list) return;

  updateAlertBadges();

  if (!state.alerts.length) {
    list.innerHTML = emptyState("Nenhum aviso cadastrado.");
    return;
  }

  list.innerHTML = state.alerts.map((alertItem) => `
    <article class="list-item alert-item">
      <div>
        <h3><i class="bi ${escapeHtml(alertItem.icone || "bi-info-circle-fill")}"></i> ${escapeHtml(alertItem.titulo)}</h3>
        <p>${escapeHtml(alertItem.descricao_curta)}</p>
      </div>
      <div class="item-actions">
        <span class="badge-soft ${alertItem.lido ? "badge-read" : "badge-unread"}">${alertItem.lido ? "Lido" : "Novo"}</span>
        <button class="icon-button" title="Abrir aviso" aria-label="Abrir aviso" data-open-alert="${escapeHtml(alertItem.id)}">
          <i class="bi bi-eye"></i>
        </button>
        <button class="icon-button soft-button" title="${alertItem.lido ? "Marcar como não lida" : "Marcar como lida"}" aria-label="${alertItem.lido ? "Marcar como não lida" : "Marcar como lida"}" data-toggle-alert-read="${escapeHtml(alertItem.id)}">
          <i class="bi ${alertItem.lido ? "bi-envelope" : "bi-envelope-open"}"></i>
        </button>
        <button class="icon-button danger-button" title="Apagar aviso" aria-label="Apagar aviso" data-delete-alert-public="${escapeHtml(alertItem.id)}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-open-alert]").forEach((button) => {
    button.addEventListener("click", () => openAlert(button.dataset.openAlert));
  });

  list.querySelectorAll("[data-delete-alert-public]").forEach((button) => {
    button.addEventListener("click", () => deleteAlertFromList(button.dataset.deleteAlertPublic));
  });

  list.querySelectorAll("[data-toggle-alert-read]").forEach((button) => {
    button.addEventListener("click", () => toggleAlertRead(button.dataset.toggleAlertRead));
  });
}

async function deleteAlertFromList(id) {
  if (!confirm("Apagar esta notificação?")) return;
  await fetchJson(`/alertas/${id}`, { method: "DELETE" });
  await loadData();
  showRoute("alerts", false);
}

async function toggleAlertRead(id) {
  const alertItem = state.alerts.find((item) => String(item.id) === String(id));
  if (!alertItem) return;
  await fetchJson(`/alertas/${id}`, { method: "PATCH", body: { lido: !alertItem.lido } });
  await loadData();
  showRoute("alerts", false);
}

async function openAlert(id) {
  const alertItem = state.alerts.find((item) => String(item.id) === String(id));
  if (!alertItem) return;

  byId("alertDetailContent").innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title h5"><i class="bi ${escapeHtml(alertItem.icone || "bi-info-circle-fill")}"></i> ${escapeHtml(alertItem.modal_titulo || alertItem.titulo)}</h2>
      <button class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
    </div>
    <div class="modal-body">
      <p>${stripUnsafeHtml(alertItem.modal_corpo || alertItem.descricao_curta)}</p>
      <div class="alert alert-light border mb-0">${escapeHtml(alertItem.modal_rodape || "Acompanhe as orientações da unidade de saúde.")}</div>
    </div>
  `;
  showModal("alertDetailModal");

  if (!alertItem.lido) {
    await fetchJson(`/alertas/${id}`, { method: "PATCH", body: { lido: true } });
    await loadData();
    renderAlerts();
  }
}

function visibleVaccines() {
  return state.vaccines.filter((vaccine) => vaccine.visivel !== false);
}

function updateAlertBadges() {
  const total = state.alerts.length;
  document.querySelectorAll("[data-alert-badge]").forEach((badge) => {
    badge.textContent = total;
    badge.classList.toggle("d-none", total === 0);
  });
}

async function fetchJson(path, options = {}) {
  const init = {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" }
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(path, init);
  if (!response.ok) {
    throw new Error(`Erro ${response.status} em ${path}`);
  }

  if (init.method === "DELETE") return null;
  return response.json();
}

function formatDate(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function nextDoseFor(name = "", baseDate = todayIso()) {
  const date = new Date(`${baseDate}T12:00:00`);
  const normalized = name.toLowerCase();

  if (normalized.includes("gripe") || normalized.includes("influenza")) {
    date.setFullYear(date.getFullYear() + 1);
  } else if (normalized.includes("febre amarela")) {
    date.setFullYear(date.getFullYear() + 10);
  } else if (normalized.includes("dengue")) {
    date.setMonth(date.getMonth() + 3);
  } else if (normalized.includes("hepatite")) {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date.toISOString().slice(0, 10);
}

function dateStatus(value) {
  if (value < todayIso()) return { label: "Atrasada", className: "badge-warning" };

  const target = new Date(`${value}T12:00:00`);
  const today = new Date(`${todayIso()}T12:00:00`);
  const days = Math.ceil((target - today) / 86400000);

  if (days <= 30) return { label: "Próxima", className: "badge-planned" };
  return { label: "Agendada", className: "badge-info" };
}

function statusClass(status = "") {
  const normalized = status.toLowerCase();
  if (normalized.includes("ativa")) return "badge-active";
  if (normalized.includes("planejada")) return "badge-planned";
  return "badge-ended";
}

function alertTypeClass(type = "") {
  return type === "warning" ? "badge-warning" : "badge-info";
}

function setMessage(id, text, type = "info") {
  const element = byId(id);
  if (!element) return;

  element.textContent = text;
  element.className = text ? `message-area text-${type}` : "message-area";
}

function emptyState(text, detail = "As informações aparecerão aqui quando estiverem disponíveis.") {
  return `<article class="list-item"><div><h3>${escapeHtml(text)}</h3><p>${escapeHtml(detail)}</p></div></article>`;
}

function showModal(id) {
  const element = byId(id);
  if (!element) return;

  if (window.bootstrap?.Modal) {
    window.bootstrap.Modal.getOrCreateInstance(element).show();
    return;
  }

  element.classList.add("show");
  element.style.display = "block";
}

function hideModal(id) {
  const element = byId(id);
  if (!element) return;

  if (window.bootstrap?.Modal) {
    window.bootstrap.Modal.getOrCreateInstance(element).hide();
    return;
  }

  element.classList.remove("show");
  element.style.display = "none";
}

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripUnsafeHtml(value = "") {
  return String(value).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}