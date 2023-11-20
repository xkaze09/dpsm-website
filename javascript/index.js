// Division Highlights Carousel Data
const divisionCarouselData = [
  {
    src: './images/card1.png',
    alt: 'Image A',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis urna cursus eget nunc scelerisque viverra mauris in. Consequat mauris nunc congue nisi vitae suscipit tellus mauris a. Risus pretium quam vulputate dignissim suspendisse in est ante. Diam phasellus vestibulum lorem sed risus ultricies. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed. Convallis aenean et tortor at risus viverra. Facilisi cras fermentum odio eu feugiat pretium. At tellus at urna condimentum mattis pellentesque. Accumsan sit amet nulla facilisi morbi. In dictum non consectetur a erat nam. Lacus vel facilisis volutpat est velit. Eget arcu dictum varius duis at consectetur. Malesuada proin libero nunc consequat interdum varius sit amet mattis.',
  },
  {
    src: './images/card2.png',
    alt: 'Image B',
    text: 'Condimentum vitae sapien pellentesque habitant morbi tristique. Mi sit amet mauris commodo quis imperdiet. Cursus metus aliquam eleifend mi. Ullamcorper morbi tincidunt ornare massa. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Nunc mi ipsum faucibus vitae aliquet. Adipiscing commodo elit at imperdiet. Congue eu consequat ac felis donec et odio. Eu sem integer vitae justo eget. Nibh tortor id aliquet lectus proin nibh nisl condimentum. Quam pellentesque nec nam aliquam sem. Dignissim diam quis enim lobortis scelerisque fermentum dui faucibus. Urna condimentum mattis pellentesque id nibh.',
  },
  {
    src: './images/card3.png',
    alt: 'Image C',
    text: 'Nunc aliquet bibendum enim facilisis gravida neque. Nibh praesent tristique magna sit amet. Dignissim cras tincidunt lobortis feugiat vivamus at. In fermentum et sollicitudin ac orci. Maecenas ultricies mi eget mauris pharetra et. Pulvinar neque laoreet suspendisse interdum. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus et. Nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. In vitae turpis massa sed elementum tempus egestas. Cum sociis natoque penatibus et magnis dis parturient montes nascetur. Elementum tempus egestas sed sed risus pretium quam vulputate dignissim. Lacus viverra vitae congue eu consequat ac felis donec. Commodo elit at imperdiet dui accumsan sit amet.',
  },
];

// Function to update "Division Highlights" carousel
function updateDivisionCarousel() {
  const divisionCarouselImages = document.getElementById('division-carousel-images');
  const divisionCarouselText = document.getElementById('division-carousel-text');

  let carouselHTML = '';
  divisionCarouselData.forEach((item, index) => {
    const activeClass = index === 0 ? 'active' : '';
    carouselHTML += `
        <div class="carousel-item ${activeClass}">
            <img src="${item.src}" class="d-block w-100" alt="${item.alt}">
        </div>
        `;
  });

  divisionCarouselImages.innerHTML = carouselHTML;

  const divisionCarousel = document.getElementById('divisionCarousel');
  divisionCarousel.addEventListener('slid.bs.carousel', function () {
    const activeItem = document.querySelector('#divisionCarousel .carousel-item.active');
    const activeIndex = Array.from(divisionCarouselImages.children).indexOf(activeItem);
    divisionCarouselText.textContent = divisionCarouselData[activeIndex].text;
  });

  divisionCarouselText.textContent = divisionCarouselData[0].text;
}

// Call the function to initially populate the "Division Highlights" carousel
updateDivisionCarousel();
