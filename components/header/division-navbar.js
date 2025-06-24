class DivisionNavbar extends HTMLElement {
  connectedCallback() {
      this.innerHTML = `
  <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">
    <div class="container">
      <div class="division-navbar navbar-brand menu d-flex justify-content-center align-items-center gap-2" href="#">
        <a href="../index.html" target="_self" class="">
          <img
            class="dpsm-logo-highlight rounded-circle"
            src="../images/dpsmlogo.png"
            width="48"
          />
        </a>
        <a href="./index.html" target="_self" class="">
          <span class="division-name text-start">DIVISION OF PHYSICAL SCIENCES AND MATHEMATICS</span>
        </a>
      </div>
      
      <div class="collapse navbar-collapse flex-grow-0" id="navbarNavAltMarkup">
      <ul class="navbar-nav text-center d-flex justify-content-center align-items-center gap-4">
      <li class="nav-item dropdown">
            <!-- Add dropdown class to the list item -->
            <a
              class="bottom-nav-link dropdown-toggle"
              href="#"
              id="aboutDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              About
              <!-- Dropdown toggle button -->
            </a>
            <div class="dropdown-menu" aria-labelledby="aboutDropdown">
              <!-- Dropdown menu -->
              <a class="dropdown-item" href="../about.html">About DPSM</a>
              <a class="dropdown-item" href="../faculty-organization.html">Faculty & Staff Members</a>
            </div>
      </li>
      <li>
      <a class="bottom-nav-link text-dark" href="../admissions.html">Admission</a>
      </li>
      <li>
        <a class="bottom-nav-link text-dark" href="../news-master-page.html">News</a>
      </li>
          <li class="nav-item dropdown">
            <!-- Add dropdown class to the list item -->
            <a
              class="bottom-nav-link dropdown-toggle"
              href="#"
              id="programsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Programs
              <!-- Dropdown toggle button -->
            </a>
            <div class="dropdown-menu" aria-labelledby="programsDropdown">
              <!-- Dropdown menu -->
              <a class="dropdown-item" href="../applied-mathematics.html">B.S. in Applied Mathematics</a>
              <a class="dropdown-item" href="../computer-science.html">B.S. in Computer Science</a>
              <a class="dropdown-item" href="../statistics.html">B.S. in Statistics</a>
            </div>
          </li>
          <li>
            <a class="bottom-nav-link text-dark" href="../research.html">Research & Public Service</a>
          </li>
          <li>
            <a class="bottom-nav-link text-dark" href="../contact-us.html">Contact Us</a>
          </li>
          
        </ul>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>`;
  }
}

customElements.define('division-navbar', DivisionNavbar);