document.addEventListener('DOMContentLoaded', () => {
  const staffMembers = [
    {
      name: 'Ian Jasper B. Brillantes',
      title: 'Computer Maintenance Technologist',
      imgSrc: '/images/admin-faculty/brillantes.JPG',
    },
    {
      name: 'Lizel D. Consolacion',
      title: 'Administrative Aide',
      imgSrc: '/images/admin-faculty/consolacion.JPG',
    },
    {
      name: 'Dave G. Eslabra',
      title: 'Laboratory Aide',
      imgSrc: '/images/admin-faculty/eslabra.JPG',
    },
    {
      name: 'Eugene Carl N. Famin',
      title: 'Laboratory Technician',
      imgSrc: '/images/admin-faculty/famin.JPG',
    },
    {
      name: 'Salvacion C. Famisaran',
      title: 'Administrative Aide',
      imgSrc: '/images/admin-faculty/famisaran.jpg',
    },
  ];

  const appMathFaculty = [
    {
      name: 'Maikel Roi M. Aguilar',
      title: 'Instructor',
      imgSrc: '/images/appmath-faculty/AGUILAR.jpg',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Fretzy Jane A. Bares',
      title: 'Instructor',
      imgSrc: '/images/appmath-faculty/bares.JPG',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Edelia T. Braga',
      title: 'Assistant Professor',
      imgSrc: '/images/appmath-faculty/BRAGA.jpg',
      degree: 'MS in Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Raquel C. Cajayon',
      title: 'Assistant Professor',
      imgSrc: '/images/appmath-faculty/cajayon.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Kent Christian A. Castor',
      title: 'Assistant Professor',
      imgSrc: '/images/appmath-faculty/castor.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Filame Joy U. Catinan',
      title: 'Assistant Professor',
      imgSrc: '/images/appmath-faculty/catinan.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Marierose R. Chavez',
      title: 'Assistant Professor',
      imgSrc: '/images/appmath-faculty/chavez.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Meloh Aleyen Grace V. Consular',
      title: 'Instructor',
      imgSrc: '/images/appmath-faculty/CONSULAR.jpg',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Lindley Kent M. Faina',
      title: 'Associate Professor',
      imgSrc: '/images/appmath-faculty/faina.JPG',
      degree: 'MS in Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'RB Jann G. Jamindang',
      title: 'Instructor',
      imgSrc: '/images/appmath-faculty/jamindang.JPG',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Jeoffrey T. Libo-on',
      title: 'Assistant Professor',
      imgSrc: '/images/appmath-faculty/LIBO-ON.jpg',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Vincent N. Miclat',
      title: 'Instructor',
      imgSrc: '/images/appmath-faculty/miclat.JPG',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Michele O. Olivares',
      title: 'Assistant Professor',
      imgSrc: '/images/appmath-faculty/olivares.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Maryene B. Sy Piecco',
      title: 'Program Coordinator of Applied Mathematics',
      imgSrc: '/images/appmath-faculty/piecco.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Arnel L. Tampos',
      title: 'Associate Professor',
      imgSrc: '/images/admin-faculty/tampos.jpg',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Lorenz T. Terania',
      title: 'Instructor',
      imgSrc: '/images/appmath-faculty/terania.JPG',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
    },
  ];

  const compSciFaculty = [
    {
      name: 'Ara Abigail E. Ambita',
      imgSrc: '/images/comsci-faculty/ambita.JPG',
      title: 'Assistant Professor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Franz Angelo U. Apoyon',
      imgSrc: '/images/comsci-faculty/apoyon.jpg',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Nilo C. Araneta',
      imgSrc: '/images/comsci-faculty/araneta.png',
      title: 'Assistant Professor',
      degree: 'MS in Computer Science',
      university: 'Ateneo de Manila University',
    },
    {
      name: 'Christi Florence C. Cala-or',
      imgSrc: '/images/comsci-faculty/cala-or.jpg',
      title: 'Assistant Professor',
      degree: 'MS in Information Technology - Computing',
      university: 'Valparaiso University, Indiana, USA',
    },
    {
      name: 'Jayvee B. Castañeda',
      imgSrc: '/images/cs-faculty/CASTANEDA.jpg',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Francis D. Dimzon',
      imgSrc: '/images/comsci-faculty/dimzon.JPG',
      title: 'Assistant Professor',
      degree: 'MS in Computer Science',
      university: 'University of the Philippines Los Baños',
    },
    {
      name: 'Joanah Faith J. Sanz',
      imgSrc: '/images/cs-faculty/SANZ.jpg',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Joseph Victor S. Sumbong',
      imgSrc: '/images/cs-faculty/SUMBONG.jpg',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Rhyan L. Superatum',
      imgSrc: '/images/cs-faculty/SUPERATUM.jpg',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Elemar E. Teje',
      imgSrc: '/images/cs-faculty/TEJE.jpg',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
    },
  ];

  const statisticsFaculty = [
    {
      name: 'Elfred John C. Abacan',
      imgSrc: '/images/statistics-faculty/abacan.jpg',
      title: 'Assistant Professor',
      degree: 'MS in Statistics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Leah A. Araneta',
      imgSrc: '/images/statistics-faculty/araneta.jpg',
      title: 'Assistant Professor',
      degree: 'MS in Statistics',
      university: 'University of the Philippines Diliman',
    },
    {
      name: 'Vicente T. Balinas',
      imgSrc: '/images/statistics-faculty/balinas.jpg',
      title: 'Professor',
      degree: 'Master in Public Health Methodology',
      university: 'Free University of Brussels',
    },
    {
      name: 'Michelle B. Besana',
      imgSrc: '/images/statistics-faculty/besana.jpg',
      title: 'Assistant Professor',
      degree: 'MA in Statistics <br> University of Pittsburgh, Pennsylvania, USA',
      university: 'MS in Statistics <br> University of the Philippines Diliman',
    },
    {
      name: 'Jaser John G. Dago-oc',
      imgSrc: '/images/statistics-faculty/dago-oc.jpg',
      title: 'Instructor',
      degree: 'BS in Statistics',
      university: 'University of the Philippines Visayas',
    },
    {
      name: 'Jhoanne C. Gatpatan',
      imgSrc: '/images/statistics-faculty/gatpatan.jpg',
      title: 'Assistant Professor',
      degree: 'PhD in Statistics',
      university: 'Western Michigan University, Michigan, USA',
    },
    {
      name: 'Daniel David M. Pamplona',
      imgSrc: '/images/statistics-faculty/pamplona.jpg',
      title: 'Assistant Professor',
      degree: 'MS in Mathematics',
      university: 'University of the Philippines Diliman',
    },
  ];

  const physicsFaculty = [
    {
      name: 'Reilly V. Bautista',
      imgSrc: '/images/physics-faculty/bautista.JPG',
      title: 'Instructor',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Los Baños',
    },
    {
      name: 'Jumar G. Cadondon',
      imgSrc: '/images/physics-faculty/cadondon.JPG',
      title: 'Assistant Professor',
      degree: 'MS in Physics',
      university: 'De La Salle University, Manila',
    },
    {
      name: 'Rommel A. Espinosa',
      imgSrc: '/images/physics-faculty/ESPINOSA.jpg',
      title: 'Associate Professor',
      degree: 'PhD in Computational Science and Informatics',
      university: 'George Mason University, Virginia, USA',
    },
    {
      name: 'Perry Neil J. Fernandez',
      imgSrc: '/images/physics-faculty/fernandez.JPG',
      title: 'Assistant Professor',
      degree: 'MS in Physics',
      university: 'De La Salle University, Manila',
      additionalTitle: 'Head of Physics',
    },
    {
      name: 'Donna H. Gabor',
      imgSrc: '/images/physics-faculty/gabor.JPG',
      title: 'Assistant Professor',
      degree: 'MS in Physics',
      university: 'Ateneo de Manila University',
    },
    {
      name: 'Jared Gregory D. Mabunay',
      imgSrc: '/images/physics-faculty/mabunay.JPG',
      title: 'Instructor',
      degree: 'BS Applied Physics',
      university: 'University of the Philippines Manila',
    },
    {
      name: 'Melanie C. Merciales',
      imgSrc: '/images/physics-faculty/merciales.JPG',
      title: 'Instructor',
      degree: 'BS in Physics',
      university: 'University of the Philippines Manila',
    },
    {
      name: 'Key T. Simfroso',
      imgSrc: '/images/physics-faculty/simfroso.JPG',
      title: 'Instructor',
      degree: 'MS in Physics',
      university: 'MSU-Iligan Institute of Technology',
    },
  ];

  function createCard(member, type = 'faculty') {
    return `
      <div class="col-lg-4 mb-3 d-flex align-items-stretch">
        <div class="card">
          <img src="${member.imgSrc}" class="card-img-top" alt="${member.name}" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${member.name}</h5>
            <p class="card-text mb-4">
              <i>${member.title}</i><br />
              ${member.degree ? member.degree + '<br />' : ''}
              ${member.university ? member.university : ''}
              ${type === 'staff' ? '' : '<br />' + (member.additionalTitle || '')}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function sortByName(array) {
    return array.sort((a, b) => a.name.localeCompare(b.name));
  }

  const sortedStaffMembers = sortByName(staffMembers);
  const sortedAppMathFaculty = sortByName(appMathFaculty);
  const sortedCompSciFaculty = sortByName(compSciFaculty);
  const sortedStatisticsFaculty = sortByName(statisticsFaculty);
  const sortedPhysicsFaculty = sortByName(physicsFaculty);

  document.getElementById('staff-list').innerHTML = sortedStaffMembers
    .map((member) => createCard(member, 'staff'))
    .join('');
  document.getElementById('appMath-list').innerHTML = sortedAppMathFaculty.map(createCard).join('');
  document.getElementById('compSci-list').innerHTML = sortedCompSciFaculty.map(createCard).join('');
  document.getElementById('stats-list').innerHTML = sortedStatisticsFaculty
    .map(createCard)
    .join('');
  document.getElementById('physics-list').innerHTML = sortedPhysicsFaculty.map(createCard).join('');
});
