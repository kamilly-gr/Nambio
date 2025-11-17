const carouselConteudo = document.getElementById('carousel-conteudo');
const cardsOriginal = Array.from(carouselConteudo.children);
const totalCards = cardsOriginal.length;
const cardWidth = cardsOriginal[0].offsetWidth + 16; // width + margin left + right (8px cada)

const cloneCount = 5;
// Clona os últimos cloneCount cards e adiciona no início
for (let i = totalCards - cloneCount; i < totalCards; i++) {
  const clone = cardsOriginal[i].cloneNode(true);
  clone.classList.add('clone');
  carouselConteudo.insertBefore(clone, carouselConteudo.firstChild);
}
// Clona os primeiros cloneCount cards e adiciona no final
for (let i = 0; i < cloneCount; i++) {
  const clone = cardsOriginal[i].cloneNode(true);
  clone.classList.add('clone');
  carouselConteudo.appendChild(clone);
}

const cards = Array.from(carouselConteudo.children);
let index = cloneCount; // começa com o primeiro card
let isTransitioning = false;

// Define posição inicial
carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;

function moveToIndex(newIndex) { //evita cliques durante a transição
  isTransitioning = true;
  carouselConteudo.style.transition = 'transform 0.5s ease';
  carouselConteudo.style.transform = `translateX(${-newIndex * cardWidth}px)`;
  index = newIndex;
}

carouselConteudo.addEventListener('transitionend', () => {
  // Se o índice estiver fora do intervalo dos cards originais, salta instantaneamente para o original
  if (index >= totalCards + cloneCount) {
    carouselConteudo.style.transition = 'none';
    index = cloneCount;
    carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;
  } else if (index < cloneCount) {
    carouselConteudo.style.transition = 'none';
    index = totalCards + cloneCount - 1;
    carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;
  }
  // Força reflow e permite a próxima transição
  void carouselConteudo.offsetWidth;
  isTransitioning = false;
});

// Listeners dos botões de seta
document.querySelector('.seta-direita').addEventListener('click', () => {
  moveToIndex(index + 1);
});
document.querySelector('.seta-esquerda').addEventListener('click', () => {
  moveToIndex(index - 1);
});