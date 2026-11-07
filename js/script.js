// ===== Configuração =====
// Número da Mil Graus Ar-Condicionado com código do país (55) e DDD.
var numeroWhatsapp = "5511978284358";
var mensagemWhatsapp = "Olá! Vim pelo site e gostaria de pedir um orçamento.";

// ===== Botões de WhatsApp =====
// Todo link com a classe "link-whatsapp" abre a conversa já com a mensagem pronta
var linksWhatsapp = document.querySelectorAll(".link-whatsapp");
var enderecoWhatsapp = "https://wa.me/" + numeroWhatsapp + "?text=" + encodeURIComponent(mensagemWhatsapp);

linksWhatsapp.forEach(function (link) {
    link.href = enderecoWhatsapp;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
});

// ===== Menu do celular =====
var menuBotao = document.getElementById("menuBotao");
var menu = document.getElementById("menu");

menuBotao.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    menuBotao.setAttribute("aria-expanded", aberto);
});

// Fecha o menu ao clicar em um item
menu.querySelectorAll("a").forEach(function (item) {
    item.addEventListener("click", function () {
        menu.classList.remove("aberto");
        menuBotao.setAttribute("aria-expanded", false);
    });
});

// ===== Hero: escolha do serviço =====
(function () {
    var seletor = document.getElementById("heroSeletor");
    if (!seletor) return;

    var opcoes = Array.from(seletor.querySelectorAll("[data-hero-servico]"));
    var foto = document.getElementById("heroFoto");
    var animacao;
    var servicos = {
        instalacao: {
            indice: "01 / Instalação", titulo: "Instalar com tranquilidade.",
            texto: "Do posicionamento ao acabamento, uma instalação pensada para o seu espaço.",
            imagem: "img/trabalhos/split-sala-estar.webp", largura: 1000, altura: 563,
            alt: "Split instalado pela Mil Graus em sala de estar com portas de vidro", destino: "#servico-instalacao"
        },
        manutencao: {
            indice: "02 / Manutenção", titulo: "Cuidar para continuar bem.",
            texto: "Limpeza, revisão e reparos para manter o aparelho pronto para o dia a dia.",
            imagem: "img/trabalhos/manutencao-unidade-interna.webp", largura: 1280, altura: 960,
            alt: "Unidade interna aberta durante um serviço de manutenção da Mil Graus", destino: "#servico-manutencao"
        },
        aparelho: {
            indice: "03 / Novo aparelho", titulo: "Escolher com orientação.",
            texto: "Encontre o modelo e a capacidade que combinam com seu ambiente e sua rotina.",
            imagem: "img/trabalhos/split-midea-cinza.webp", largura: 1040, altura: 780,
            alt: "Ar-condicionado Midea cinza instalado em um dos trabalhos da Mil Graus", destino: "#servico-venda"
        }
    };

    opcoes.forEach(function (botao) {
        botao.addEventListener("click", function () {
            if (botao.getAttribute("aria-pressed") === "true") return;
            var servico = servicos[botao.dataset.heroServico];
            opcoes.forEach(function (opcao) { opcao.setAttribute("aria-pressed", opcao === botao ? "true" : "false"); });
            foto.src = servico.imagem;
            foto.alt = servico.alt;
            foto.width = servico.largura;
            foto.height = servico.altura;
            document.getElementById("heroIndice").textContent = servico.indice;
            document.getElementById("heroServicoTitulo").textContent = servico.titulo;
            document.getElementById("heroServicoTexto").textContent = servico.texto;
            document.getElementById("heroServicoLink").href = servico.destino;
            if (animacao) animacao.cancel();
            if (typeof foto.animate === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                animacao = foto.animate([{ opacity: .5 }, { opacity: 1 }], { duration: 250, easing: "ease-out" });
            }
        });
    });
    seletor.hidden = false;
})();

// ===== Calculadora de BTUs =====
// Regra simples:
//   600 BTU por m², mais 600 por pessoa a partir da segunda, mais 20% se bater sol.
// Depois escolhemos o tamanho comercial mais próximo.
// Se a carga passar de 36.000 BTU/h, indicamos 2 aparelhos (ou mais) de tamanho menor.
var tamanhos = [7000, 9000, 12000, 18000, 24000, 30000, 36000];

var campoArea = document.getElementById("area");
var campoPessoas = document.getElementById("pessoas");
var campoSol = document.getElementById("sol");

function formatar(numero) {
    return numero.toLocaleString("pt-BR");
}

