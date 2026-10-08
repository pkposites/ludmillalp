/* ==========================================================================
   CONFIGURAÇÃO: edite aqui os dados da Ludmilla e das unidades
   ========================================================================== */
const CONFIG = {
  // WhatsApp com DDI + DDD, só números. Ex.: 5511999998888
  whatsapp: "5511000000000",
  instagram: "https://www.instagram.com/ludmillaimoveis/",
  // Ex.: "Corretora de Imóveis · CRECI 000000-F"
  creci: "Corretora de Imóveis · CRECI 000000-F",
  empreendimento: "Kaslik Ibirapuera",

  // Opcional: URL que recebe os leads do quiz via POST (JSON).
  // Funciona com Formspree, Make, Zapier, n8n, Google Apps Script etc.
  // Deixe vazio para enviar apenas pelo WhatsApp.
  leadEndpoint: "",

  // Ofertas de outubro. faixa: "his" (até 6 SM), "hmp" (até 10 SM) ou "livre".
  unidades: [
    { id: "studio-his", nome: "Studio HIS", tipologia: "Studio", faixa: "his", area: "24,98 m²", unidade: "1004", vaga: "Sem vaga", de: 371600, por: 329000 },
    { id: "studio-hmp", nome: "Studio HMP", tipologia: "Studio", faixa: "hmp", area: "24,87 m²", unidade: "1915", vaga: "Sem vaga", de: 477780, por: 409000 },
    { id: "1d-hmp", nome: "1 dormitório HMP", tipologia: "1 dormitório", faixa: "hmp", area: "27,99 m²", unidade: "524", vaga: "Sem vaga", de: 535640, por: 509000 },
    { id: "2d", nome: "2 dormitórios", tipologia: "2 dormitórios", faixa: "livre", area: "51,31 m²", unidade: "1404", vaga: "1 vaga", de: 1067410, por: 995000 },
    { id: "3d", nome: "3 dormitórios", tipologia: "3 dormitórios", faixa: "livre", area: "68,69 m²", unidade: "602", vaga: "1 vaga", de: 1507200, por: 1260000 },
  ],
};

/* ========================================================================== */

document.documentElement.classList.remove("no-js");

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const whatsappUrl = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const FAIXA_LABEL = { his: "HIS", hmp: "HMP", livre: "Mercado" };

/* ---------- Dados dinâmicos ---------- */
$$('[data-cfg="creci"]').forEach((el) => (el.textContent = CONFIG.creci));
$$('[data-cfg="instagram"]').forEach((el) => (el.href = CONFIG.instagram));
$("#year").textContent = new Date().getFullYear();

function bindWhatsappLinks(root = document) {
  $$("[data-whatsapp]", root).forEach((el) => {
    el.href = whatsappUrl(el.dataset.whatsapp);
    el.target = "_blank";
    el.rel = "noopener";
  });
}

/* ---------- Cards de ofertas ---------- */
const maxDesconto = Math.max(...CONFIG.unidades.map((u) => u.de - u.por));
$("#offersGrid").innerHTML = CONFIG.unidades
  .map((u) => {
    const desconto = u.de - u.por;
    const destaque = desconto === maxDesconto;
    return `
      <article class="offer reveal${destaque ? " offer--featured" : ""}">
        ${destaque ? '<span class="offer__ribbon">Maior desconto</span>' : ""}
        <span class="offer__tag">${u.faixa === "livre" ? "Com vaga" : FAIXA_LABEL[u.faixa]}</span>
        <h3>${u.nome}</h3>
        <div class="offer__meta"><span>${u.area}</span><span>Unidade ${u.unidade}</span><span>${u.vaga}</span></div>
        <div class="offer__prices">
          <div class="offer__from">De <s>${brl(u.de)}</s></div>
          <div class="offer__to"><small>por</small><strong>${brl(u.por)}</strong></div>
          <span class="offer__save">Economia de ${brl(desconto)}</span>
        </div>
        <a href="#" class="btn btn--dark" data-whatsapp="Olá, Ludmilla! Tenho interesse no ${u.nome} (unidade ${u.unidade}) do ${CONFIG.empreendimento} por ${brl(u.por)}. Pode me enviar o fluxo de pagamento?">Quero esta unidade</a>
      </article>`;
  })
  .join("");
bindWhatsappLinks();

/* ---------- Fallback para fotos ainda não enviadas ---------- */
const FALLBACK_LABELS = { retrato: "Foto da Ludmilla", fachada: "Fachada do Kaslik Ibirapuera" };
const fallbackIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
function applyFallback(img) {
  const box = document.createElement("div");
  box.className = "img-fallback";
  box.setAttribute("role", "img");
  box.setAttribute("aria-label", img.alt || "Imagem");
  box.innerHTML = `${fallbackIcon}<span>${FALLBACK_LABELS[img.dataset.fallback] || ""}</span>`;
  img.replaceWith(box);
}
$$("img[data-fallback]").forEach((img) => {
  if (img.complete && img.naturalWidth === 0) applyFallback(img);
  else img.addEventListener("error", () => applyFallback(img), { once: true });
});

