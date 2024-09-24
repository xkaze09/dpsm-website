class Footer extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <footer
      class="footer-with-image pt-5"
      style="background-image: url(&quot;../images/footer/footer.png&quot;)"
    >
      <div class="container mb-5">
        <div class="row">
          <div class="footer-icons col-md-2 d-flex justify-content-evenly align-items-center">
            <!-- Content for the left column (col-2) -->
          </div>
          <div class="footer-content col-md-10">
            <!-- Content for the right column (col-10) -->
            <div class="footer-heading container-fluid">
              <!-- First container (100% width of the outer container) -->
              <span class="footer-division-text text-light"
                >UPV Division of Physical Sciences and Mathematics</span
              >
            </div>
            <div class="container-fluid mt-3">
              <!-- Second container (100% width of the outer container with margin top) -->
            </div>
          </div>
        </div>
        <div class="row">
          <div class="footer-icons col-md-2 d-flex justify-content-evenly align-items-center">
            <!-- Content for the left column (col-2) -->
            <img src="../images/upvlogo.png" alt="UPV Logo" width="72px" />
            <img class="rounded-circle" src="../images/dpsmlogo.png" alt="DPSM Logo" width="72px" />
          </div>
          <div class="footer-content col-md-10">
            <!-- Content for the right column (col-10) -->
            <div class="footer-horizontal-line container-fluid">
              <!-- First container (100% width of the outer container) -->
            </div>
            <div class="container-fluid mt-3">
              <!-- Second container (100% width of the outer container with margin top) -->
              <div class="row">
                <div class="footer-subtitle col-md-3 d-flex align-items-center">
                  <p>
                    UPV CAS Building <br>
                    5023 Miagao, Iloilo <br>
                    Tel. No.: (033) 315-9625 Local: 239 <br>
                    Email: psm.upvisayas@up.edu.ph <br>
                  </p>
                </div>
                <div class="footer-subtitle col-md-4">
                  <p class="fw-normal section-subtitle d-flex flex-column">
                    <span>Quick Links</span>
                    <a href="https://crs.upv.edu.ph/" target="_blank" class="footer-link fw-bold">
                      > Computerized Registration System <br>
                    </a>
                    <a href="https://upvisayas.net/lms3/my/" target="_blank" class="footer-link fw-bold">
                      > UP Visayas Learning Management System <br>
                    </a>
                    <a href="https://www.upv.edu.ph/" target="_blank" class="footer-link fw-bold">
                      > UP Visayas Website <br>
                    </a>
                  </p>
                </div>
                <nav class="footer-nav navbar navbar-expand-lg justify-content-center col-md-3">
                  <div class="" id="navbarNavAltMarkup">
                    <div class="d-flex gap-3">
                      <a class="footer-link fw-bold" href="./about.html">About Us</a>
                      <a class="footer-link fw-bold" href="./support.html">Support</a>
                      <a class="footer-link fw-bold" href="#">FAQs</a>
                    </div>
                  </div>
                </nav>
                <div
                class="footer-buttons d-flex justify-content-around align-items-center col-md-2"
                >
                <a href="https://www.facebook.com/dpsmcas" target="_blank"> 
                  <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512">
                    <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <style>
                      svg {
                        fill: #faf8f5;
                      }
                    </style>
                    <path
                    d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
                    />
                  </svg>
                </a>
                <a href="./contact-us.html" target="_blank"> 
                  <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512">
                    <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <style>
                      svg {
                        fill: #f5f5fa;
                      }
                    </style>
                    <path
                    d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                    />
                  </svg>
                </a>
                <button type="button" class="btn p-0" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="(033) 315-9625 Local: 239" aria-label="Phone Information">
                  <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" aria-hidden="true">
                    <style>
                      svg { fill: #f5f5fa; }
                    </style>
                    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                  </svg>
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="footer-subtitle p-0 section-subtitle text-center">Copyright © 2024 Division of Physical Sciences and Mathematics. <br>All rights reserved.</p>
    </footer>`;
    }
  }
  
  customElements.define('dpsm-footer', Footer);