// Retorna o menor tamanho comercial que atende a carga informada
function tamanhoPara(carga) {
    for (var i = 0; i < tamanhos.length; i++) {
        if (tamanhos[i] >= carga) {
            return tamanhos[i];
        }
    }
    return tamanhos[tamanhos.length - 1];
}

// Devolve o texto da indicação, por exemplo "12.000" ou "2 × 24.000"
function indicacao(carga) {
    var quantidade = Math.ceil(carga / 36000);
    var tamanho = tamanhoPara(carga / quantidade);
    if (quantidade > 1) {
        return { texto: quantidade + " × " + formatar(tamanho), quantidade: quantidade, tamanho: tamanho };
    }
    return { texto: formatar(tamanho), quantidade: 1, tamanho: tamanho };
}

// Pinta a parte já preenchida da barra do controle deslizante
function pintarBarra(campo) {
    var porcentagem = (campo.value - campo.min) * 100 / (campo.max - campo.min);
    campo.style.setProperty("--preenchimento", porcentagem + "%");
}

function calcular() {
    var area = Number(campoArea.value);
    var pessoas = Number(campoPessoas.value);
    var sol = campoSol.checked;

    var cargaMetragem = area * 600;
    var carga = cargaMetragem + (pessoas - 1) * 600;
    if (sol) {
        carga = carga * 1.2;
    }
    carga = Math.round(carga);

    var chute = indicacao(cargaMetragem);
    var resultado = indicacao(carga);

    document.getElementById("areaValor").textContent = area + " m²";
    document.getElementById("pessoasValor").textContent = pessoas + (pessoas === 1 ? " pessoa" : " pessoas");
    document.getElementById("valorChute").textContent = chute.texto;
    document.getElementById("valorMilGraus").textContent = resultado.texto;
    document.getElementById("resultadoBtu").textContent = resultado.texto;
    document.getElementById("cargaCalculada").textContent = formatar(carga) + " BTU/h";
    document.getElementById("cargaMetragem").textContent = formatar(cargaMetragem) + " BTU/h";

    if (resultado.quantidade > 1) {
        document.getElementById("resultadoTexto").textContent =
            "Nesse tamanho, " + resultado.quantidade + " aparelhos climatizam melhor do que um só no limite.";
    } else {
        document.getElementById("resultadoTexto").textContent = "Um aparelho atende bem esse ambiente.";
    }

    pintarBarra(campoArea);
    pintarBarra(campoPessoas);

    // O botão já leva o resultado para o WhatsApp
    var texto = "Olá! Calculei no site: ambiente de " + area + " m², " + pessoas + " pessoa(s)" +
        (sol ? ", com sol da tarde" : "") + ". Indicou " + resultado.texto + " BTU/h. Gostaria de um orçamento.";
    document.getElementById("resultadoBotao").href = "https://wa.me/" + numeroWhatsapp + "?text=" + encodeURIComponent(texto);
}

// Recalcula na hora, sem botão
campoArea.addEventListener("input", calcular);
campoPessoas.addEventListener("input", calcular);
campoSol.addEventListener("change", calcular);
calcular();

// ===== Formulário de contato =====
// Não envia nada para servidor: só abre o WhatsApp com os dados digitados
document.getElementById("formContato").addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nome = document.getElementById("contatoNome").value.trim();
    var telefone = document.getElementById("contatoZap").value.trim();

    var texto = "Olá! Meu nome é " + nome + " e meu WhatsApp é " + telefone + ". Gostaria de falar com a equipe da Mil Graus Ar-Condicionado.";
    window.open("https://wa.me/" + numeroWhatsapp + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
});

