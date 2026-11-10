function filtrarProdutos() {
  const termo = document.getElementById('inputBusca').value.toLowerCase();
  const cards = document.querySelectorAll('.card-produto');

  cards.forEach(card => {
    const nome = card.getAttribute('data-nome').toLowerCase();
    if (nome.includes(termo)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const inputBusca = document.getElementById('inputBusca');
  if (inputBusca) {
    inputBusca.addEventListener('keyup', filtrarProdutos);
  }
});
