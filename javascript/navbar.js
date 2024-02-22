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


// Animation
document.addEventListener("DOMContentLoaded", function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.3 // Adjust as needed
  });

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));
});
