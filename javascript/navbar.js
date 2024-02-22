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