// Navbar
document.addEventListener('DOMContentLoaded', function () {
  const divisionNavbar = document.querySelector('.division-navbar');

  function toggleNavbarVisibility() {
    if (window.scrollY > 0) {
      divisionNavbar.classList.add('show');
    } else {
      divisionNavbar.classList.remove('show');
    }
  }

  // Initial check on page load
  toggleNavbarVisibility();

  // Add scroll event listener
  window.addEventListener('scroll', toggleNavbarVisibility);
});


// 

document.addEventListener('DOMContentLoaded', function () {
  const divisionNavbar = document.querySelector('.division-navbar');

  // Function to toggle navbar visibility
  function toggleNavbarVisibility() {
    if (window.scrollY > 0) {
      divisionNavbar.classList.add('show');
    } else {
      divisionNavbar.classList.remove('show');
    }
  }

  // Call the function on page load
  toggleNavbarVisibility();

  // Add scroll event listener
  window.addEventListener('scroll', toggleNavbarVisibility);

  // Function to change navbar text based on screen width
  function updateNavbarText() {
    const divisionNameElement = document.querySelector('.division-name');
    if (window.innerWidth < 990) {
      divisionNameElement.textContent = 'DPSM';
    } else {
      divisionNameElement.textContent = 'DIVISION OF PHYSICAL SCIENCES AND MATHEMATICS';
    }
  }

  // Call the function on page load and on window resize
  updateNavbarText();
  window.addEventListener('resize', updateNavbarText);
});