/* ---------- Header e menu mobile ---------- */
const header = $(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const nav = $("#nav");
const navToggle = $("#navToggle");
const setNav = (open) => {
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.style.overflow = open ? "hidden" : "";
};
navToggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setNav(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setNav(false));

/* ---------- Animações ao rolar ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));
} else {
  $$(".reveal").forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Quiz ---------- */
const form = $("#quizForm");
const steps = $$(".quiz__step", form);
const CONTACT = steps.length - 1;
const btnNext = $("#quizNext");
const btnBack = $("#quizBack");
const bar = $("#quizBar");
const counter = $("#quizCounter");
const errorEl = $("#formError");
const nomeInput = $("#nome");
const whatsInput = $("#whatsapp");
const consentInput = $("#consent");
let current = 0;

const checked = (name) => $(`input[name="${name}"]:checked`, form);
const phoneDigits = () => whatsInput.value.replace(/\D/g, "").slice(0, 11);
const contactValid = () => nomeInput.value.trim().length >= 2 && phoneDigits().length >= 10 && consentInput.checked;
const stepIsValid = (i) => (i === CONTACT ? contactValid() : !!$("input[type=radio]:checked", steps[i]));

function render() {
  steps.forEach((s, i) => s.classList.toggle("is-active", i === current));
  bar.style.width = `${((current + 1) / steps.length) * 100}%`;
  counter.textContent = current === CONTACT ? "Último passo" : `Pergunta ${current + 1} de ${CONTACT}`;
  btnBack.hidden = current === 0;
  btnNext.textContent = current === CONTACT ? "Ver minha recomendação" : "Continuar";
  btnNext.disabled = !stepIsValid(current);
  errorEl.textContent = "";
}

function goTo(i) {
  current = Math.max(0, Math.min(CONTACT, i));
  render();
  if (current === CONTACT) nomeInput.focus({ preventScroll: true });
}

// Avança sozinho ao escolher uma opção
let autoAdvance;
form.addEventListener("change", (e) => {
  if (e.target.type !== "radio") return;
  btnNext.disabled = false;
  clearTimeout(autoAdvance);
  const from = current;
  autoAdvance = setTimeout(() => current === from && goTo(current + 1), 320);
});

form.addEventListener("input", () => {
  if (current !== CONTACT) return;
  btnNext.disabled = !contactValid();
  errorEl.textContent = "";
  [nomeInput, whatsInput].forEach((el) => el.classList.remove("is-invalid"));
});

btnBack.addEventListener("click", () => goTo(current - 1));
btnNext.addEventListener("click", () => (current < CONTACT ? goTo(current + 1) : submitQuiz()));
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (current === CONTACT) submitQuiz();
});

// Máscara (11) 90000-0000
whatsInput.addEventListener("input", () => {
  const d = phoneDigits();
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 6) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  whatsInput.value = out;
});

/* Escolhe a unidade mais adequada às respostas */
function recommend({ objetivo, tipologia, budget, faixa }) {
  const all = CONFIG.unidades;
  // Unidades HIS/HMP exigem enquadramento de renda
  const elegivel = (u) =>
    faixa === "nd" ||
    u.faixa === "livre" ||
    (u.faixa === "his" && faixa === "his") ||
    (u.faixa === "hmp" && (faixa === "his" || faixa === "hmp"));

  let pool = all.filter(elegivel);
  if (!pool.length) pool = all;

  const naFaixa = pool.filter((u) => u.por <= budget);
  const semPreferencia = tipologia === "Ainda não sei";
  const preferidas = (list) => (semPreferencia ? list : list.filter((u) => u.tipologia === tipologia));

  // 1) tipologia escolhida dentro do orçamento
  let escolha = semPreferencia ? undefined : preferidas(naFaixa).sort((a, b) => b.por - a.por)[0];
  let ajuste = false;

  // 2) sem preferência: investidor -> compacto de maior liquidez; morador -> a maior que cabe no bolso
  if (!escolha && naFaixa.length) {
    escolha =
      objetivo === "Investir"
        ? naFaixa.slice().sort((a, b) => a.por - b.por)[0]
        : naFaixa.slice().sort((a, b) => b.por - a.por)[0];
    ajuste = !semPreferencia;
  }

  // 3) nada no orçamento: a tipologia desejada (ou a mais acessível)
  if (!escolha) {
    escolha = preferidas(pool).sort((a, b) => a.por - b.por)[0] || pool.slice().sort((a, b) => a.por - b.por)[0];
    ajuste = true;
  }
  return { unidade: escolha, ajuste };
}

