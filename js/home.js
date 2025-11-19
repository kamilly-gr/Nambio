document.addEventListener('DOMContentLoaded', () => {
  // Inicializa todos os carrosséis da página
  document.querySelectorAll('.carousel-container').forEach(container => {
    initCarousel(container);
  });
});

function initCarousel(container) {
  const carouselConteudo = container.querySelector('.carousel-conteudo');
  const cardsOriginal = Array.from(carouselConteudo.children);
  
  if (cardsOriginal.length === 0) return;

  const totalCards = cardsOriginal.length;
  const cardWidth = cardsOriginal[0].offsetWidth + 16; // 8px margin left + 8px right
  const cloneCount = Math.min(5, totalCards); // nunca clone mais que o total

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
  let index = cloneCount;
  let isTransitioning = false;

  // Posição inicial
  carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;

  function moveToIndex(newIndex) {
    if (isTransitioning) return;
    isTransitioning = true;
    carouselConteudo.style.transition = 'transform 0.5s ease';
    carouselConteudo.style.transform = `translateX(${-newIndex * cardWidth}px)`;
    index = newIndex;
  }

  carouselConteudo.addEventListener('transitionend', () => {
    if (index >= totalCards + cloneCount) {
      carouselConteudo.style.transition = 'none';
      index = cloneCount;
      carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;
    } else if (index < cloneCount) {
      carouselConteudo.style.transition = 'none';
      index = totalCards + cloneCount - 1;
      carouselConteudo.style.transform = `translateX(${-index * cardWidth}px)`;
    }
    void carouselConteudo.offsetWidth; // força reflow
    isTransitioning = false;
  });

  // Botões de navegação específicos deste container
  const btnEsquerda = container.querySelector('.seta-esquerda');
  const btnDireita = container.querySelector('.seta-direita');

  if (btnEsquerda) btnEsquerda.addEventListener('click', () => moveToIndex(index - 1));
  if (btnDireita) btnDireita.addEventListener('click', () => moveToIndex(index + 1));
}