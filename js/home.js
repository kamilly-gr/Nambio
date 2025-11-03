const carouselConteudo = document.getElementById('carousel-conteudo');
const cardsOriginal = Array.from(carouselConteudo.children);
const totalCards = cardsOriginal.length;
const cardWidth = cardsOriginal[0].offsetWidth + 16; // width + margin left+right (8px cada)

const cloneCount = 5;
// Clone last cloneCount cards and prepend
for (let i = totalCards - cloneCount; i < totalCards; i++) {
  const clone = cardsOriginal[i].cloneNode(true);
  clone.classList.add('clone');
  carouselConteudo.insertBefore(clone, carouselConteudo.firstChild);
}
// Clone first cloneCount cards and append
for (let i = 0; i < cloneCount; i++) {
  const clone = cardsOriginal[i].cloneNode(true);
  clone.classList.add('clone');
  carouselConteudo.appendChild(clone);
}

const cards = Array.from(carouselConteudo.children);
let index = cloneCount; // começa com o primeiro card
let isTransitioning = false;

// Set initial position
carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;

function moveToIndex(newIndex) {
  if (isTransitioning) return; // prevent clicks during transition
  isTransitioning = true;
  carouselConteudo.style.transition = 'transform 0.5s ease';
  carouselConteudo.style.transform = `translateX(${-newIndex * cardWidth}px)`;
  index = newIndex;
}

carouselConteudo.addEventListener('transitionend', () => {
  // If index is out of original cards range, jump instantly to the original
  if (index >= totalCards + cloneCount) {
    carouselConteudo.style.transition = 'none';
    index = cloneCount;
    carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;
  } else if (index < cloneCount) {
    carouselConteudo.style.transition = 'none';
    index = totalCards + cloneCount - 1;
    carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;
  }
  // Force reflow and allow next transition
  void carouselConteudo.offsetWidth;
  isTransitioning = false;
});

// Arrow buttons event listeners
document.querySelector('.seta-direita').addEventListener('click', () => {
  moveToIndex(index + 1);
});
document.querySelector('.seta-esquerda').addEventListener('click', () => {
  moveToIndex(index - 1);
});