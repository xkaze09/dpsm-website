class UniversityNavbar extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container university-navbar">
        <div class="navbar-brand menu d-flex justify-content-center align-items-center gap-2">
          <a href="https://upv.edu.ph/" target="_blank" class="">
            <img class="logo-highlight" src="images/upvlogo.png" width="53" />
          </a>
          <a href="/index.html" target="_self" class="">
            <img class="logo-highlight" src="images/dpsmlogo.png" width="48" />
          </a>
          <a href="/index.html" target="_self" class="">
            <div class="text-center ">
              <span class="upper-division-name text-white text-start text-wrap"
              >DIVISION OF PHYSICAL SCIENCES AND MATHEMATICS MEOW</span
              >
            </div>
          </a>
        </div>
        <div class="collapse navbar-collapse flex-grow-0" id="navbarNavAltMarkup">
          <ul class="navbar-nav text-center">
            <li>
              <a class="nav-link" aria-current="page" href="./index.html">Home</a>
            </li>
            <li>
              <a class="nav-link" href="./support.html">Resources & Support</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>`;
    }
  }
  
  customElements.define('university-navbar', UniversityNavbar);