function explanation(u, objetivo) {
  const investir = objetivo === "Investir";
  const textos = {
    Studio: investir
      ? "Studios perto do metrô e do Ibirapuera têm altíssima procura para locação, com ótima liquidez."
      : "Um studio prático e bem localizado, perfeito para quem quer viver a Vila Mariana com praticidade.",
    "1 dormitório": investir
      ? "Unidades de 1 dormitório são das mais procuradas para aluguel na região, com ótimo potencial de renda."
      : "O 1 dormitório une conforto e praticidade, com ambientes bem resolvidos para o seu dia a dia.",
    "2 dormitórios": investir
      ? "Unidades de 2 dormitórios com vaga atraem famílias e casais, com inquilinos de longo prazo."
      : "Espaço para a família, vaga de garagem e todo o lazer do condomínio a poucos passos do Ibirapuera.",
    "3 dormitórios": investir
      ? "Unidades de 3 dormitórios são mais raras na região, o que garante grande potencial de valorização."
      : "Espaço de sobra para a família crescer, com vaga e lazer completo em um dos melhores bairros de SP.",
  };
  return textos[u.tipologia];
}

async function submitQuiz() {
  const nome = nomeInput.value.trim();
  if (!contactValid()) {
    if (nome.length < 2) nomeInput.classList.add("is-invalid");
    if (phoneDigits().length < 10) whatsInput.classList.add("is-invalid");
    errorEl.textContent =
      nome.length >= 2 && phoneDigits().length >= 10
        ? "Marque a autorização de contato para continuar."
        : "Confira seu nome e WhatsApp, por favor.";
    return;
  }

  const a = {
    objetivo: checked("objetivo").value,
    tipologia: checked("tipologia").value,
    investimento: checked("investimento").value,
    renda: checked("renda").value,
    pagamento: checked("pagamento").value,
    prazo: checked("prazo").value,
  };
  const { unidade: u, ajuste } = recommend({
    objetivo: a.objetivo,
    tipologia: a.tipologia,
    budget: Number(checked("investimento").dataset.max),
    faixa: checked("renda").dataset.faixa,
  });

  const lead = {
    nome,
    whatsapp: phoneDigits(),
    ...a,
    recomendacao: `${u.nome} · unidade ${u.unidade} · ${brl(u.por)}`,
    empreendimento: CONFIG.empreendimento,
    origem: window.location.href,
    data: new Date().toISOString(),
  };

  if (CONFIG.leadEndpoint) {
    btnNext.disabled = true;
    btnNext.textContent = "Enviando...";
    try {
      await fetch(CONFIG.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.warn("Não foi possível enviar o lead:", err);
    }
  }

  // Eventos de conversão, se Meta Pixel / GA4 estiverem instalados
  if (typeof window.fbq === "function") window.fbq("track", "Lead");
  if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { objetivo: a.objetivo, unidade: u.nome });

  const primeiroNome = nome.split(/\s+/)[0];
  $("#resultTitle").textContent = `${primeiroNome}, separei uma ótima opção para você!`;
  $("#resultText").textContent = explanation(u, a.objetivo);
  $("#resultUnit").innerHTML = `
    <div class="result-unit__head"><strong>${u.nome}</strong><span>${u.area} · Unidade ${u.unidade} · ${u.vaga}</span></div>
    <div class="result-unit__price"><s>${brl(u.de)}</s><b>${brl(u.por)}</b><em>economia de ${brl(u.de - u.por)}</em></div>`;

  const notas = [];
  if (ajuste) notas.push("Ajustei a sugestão ao seu perfil e orçamento. Te mostro outras opções no WhatsApp.");
  if (u.faixa !== "livre") notas.push(`Unidade ${FAIXA_LABEL[u.faixa]}: sujeita ao enquadramento de renda, que verifico com você.`);
  if (/FGTS/.test(a.pagamento)) notas.push("Também vou verificar quanto do seu FGTS pode entrar na compra.");
  $("#resultNote").textContent = notas.join(" ");

  const msg = [
    `Olá, Ludmilla! Sou ${nome} e respondi o quiz do ${CONFIG.empreendimento}.`,
    "",
    `• Objetivo: ${a.objetivo}`,
    `• Tipo de unidade: ${a.tipologia}`,
    `• Investimento: ${a.investimento}`,
    `• Renda familiar: ${a.renda}`,
    `• Pagamento: ${a.pagamento}`,
    `• Prazo: ${a.prazo}`,
    "",
    `A sugestão foi o ${u.nome} (unidade ${u.unidade}) por ${brl(u.por)}. Pode me enviar o fluxo de pagamento?`,
  ].join("\n");
  $("#resultWhatsapp").href = whatsappUrl(msg);

  form.hidden = true;
  $(".quiz__progress").style.visibility = "hidden";
  counter.hidden = true;
  $("#quizResult").hidden = false;
  $("#quizCard").scrollIntoView({ behavior: "smooth", block: "center" });
}

$("#quizRestart").addEventListener("click", () => {
  form.reset();
  form.hidden = false;
  $(".quiz__progress").style.visibility = "";
  counter.hidden = false;
  $("#quizResult").hidden = true;
  goTo(0);
});

render();
