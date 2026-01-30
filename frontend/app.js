const form = document.getElementById("dreamForm");
const textarea = document.getElementById("descricao");

const reportCard = document.getElementById("reportCard");
const reportTitle = document.getElementById("reportTitle");
const reportContent = document.getElementById("reportContent");

const lensButtons = document.querySelectorAll(".lens-selector button");

let dataCache = null;

/* ===============================
   SUBMIT DO SONHO
================================ */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const descricao = textarea.value.trim();
  if (!descricao) return;

  clearAuras();
  clearActiveButtons();

  // feedback imediato
  reportTitle.textContent = "Interpretando sonho…";
  reportContent.textContent =
    "Deixando as imagens se organizarem.\n\nIsso pode levar alguns segundos.";
  reportCard.classList.add("visible", "lens-intro");
  setActiveButton("initial");

  try {
    const response = await fetch("http://localhost:3000/interpretar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descricao })
    });

    const data = await response.json();
    dataCache = data;

    renderInitial();
  } catch (err) {
    reportTitle.textContent = "Algo não saiu como esperado";
    reportContent.textContent =
      "Tente novamente quando se sentir pronto.";
  }
});

/* ===============================
   BOTÕES DE LENTE
================================ */
lensButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!dataCache) return;

    const lens = btn.dataset.lens;

    if (lens === "initial") {
      renderInitial();
    } else {
      renderLens(lens);
    }
  });
});

/* ===============================
   RENDERIZAÇÃO
================================ */
function renderInitial() {
  reportTitle.textContent = "Leitura Inicial";
  reportContent.textContent = dataCache.leitura_inicial || "";

  setAura("initial");
  setActiveButton("initial");
}

function renderLens(lens) {
  const titles = {
    simbolica: "Visão Simbólica",
    psicologica: "Visão Psicológica",
    cientifica: "Visão Científica"
  };

  reportTitle.textContent = titles[lens] || "Leitura";
  reportContent.textContent =
    dataCache.leituras?.[lens] || "Leitura indisponível.";

  setAura(lens);
  setActiveButton(lens);
}

/* ===============================
   AURAS DO CARD
================================ */
function clearAuras() {
  reportCard.classList.remove(
    "lens-intro",
    "lens-symbolic",
    "lens-psych",
    "lens-science"
  );
}

function setAura(lens) {
  clearAuras();

  if (lens === "initial") reportCard.classList.add("lens-intro");
  if (lens === "simbolica") reportCard.classList.add("lens-symbolic");
  if (lens === "psicologica") reportCard.classList.add("lens-psych");
  if (lens === "cientifica") reportCard.classList.add("lens-science");
}

/* ===============================
   AURA DOS BOTÕES
================================ */
function clearActiveButtons() {
  lensButtons.forEach((btn) => btn.classList.remove("active"));
}

function setActiveButton(lens) {
  clearActiveButtons();
  const btn = document.querySelector(
    `.lens-selector button[data-lens="${lens}"]`
  );
  if (btn) btn.classList.add("active");
}