// ===== Carrossel de trabalhos =====
(function () {
    var pista = document.getElementById("galeriaTrabalhos");
    if (!pista) return;

    var cartoes = Array.from(pista.querySelectorAll(".galeria-cartao"));
    var anterior = document.getElementById("trabalhosAnteriores");
    var proximo = document.getElementById("proximosTrabalhos");
    var posicao = document.getElementById("galeriaPosicao");
    var pausaRolagem;

    function medidas() {
        var colunas = Number(getComputedStyle(pista).getPropertyValue("--galeria-colunas")) || 1;
        var passo = cartoes.length > 1 ? cartoes[1].offsetLeft - cartoes[0].offsetLeft : pista.clientWidth;
        var inicio = Math.round(pista.scrollLeft / passo);
        return { colunas: colunas, passo: passo, inicio: inicio };
    }

    function atualizar() {
        var dados = medidas();
        var fim = Math.min(dados.inicio + dados.colunas, cartoes.length);
        anterior.disabled = pista.scrollLeft <= 2;
        proximo.disabled = pista.scrollLeft >= pista.scrollWidth - pista.clientWidth - 2;
        posicao.textContent = "Trabalhos " + (dados.inicio + 1) + (fim > dados.inicio + 1 ? "–" + fim : "") + " de " + cartoes.length;
    }

    function agendarAtualizacao() {
        clearTimeout(pausaRolagem);
        pausaRolagem = setTimeout(atualizar, 120);
    }

    function irPara(indice) {
        var dados = medidas();
        var destino = Math.max(0, Math.min(indice, cartoes.length - dados.colunas));
        pista.scrollTo({ left: destino * dados.passo });
        agendarAtualizacao();
    }

    anterior.addEventListener("click", function () {
        var dados = medidas();
        irPara(dados.inicio - dados.colunas);
    });
    proximo.addEventListener("click", function () {
        var dados = medidas();
        irPara(dados.inicio + dados.colunas);
    });
    pista.addEventListener("keydown", function (evento) {
        if (evento.target !== pista) return;
        var dados = medidas();
        if (evento.key === "ArrowLeft" || evento.key === "ArrowRight") {
            evento.preventDefault();
            irPara(dados.inicio + (evento.key === "ArrowRight" ? dados.colunas : -dados.colunas));
        } else if (evento.key === "Home" || evento.key === "End") {
            evento.preventDefault();
            irPara(evento.key === "Home" ? 0 : cartoes.length - dados.colunas);
        }
    });
    pista.addEventListener("scroll", agendarAtualizacao, { passive: true });
    if (typeof ResizeObserver === "function") {
        new ResizeObserver(atualizar).observe(pista);
    } else {
        window.addEventListener("resize", atualizar);
    }

    pista.closest(".galeria-carrossel").classList.add("ativo");
    document.getElementById("galeriaControles").hidden = false;
    atualizar();
})();

// ===== Ampliação das fotos =====
(function () {
    var visualizador = document.getElementById("galeriaVisualizador");
    // Em navegadores sem dialog, os links continuam abrindo a foto inteira.
    if (!visualizador || typeof visualizador.showModal !== "function") return;

    var fotos = Array.from(document.querySelectorAll(".galeria-link"));
    var fotoAmpliada = document.getElementById("fotoAmpliada");
    var legenda = document.getElementById("fotoLegenda");
    var contador = document.getElementById("fotoContador");
    var indiceAtual = 0;
    var linkOrigem;

    function mostrarFoto(indice) {
        indiceAtual = (indice + fotos.length) % fotos.length;
        var link = fotos[indiceAtual];
        fotoAmpliada.src = link.href;
        fotoAmpliada.alt = link.querySelector("img").alt;
        legenda.textContent = link.closest("figure").querySelector(".galeria-legenda").textContent;
        contador.textContent = "Foto " + (indiceAtual + 1) + " de " + fotos.length;
    }

    fotos.forEach(function (link, indice) {
        link.setAttribute("aria-haspopup", "dialog");
        link.addEventListener("click", function (evento) {
            if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
            evento.preventDefault();
            linkOrigem = link;
            mostrarFoto(indice);
            visualizador.showModal();
            document.body.classList.add("foto-aberta");
        });
    });

    document.getElementById("fecharFoto").addEventListener("click", function () { visualizador.close(); });
    document.getElementById("fotoAnterior").addEventListener("click", function () { mostrarFoto(indiceAtual - 1); });
    document.getElementById("fotoProxima").addEventListener("click", function () { mostrarFoto(indiceAtual + 1); });
    visualizador.addEventListener("keydown", function (evento) {
        if (evento.key === "ArrowLeft" || evento.key === "ArrowRight") {
            evento.preventDefault();
            mostrarFoto(indiceAtual + (evento.key === "ArrowRight" ? 1 : -1));
        }
    });
    visualizador.addEventListener("click", function (evento) {
        if (evento.target === visualizador) {
            var limites = visualizador.getBoundingClientRect();
            if (evento.clientX < limites.left || evento.clientX > limites.right || evento.clientY < limites.top || evento.clientY > limites.bottom) {
                visualizador.close();
            }
        }
    });
    visualizador.addEventListener("close", function () {
        document.body.classList.remove("foto-aberta");
        if (linkOrigem) linkOrigem.focus({ preventScroll: true });
    });
})();
