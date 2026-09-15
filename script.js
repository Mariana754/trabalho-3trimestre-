// Chave usada para salvar os dados na gaveta (localStorage)
const CHAVE_STORAGE = "mural_acoes_dados";

// Elementos da página do HTML capturados pelo ID
const form = document.getElementById("form-acao");
const listaContainer = document.getElementById("lista");
const contadorSpan = document.querySelector("#contador span");

// 1. Ler os dados do localStorage
function lerRegistros() {
    const dadosEmTexto = localStorage.getItem(CHAVE_STORAGE);
    if (!dadosEmTexto) return []; // Retorna lista vazia se não houver nada salvo
    return JSON.parse(dadosEmTexto); // Converte de volta para Array/Lista
}

// 2. Gravar os dados no localStorage
function gravarRegistros(lista) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
}

// 3. Atualizar a tela mostrando a lista de cartões
function renderizarMural() {
    const registros = lerRegistros();
    listaContainer.innerHTML = ""; // Limpa a área do mural antes de desenhar

    // Atualiza o contador de ações
    contadorSpan.textContent = registros.length;

    if (registros.length === 0) {
        listaContainer.innerHTML = "<p>Nenhuma ação cadastrada ainda. Seja o primeiro!</p>";
        return;
    }

    // Desenha cada cartão salvo na página
    registros.forEach((registro, index) => {
        const cartao = document.createElement("div");
        cartao.className = "cartao";
        
        cartao.innerHTML = `
            <h3>${registro.titulo}</h3>
            <span class="tag">${registro.categoria}</span>
            <p><strong>Organizador:</strong> ${registro.responsavel}</p>
            <p>${registro.descricao}</p>
            <button class="cartao-btn-apagar" onclick="apagarRegistro(${index})">Apagar</button>
        `;

        listaContainer.appendChild(cartao);
    });
}

// 4. Capturar o envio do formulário e salvar
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Impede que a página recarregue ao enviar

    const novoRegistro = {
        titulo: document.getElementById("titulo").value,
        categoria: document.getElementById("categoria").value,
        responsavel: document.getElementById("responsavel").value,
        descricao: document.getElementById("descricao").value
    };

    const listaAtual = lerRegistros();
    listaAtual.unshift(novoRegistro); // Adiciona o registro no começo da lista
    gravarRegistros(listaAtual);

    form.reset(); // Limpa os campos do formulário
    renderizarMural(); // Redesenha a lista atualizada na tela
});

// 5. Função para apagar um registro da lista
function apagarRegistro(index) {
    const listaAtual = lerRegistros();
    listaAtual.splice(index, 1); // Remove 1 item da posição informada
    gravarRegistros(listaAtual);
    renderizarMural();
}

// Inicializa a exibição dos dados assim que a página é carregada
renderizarMural();