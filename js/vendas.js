let vendas = [
  { id: 1, cliente: "Carlos Andrade", produto: "Split 12000 BTUs Inverter", qtd: 1, valor: 2350.00 },
  { id: 2, cliente: "Maria Oliveira", produto: "Instalação Padrão", qtd: 2, valor: 1300.00 }
];

let proximoId = 3;

function renderizarTabela() {
  const tbody = document.getElementById('corpoTabela');
  if (!tbody) return;
  tbody.innerHTML = '';

  vendas.forEach(venda => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${venda.id}</td>
      <td>${venda.cliente}</td>
      <td>${venda.produto}</td>
      <td>${venda.qtd}</td>
      <td>R$ ${venda.valor.toFixed(2)}</td>
      <td>
        <button class="btn-acao btn-editar" onclick="carregarEdicao(${venda.id})">Editar</button>
        <button class="btn-acao btn-excluir" onclick="excluirVenda(${venda.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function carregarEdicao(id) {
  const venda = vendas.find(v => v.id === id);
  if (venda) {
    document.getElementById('vendaId').value = venda.id;
    document.getElementById('cliente').value = venda.cliente;
    document.getElementById('produto').value = venda.produto;
    document.getElementById('qtd').value = venda.qtd;
    document.getElementById('valor').value = venda.valor;

    document.getElementById('formTitle').innerText = "Editar Venda #" + id;
  }
}

function excluirVenda(id) {
  if (confirm(`Deseja realmente excluir a venda #${id}?`)) {
    vendas = vendas.filter(v => v.id !== id);
    renderizarTabela();
  }
}

function limparFormulario() {
  const form = document.getElementById('vendaForm');
  if (form) form.reset();
  document.getElementById('vendaId').value = '';
  document.getElementById('formTitle').innerText = "Nova Venda";
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarTabela();

  const form = document.getElementById('vendaForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const id = document.getElementById('vendaId').value;
      const cliente = document.getElementById('cliente').value;
      const produto = document.getElementById('produto').value;
      const qtd = parseInt(document.getElementById('qtd').value);
      const valor = parseFloat(document.getElementById('valor').value);

      if (id) {
        const index = vendas.findIndex(v => v.id == id);
        if (index !== -1) {
          vendas[index] = { id: parseInt(id), cliente, produto, qtd, valor };
        }
      } else {
        vendas.push({ id: proximoId++, cliente, produto, qtd, valor });
      }

      limparFormulario();
      renderizarTabela();
    });
  }

  const btnCancelar = document.getElementById('btnCancelar');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', limparFormulario);
  }
});
