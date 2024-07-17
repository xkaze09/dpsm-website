class UniversityNavbar extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container university-navbar">
    <div class="navbar-brand menu d-flex justify-content-center align-items-center gap-2">
      <a href="https://upv.edu.ph/" target="_blank">
        <img class="logo-highlight" src="images/upvlogo.png" width="53" />
      </a>
      <a href="/index.html" target="_self">
        <img class="logo-highlight" src="images/dpsmlogo.png" width="48" />
      </a>
      <a href="/index.html" target="_self">
        <div class="text-center">
          <span class="upper-division-name text-white text-start text-wrap">
            DIVISION OF PHYSICAL SCIENCES AND MATHEMATICS
          </span>
        </div>
      </a>
    </div>
    <div class="collapse navbar-collapse flex-grow-0" id="navbarNavAltMarkup">
      <ul class="navbar-nav text-center">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="./index.html">Home</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="resourcesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Resources & Support
          </a>
          <ul class="dropdown-menu" aria-labelledby="resourcesDropdown">
            <li><a class="dropdown-item" href="./facilities.html">Facilities</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
`;
    }
  }
  
  customElements.define('university-navbar', UniversityNavbar);