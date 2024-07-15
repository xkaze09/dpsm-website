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


  // Function to update the division name based on screen width
  function updateDivisionName() {
    // Select the element containing the division name
    const divisionNameElements = document.querySelectorAll('.division-name');

    // Check if the screen width is 992px or less
    if (window.innerWidth <= 992) {
      // Update the text to 'DPSM' for each matching element
      divisionNameElements.forEach(element => {
        element.textContent = 'DPSM';
      });
    } else {
      // Update the text back to the full name when the screen is wider than 992px
      divisionNameElements.forEach(element => {
        element.textContent = 'DIVISION OF PHYSICAL SCIENCES AND MATHEMATICS';
      });
    }
  }

  // Listen for window resize events
  window.addEventListener('resize', updateDivisionName);

  // Call the function on script load to check the initial screen width
  document.addEventListener('DOMContentLoaded', updateDivisionName);

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

