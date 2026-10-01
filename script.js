/* =========================================================
   script.js
   Comportamento do sistema NutriVida: salvar, ler, mostrar,
   buscar, filtrar e somar calorias.
   ========================================================= */

const CHAVE = "nutrivida-dados-projeto";

const formulario = document.getElementById("formulario");
const listaEl    = document.getElementById("lista");
const painel     = document.getElementById("painel");
const busca      = document.getElementById("busca");
const filtro     = document.getElementById("filtro");
const aviso      = document.getElementById("aviso");

/* ---------- 1. LER da gaveta ---------- */
function lerFichas(){
  const texto = localStorage.getItem(CHAVE);
  if(!texto) return [];
  try { return JSON.parse(texto); } catch(erro){ return []; }
}

/* ---------- 2. GRAVAR na gaveta ---------- */
function gravarFichas(fichas){
  localStorage.setItem(CHAVE, JSON.stringify(fichas));
}

/* ---------- 3. Proteção de texto ---------- */
function escapar(texto){
  const caixa = document.createElement("div");
  caixa.textContent = texto;
  return caixa.innerHTML;
}

/* ---------- 4. MOSTRAR na tela ---------- */
function mostrar(){
  const fichas = lerFichas();
  const termo = busca.value.trim().toLowerCase();
  const escolhida = filtro.value;

  const visiveis = fichas.filter(function(f){
    const passaFiltro = (escolhida === "todas") || (f.categoria === escolhida);
    const textoTodo = Object.values(f).join(" ").toLowerCase();
    const passaBusca = (termo === "") || (textoTodo.indexOf(termo) >= 0);
    return passaFiltro && passaBusca;
  });

  listaEl.innerHTML = "";

  if(visiveis.length === 0){
    listaEl.innerHTML = '<p class="vazio">Nenhum registro encontrado. Preencha o formulário acima para começar.</p>';
    desenharPainel(fichas);
    return;
  }

  visiveis.forEach(function(f){
    const cartao = document.createElement("article");
    cartao.className = "cartao";
    cartao.setAttribute("data-categoria", f.categoria);
    let html = "";
    html += "<h3>" + escapar(f.tituloDaAcao) + "</h3>";
    html += '<span class="etiqueta">' + escapar(f.categoria) + "</span>";
    html += "<p><b>Foco / Refeição:</b> " + escapar(f.local) + "</p>";
    html += "<p><b>Calorias:</b> " + escapar(f.quantasPessoasParticipar) + " kcal</p>";
    html += "<p><b>Descrição:</b> " + escapar(f.oQueFoiFeito) + "</p>";
    html += '<footer><small>' + escapar(f.data) + '</small>' +
            '<button type="button" class="apagar" data-id="' + f.id + '">Apagar</button></footer>';
    cartao.innerHTML = html;
    listaEl.appendChild(cartao);
  });

  desenharPainel(fichas);
}

/* ---------- 5. O PAINEL de números ---------- */
function desenharPainel(fichas){
  let html = "";
  html += '<div class="numero"><b>' + fichas.length + "</b><span>registros totais</span></div>";
  const soma = fichas.reduce(function(total, f){ return total + Number(f.quantasPessoasParticipar || 0); }, 0);
  html += '<div class="numero"><b>' + soma + "</b><span>total de calorias (kcal)</span></div>";
  const porCategoria = {};
  fichas.forEach(function(f){ porCategoria[f.categoria] = (porCategoria[f.categoria] || 0) + 1; });
  Object.keys(porCategoria).forEach(function(nome){
    html += '<div class="numero pequeno"><b>' + porCategoria[nome] + "</b><span>" + escapar(nome) + "</span></div>";
  });
  painel.innerHTML = html;
}

/* ---------- 6. SALVAR ao enviar formulário ---------- */
formulario.addEventListener("submit", function(evento){
  evento.preventDefault();

  const nova = {
    id: Date.now(),
    tituloDaAcao: document.getElementById("tituloDaAcao").value.trim(),
    categoria: document.getElementById("categoria").value.trim(),
    local: document.getElementById("local").value.trim(),
    quantasPessoasParticipar: Number(document.getElementById("quantasPessoasParticipar").value),
    oQueFoiFeito: document.getElementById("oQueFoiFeito").value.trim(),
    data: new Date().toLocaleDateString("pt-BR")
  };

  const fichas = lerFichas();
  fichas.unshift(nova);
  gravarFichas(fichas);

  formulario.reset();
  mostrar();
  aviso.textContent = "Registro salvo com sucesso!";
  setTimeout(function(){ aviso.textContent = ""; }, 4000);
});

/* ---------- 7. APAGAR um registro ---------- */
listaEl.addEventListener("click", function(evento){
  if(!evento.target.classList.contains("apagar")) return;
  const id = Number(evento.target.getAttribute("data-id"));
  const fichas = lerFichas().filter(function(f){ return f.id !== id; });
  gravarFichas(fichas);
  mostrar();
});

/* ---------- 8. BUSCAR, FILTRAR e LIMPAR TUDO ---------- */
busca.addEventListener("input", mostrar);
filtro.addEventListener("change", mostrar);

document.getElementById("limpar").addEventListener("click", function(){
  if(confirm("Deseja apagar todos os registros salvos neste navegador?")){
    localStorage.removeItem(CHAVE);
    mostrar();
  }
});

/* ---------- 9. EXPORTAR e IMPORTAR dados ---------- */
document.getElementById("exportar").addEventListener("click", function(){
  const texto = JSON.stringify(lerFichas(), null, 2);
  const arquivo = new Blob([texto], {type: "application/json"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "nutrivida-dados.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById("importar").addEventListener("change", function(evento){
  const arquivo = evento.target.files[0];
  if(!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = function(){
    try {
      const recebidas = JSON.parse(leitor.result);
      if(!Array.isArray(recebidas)) throw new Error("formato inválido");
      gravarFichas(recebidas.concat(lerFichas()));
      mostrar();
      aviso.textContent = recebidas.length + " registros carregados com sucesso.";
    } catch(erro){
      aviso.textContent = "Arquivo de backup inválido.";
    }
  };
  leitor.readAsText(arquivo);
});

/* ---------- 10. Inicialização ---------- */
mostrar();