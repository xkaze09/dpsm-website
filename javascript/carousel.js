// carousel.js

// Function to update carousel content and text
function updateCarousel(carouselData) {
  const carouselImages = document.getElementById('carousel-images');
  const carouselText = document.getElementById('carousel-text');

  let carouselHTML = '';
  carouselData.forEach((item, index) => {
    const activeClass = index === 0 ? 'active' : '';
    carouselHTML += `
        <div class="carousel-item ${activeClass}">
            <img src="${item.src}" class="d-block w-100" alt="${item.alt}">
        </div>
        `;
  });

  carouselImages.innerHTML = carouselHTML;

  function updateTextWithTag(index) {
    const item = carouselData[index];
    const tagHTML = item.text
      ? `<span class="badge rounded-pill bg-primary">${item.text}</span>`
      : '';
    carouselText.innerHTML = `${tagHTML}`;
  }

  // Update the text based on the active carousel item
  const carousel = document.getElementById('carouselExample');
  carousel.addEventListener('slid.bs.carousel', function () {
    const activeItem = document.querySelector('.carousel-item.active');
    const activeIndex = Array.from(activeItem.parentNode.children).indexOf(activeItem);
    updateTextWithTag(activeIndex)
  });

  // Initialize the placeholder text with the content of the first carousel item
   updateTextWithTag(0);
}
