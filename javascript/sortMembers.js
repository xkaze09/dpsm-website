document.addEventListener('DOMContentLoaded', () => {
  const staffMembers = [
    {
      name: 'Lizel D. Consolacion',
      title: 'Administrative Aide',
      imgSrc: './images/admin-faculty/consolacion.JPG',
    },
    {
      name: 'Dave G. Eslabra',
      title: 'Laboratory Aide',
      imgSrc: './images/admin-faculty/eslabra.JPG',
    },
    {
      name: 'Eugene Carl N. Famin',
      title: 'Laboratory Technician',
      imgSrc: './images/admin-faculty/famin.JPG',
    },
    {
      name: 'Salvacion C. Famisaran',
      title: 'Administrative Aide',
      imgSrc: './images/admin-faculty/famisaran.jpg',
    },
  ];

  const appMathFaculty = [
    {
      name: 'Maikel Roi M. Aguilar',
      title: 'Lecturer',
      imgSrc: './images/appmath-faculty/AGUILAR.jpg',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'mmaguilar5@up.edu.ph',
    },
    {
      name: 'Fretzy Jane A. Bares',
      title: 'Instructor (On Study Leave)',
      imgSrc: './images/appmath-faculty/bares.JPG',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'fabares@up.edu.ph',
    },
    {
      name: 'Edelia T. Braga',
      title: 'Assistant Professor',
      imgSrc: './images/appmath-faculty/BRAGA.jpg',
      degree: 'MS in Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'etbraga1@up.edu.ph',
    },
    {
      name: 'Raquel C. Cajayon',
      title: 'Assistant Professor (On Study Leave)',
      imgSrc: './images/appmath-faculty/cajayon.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'rccajayon@up.edu.ph',
    },
    {
      name: 'Kent Christian A. Castor',
      title: 'Assistant Professor',
      imgSrc: './images/appmath-faculty/castor.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'kacastor@up.edu.ph',
    },
    {
      name: 'Filame Joy U. Catinan',
      title: 'Assistant Professor',
      imgSrc: './images/appmath-faculty/catinan.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'fucatinan@up.edu.ph',
    },
    {
      name: 'Marierose R. Chavez',
      title: 'Assistant Professor',
      imgSrc: './images/appmath-faculty/chavez.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'mrchavez@up.edu.ph',
    },
    {
      name: 'Meloh Aleyen Grace V. Consular',
      title: 'Instructor',
      imgSrc: './images/appmath-faculty/CONSULAR.jpg',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'mvconsular@up.edu.ph',
    },
    {
      name: 'Lindley Kent M. Faina',
      title: 'Associate Professor (On Study Leave)',
      imgSrc: './images/appmath-faculty/faina.JPG',
      degree: 'MS in Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'lmfaina@up.edu.ph',
    },
    {
      name: 'Jeoffrey T. Libo-on',
      title: 'Assistant Professor',
      imgSrc: './images/appmath-faculty/LIBO-ON.jpg',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'jtliboon@up.edu.ph',
    },
    {
      name: 'Hyke J. Maybay',
      title: 'Instructor',
      imgSrc: './images/appmath-faculty/maybay.JPG',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'hjmaybay@up.edu.ph',
    },
    {
      name: 'Vincent N. Miclat',
      title: 'Instructor (On Study Leave)',
      imgSrc: './images/appmath-faculty/miclat.JPG',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'vnmiclat@up.edu.ph',
    },
    {
      name: 'Michele O. Olivares',
      title: 'Assistant Professor',
      imgSrc: './images/appmath-faculty/olivares.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'moolivares@up.edu.ph',
    },
    {
      name: 'Maryene B. Sy Piecco',
      title: 'Assistant Professor (On Study Leave)',
      imgSrc: './images/appmath-faculty/piecco.JPG',
      degree: 'MS in Applied Mathematics',
      university: 'University of the Philippines Diliman',
      email: 'mbsypiecco@up.edu.ph',
    },
    {
      name: 'Arnel L. Tampos, PhD',
      title: 'Associate Professor',
      imgSrc: './images/appmath-faculty/tampos.jpg',
      degree: 'PhD in Mathematics',
      university: 'University of the Philippines Diliman',
      additionalTitle: 'Cluster Coordinator',
      email: 'altampos@up.edu.ph',
    },
    {
      name: 'Kenneth Aldwin Villacarlos',
      title: 'Instructor',
      imgSrc: './images/appmath-faculty/villacarlos.jpg',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'kvillacarlos@up.edu.ph',
    },
    {
      name: 'Arjunraj R. Masmela',
      title: 'Instructor',
      imgSrc: './images/appmath-faculty/masmela.jpg',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'arjunrajmasmela05@gmail.com',
    },
    {
      name: "Leonel Fedric B. Tuburan",
      title: 'Instructor',
      imgSrc: './images/appmath-faculty/tuburan.jpeg',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'lbtuburan@up.edu.ph',
    },
    {
      name:"Jacob Maximus L. Usaraga",
      title: 'Instructor',
      imgSrc: './images/appmath-faculty/usaraga.jpg',
      degree: 'BS in Applied Mathematics',
      university: 'University of the Philippines Visayas',
      email: 'jacobmaximusu@gmail.com',
    },

  ];

  const compSciFaculty = [
    {
      name: 'Ara Abigail E. Ambita',
      imgSrc: './images/comsci-faculty/ambita.JPG',
      title: 'Assistant Professor',
      degree: 'MS in Computer Science',
      university: 'University of the Philippines Diliman',
      email: 'aeambita@up.edu.ph',
    },
    {
      name: 'Franz Angelo U. Apoyon',
      imgSrc: './images/comsci-faculty/apoyon.jpg',
      title: 'Instructor (On Study Leave)',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
      email: 'fuapoyon@up.edu.ph',
    },
    {
      name: 'Nilo C. Araneta',
      imgSrc: './images/comsci-faculty/araneta.png',
      title: 'Assistant Professor',
      degree: 'MS in Computer Science',
      university: 'Ateneo de Manila University',
      email: 'ncaraneta1@up.edu.ph',
    },
    {
      name: 'Christi Florence C. Cala-or',
      imgSrc: './images/comsci-faculty/cala-or.jpg',
      title: 'Assistant Professor',
      degree: 'MS in Information Technology - Computing',
      university: 'Valparaiso University, Indiana, USA',
      email: 'cccalaor@up.edu.ph',
    },
    {
      name: 'Jayvee B. Castañeda',
      imgSrc: './images/cs-faculty/CASTANEDA.jpg',
      title: 'Instructor (On Study Leave)',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
      email: 'jbcastaneda@up.edu.ph',
    },
    {
      name: 'Francis D. Dimzon, PhD',
      imgSrc: './images/comsci-faculty/dimzon.JPG',
      title: 'Assistant Professor',
      degree: 'PhD in Computer Science',
      university: 'De La Salle University',
      additionalTitle: 'Cluster Coordinator',
      email: 'fddimzon1@up.edu.ph',
    },
    {
      name: 'Nikko Gabriel J. Hismaña',
      imgSrc: './images/cs-faculty/hismana.png',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
      email: 'njhismana@up.edu.ph',
    },
    {
      name: 'Joanah Faith J. Sanz',
      imgSrc: './images/cs-faculty/SANZ.jpg',
      title: 'Lecturer',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
      email: 'jjsanz@up.edu.ph',
    },
    {
      name: 'Joseph Victor S. Sumbong',
      imgSrc: './images/cs-faculty/SUMBONG.jpg',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
      email: 'jssumbong@up.edu.ph',
    },
    {
      name: 'Rhyan L. Superatum',
      imgSrc: './images/cs-faculty/SUPERATUM.jpg',
      title: 'Instructor (On Study Leave)',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
      email: 'rlsuperatum@up.edu.ph',
    },
    {
      name: 'Elemar E. Teje',
      imgSrc: './images/cs-faculty/TEJE.jpg',
      title: 'Lecturer',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
      email: 'eeteje@up.edu.ph',
    },
    {
      name: "Franz Peter A. Ferrer",
      imgSrc: './images/cs-faculty/ferrer.jpg',
      title: 'Instructor',
      degree: 'BS in Computer Science',
      university: 'University of the Philippines Visayas',
      email: 'faferrer@up.edu.ph',
    },
    {
      name: "Rene Andre B. Jocsing",
      title: "Instructor",
      imgSrc: './images/cs-faculty/jocsing.png',
      degree: "BS in Computer Science",
      university: "University of the Philippines Visayas",
      email: "rbjocsing@up.edu.ph",
    },
    {
      name: "Kzlyr Shaira Manejo",
      title: "Instructor",
      imgSrc: './images/cs-faculty/manejo.jpg',
      degree: "BS in Computer Science",
      university: "University of the Philippines Visayas",
      email: "kmanejo@up.edu.ph",
    }
  ];

  const statisticsFaculty = [
    {
      name: 'Leah A. Araneta',
      imgSrc: './images/statistics-faculty/araneta.jpg',
      title: 'Assistant Professor',
      degree: 'MS in Statistics',
      university: 'University of the Philippines Diliman',
      email: 'laaraneta@up.edu.ph',
    },
    {
      name: 'Vicente T. Balinas',
      imgSrc: './images/statistics-faculty/balinas.jpg',
      title: 'Professor',
      degree: 'Master in Public Health Methodology',
      university: 'Free University of Brussels',
      additionalTitle: 'Cluster Coordinator',
      email: 'vtbalinas@up.edu.ph',
    },
    {
      name: 'Michelle B. Besana',
      imgSrc: './images/statistics-faculty/besana.jpg',
      title: 'Assistant Professor',
      degree: 'MA in Statistics <br> University of Pittsburgh, Pennsylvania, USA',
      university: 'MS in Statistics <br> University of the Philippines Diliman',
      email: 'mbbesana1@up.edu.ph',
    },
    {
      name: 'Tincy Jeay B. Canaman',
      imgSrc: './images/statistics-faculty/canaman.jpg',
      title: 'Instructor',
      degree: 'BS in Statistics',
      university: 'University of the Philippines Visayas',
      email: 'tjbcanaman@gmail.com',
    },
    {
      name: 'Jaser John G. Dago-oc',
      imgSrc: './images/statistics-faculty/dago-oc.jpg',
      title: 'Instructor (On Study Leave)',
      degree: 'BS in Statistics',
      university: 'University of the Philippines Visayas',
      email: 'jgdagooc@up.edu.ph',
    },
    {
      name: 'Jhoanne C. Gatpatan, PhD',
      imgSrc: './images/statistics-faculty/gatpatan.jpg',
      title: 'Assistant Professor',
      degree: 'PhD in Statistics',
      university: 'Western Michigan University, Michigan, USA',
      email: 'jcgatpatan@up.edu.ph',
    },
    {
      name: 'Daniel David M. Pamplona',
      imgSrc: './images/statistics-faculty/pamplona.jpg',
      title: 'Assistant Professor (On Study Leave)',
      degree: 'MS in Statistics',
      university: 'University of the Philippines Diliman',
      email: 'dmpamplona@up.edu.ph',
    },
    {
      name: 'RJ M. Capio',
      imgSrc: './images/statistics-faculty/capio.jpg',
      title: 'Lecturer',
      degree: 'BS in Statistics',
      university: 'University of the Philippines Visayas',
      email: 'rj.mcapio@gmail.com',
    },
    {
      name: "Glenn Ivan D. Macitas",
      imgSrc: './images/statistics-faculty/macitas.jpeg',
      title: "Instructor",
      degree: "BS in Statistics",
      university: "University of the Philippines Visayas",
      email: "glennivan.macitas@gmail.com",
    },
  ];

  const physicsFaculty = [
    {
      name: 'Reilly V. Bautista',
      imgSrc: './images/physics-faculty/bautista.JPG',
      title: 'Assistant Professor',
      degree: 'MS in Physics',
      university: 'De La Salle University, Manila',
      email: 'rvbautista2@up.edu.ph',
    },
    {
      name: 'Jumar G. Cadondon, PhD',
      imgSrc: './images/physics-faculty/cadondon.JPG',
      title: 'Assistant Professor',
      degree: 'PhD in Physics',
      university: 'De La Salle University, Manila',
      additionalTitle: 'Cluster Coordinator',
      email: 'jgcadondon@up.edu.ph',
    },
    {
      name: 'Rommel A. Espinosa, PhD',
      imgSrc: './images/physics-faculty/ESPINOSA.jpg',
      title: 'Associate Professor',
      degree: 'PhD in Computational Science and Informatics',
      university: 'George Mason University, Virginia, USA',
      email: 'raespinosa@up.edu.ph',
    },
    {
      name: 'Perry Neil J. Fernandez',
      imgSrc: './images/physics-faculty/fernandez.JPG',
      title: 'Assistant Professor (On Study Leave)',
      degree: 'MS in Physics',
      university: 'De La Salle University, Manila',
      email: 'pjfernandez@up.edu.ph',
    },
    {
      name: 'Alfonso Vicente L. Jadie',
      imgSrc: './images/physics-faculty/jadie.jpg',
      title: 'Instructor',
      degree: 'MS in Physics',
      university: 'De La Salle University, Manila',
      email: 'alfonsojadie26@gmail.com',
    },
    {
      name: 'Jared Gregory D. Mabunay',
      imgSrc: './images/physics-faculty/mabunay.JPG',
      title: 'Instructor',
      degree: 'BS in Applied Physics',
      university: 'University of the Philippines Manila',
      email: 'jdmabunay@up.edu.ph',
    },
    {
      name: 'Melanie C. Merciales',
      imgSrc: './images/physics-faculty/merciales.JPG',
      title: 'Instructor (On Study Leave)',
      degree: 'BS in Physics',
      university: 'University of the Philippines Baguio',
      email: 'mcmerciales@up.edu.ph',
    },
    {
      name: "Marsden I. Badlisan",
      imgSrc: './images/physics-faculty/badlisan.jpg',
      title: 'Instructor',
      degree: 'MS in Physics',
      university: 'University of the Philippines Diliman',
      email: 'mibadlisan@up.edu.ph',
    }
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
              ${member.university ? member.university + '<br />' : ''}
              ${type === 'staff' ? '' : (member.additionalTitle ? member.additionalTitle + '<br />' : '')}
              ${type === 'staff' ? '' : (member.email || '')}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // function sortByRank(array) {
  //   const rankOrder = {
  //     'Professor': 1,
  //     'Associate Professor': 2,
  //     'Assistant Professor': 3,
  //     'Instructor': 4,
  //     'Lecturer': 5
  //   };
  //   return array.sort((a, b) => (rankOrder[a.title] || 6) - (rankOrder[b.title] || 6));
  // }

  // function sortByName(array) {
  //   return array.sort((a, b) => a.name.localeCompare(b.name));
  // }

  function sortAll(array) {
    const rankOrder = {
      'Professor': 1,
      'Associate Professor': 2,
      'Assistant Professor': 3,
      'Instructor': 4,
      'Lecturer': 5
    };
    return array.slice().sort((a, b) => {
      // sort by rank
      const rankA = rankOrder[a.title?.replace(/\s*\(.*\)/, '')] || 6;
      const rankB = rankOrder[b.title?.replace(/\s*\(.*\)/, '')] || 6;
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      // sort by last name (use the last string)
      return a.name.localeCompare(b.name);
    });
  }

  const sortedStaffMembers = sortAll(staffMembers);
  const sortedAppMathFaculty = sortAll(appMathFaculty);
  const sortedCompSciFaculty = sortAll(compSciFaculty);
  const sortedStatisticsFaculty = sortAll(statisticsFaculty);
  const sortedPhysicsFaculty = sortAll(physicsFaculty);

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
