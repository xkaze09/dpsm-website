// Division Highlights Carousel Data
const divisionCarouselData = [
  {
    src: './images/highlights/highlight1.jpg',
    alt: 'DPSM Website Launch 2024',
    title: 'Exploring Excellence: DPSM Debuts Dynamic Website',
    text: 'The Division of Physical Sciences and Mathematics at the University of the Philippines Visayas proudly announces the inauguration of its latest digital endeavor: a website launched on February 24, 2024. Navigating the website is a breeze, with accessible information about division events, faculty profiles, and relevant announcements readily available at your fingertips. Stay up to date with the latest seminars, research breakthroughs, and academic achievements, all conveniently housed on one user-friendly interface. <br><br>The launch of the Division\'s website marks a significant milestone in its ongoing quest for digital innovation and academic excellence. As the Division continues to push boundaries and redefine the educational landscape, the website stands as a beacon of progress.',
  },
  {
    src: './images/highlights/highlight2.jpg',
    alt: '',
    title: 'DPSM Serves Science with a Side of Silicon in CAS Open House',
    text: 'In a delectable fusion of technology and gastronomy, the Division of Physical Sciences and Mathematics at the University of the Philippines Visayas joins the festivities of the CAS Open House during the College of Arts and Sciences week. Drawing inspiration from the IT sector, the Division serves up a feast that celebrates the inner workings of technology and its pivotal role in shaping our world. From "Memory Chips" to "Soup-ercomputer," the Division hopes to present the IT sector in a way that is both yummy and funny. <br><br>As students, staff, and faculty indulge in the Division\'s Open House, they are reminded of the ever-present relevance of technology and the boundless opportunities it presents for growth and innovation. The Division hopes to highlight the indispensable role of the IT sector in fostering unity and Panghimanwa within the university.',
  },
  {
    src: './images/highlights/highlight3.jpg',
    alt: 'DPSM Website Launch 2024',
    title: 'Numerical Navigators Converge in Math-O Interschool Quiz Bee',
    text: 'The Mathematics Circle, an organization under the Division of Physical Sciences and Mathematics (DPSM) at the University of the Philippines Visayas, recently orchestrated its yearly major event - the Interschool Mathematics Quiz Bee. Drawing participation from approximately 40 schools spanning elementary to high school levels across the region, the Quiz Bee showcased the elegance and versatility of mathematics. <br><br>A distinguishing feature of the quiz bee was the exclusive involvement of DPSM\'s esteemed faculty members as judges, ensuring impartial evaluation and expert oversight throughout the competition. Over the course of two intellectually stimulating days, winners were given certificates, cash prizes, and trophies. Beyond the tangible rewards, participants departed with a heightened appreciation for the beauty of mathematics and a renewed enthusiasm for exploring its myriad applications. <br><br><a class="text-link" href="https://www.facebook.com/UPVMathCircle/posts/pfbid0rNaigb3jcLHDispShTm6Nem8dXhgt5YvbQy23X6MKKnE8eWntE8nXGt7ArL7zC1ql" target="_blank">> Check out Math O\'s Facebook post here!</a>',
  },
];

// Function to update "Division Highlights" carousel
function updateDivisionCarousel() {
  const divisionCarouselImages = document.getElementById('division-carousel-images');
  const divisionCarouselTitle = document.getElementById('division-carousel-title');
  const divisionCarouselText = document.getElementById('division-carousel-text');

  let carouselHTML = '';
  divisionCarouselData.forEach((item, index) => {
    const activeClass = index === 0 ? 'active' : '';
    carouselHTML += `
        <div class="carousel-item ${activeClass}">
            <img src="${item.src}" class="d-block w-100" alt="${item.alt}">
            <!-- No need to add title in HTML as it will be dynamically updated -->
        </div>
        `;
  });

  divisionCarouselImages.innerHTML = carouselHTML;

  // Set initial title and text
  divisionCarouselTitle.innerHTML = divisionCarouselData[0].title;
  divisionCarouselText.innerHTML = divisionCarouselData[0].text;

  const divisionCarousel = document.getElementById('divisionCarousel');
  divisionCarousel.addEventListener('slid.bs.carousel', function () {
    const activeItem = document.querySelector('#divisionCarousel .carousel-item.active');
    const activeIndex = Array.from(divisionCarouselImages.children).indexOf(activeItem);
    divisionCarouselTitle.innerHTML = divisionCarouselData[activeIndex].title; // Update title dynamically
    divisionCarouselText.innerHTML = divisionCarouselData[activeIndex].text; // Update text dynamically
  });
}

// Call the function to initially populate the "Division Highlights" carousel
updateDivisionCarousel();
