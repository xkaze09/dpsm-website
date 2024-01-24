const comsciProspectus = [
  {
    title: 'FIRST YEAR',
    semesters: [
      {
        title: 'First Sem',
        courses: [
          {
            name: 'CMSC 10',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: '',
          },
          {
            name: 'CMSC 11',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
        ],
      },
      {
        title: 'Second Sem',
        courses: [
          {
            name: 'CMSC 123',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'CMSC 11',
          },
          {
            name: 'CMSC 22',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
          {
            name: 'CMSC 123',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'CMSC 11',
          },
          {
            name: 'CMSC 22',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
          {
            name: 'CMSC 123',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'CMSC 11',
          },
          {
            name: 'CMSC 22',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
          {
            name: 'CMSC 123',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'CMSC 11',
          },
          {
            name: 'CMSC 22',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
          {
            name: 'CMSC 123',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'CMSC 11',
          },
          {
            name: 'CMSC 22',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
          {
            name: 'CMSC 123',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'CMSC 11',
          },
          {
            name: 'CMSC 22',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
          {
            name: 'CMSC 123',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'CMSC 11',
          },
          {
            name: 'CMSC 22',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
        ],
      },
    ],
  },
  {
    title: 'SECOND YEAR',
    semesters: [
      {
        title: 'First Sem',
        courses: [
          {
            name: 'CMSC 200',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: '',
          },
          {
            name: 'CMSC -23',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'Kas 1',
          },
        ],
      },
      {
        title: 'Second Sem',
        courses: [
          {
            name: 'CMSC 55',
            title: 'Kasaysayan ng Pilipinas',
            link: '',
            credits: 3,
            preRequisites: 'CMSC 57',
          },
          {
            name: 'CMSC 257',
            title: 'Ethics and Moral Reasoning in Everyday Life',
            link: '',
            credits: 3,
            preRequisites: '',
          },
        ],
      },
    ],
  },
];

function generateProspectusTable(prospectus) {
  const table = document.getElementById('prospectusTableBody');

  if (!table) {
    return;
  }

  for (const section of prospectus) {
    table.innerHTML += `<tr>
            <td colspan="6">${section.title}</td>
          </tr>`;

    for (const semester of section.semesters) {
      let rows = '';
      let totalUnits = 0;

      for (let k = 0; k < semester.courses.length; k++) {
        const course = semester.courses[k];

        // Adds the title of the semester in the first row only
        // Otherwise add blank space
        rows += `
                <tr>
                  <th scope="row"></th>
                  <td>${k == 0 ? semester.title : ''}</td>
                  <td>${course.name}</td>
                  <td>${course.title}</td>
                  <td>${course.credits}</td>
                  <td>${course.preRequisites}</td>
                </tr>`;

        totalUnits += course.credits;
      }

      // Add total units row
      rows += `
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>${totalUnits}</td>
              <td></td>
            </tr>
            `;

      table.innerHTML += rows;
    }
  }
}

function initializeProspectus(course) {
  switch (course) {
    case 'comsci':
      generateProspectusTable(comsciProspectus);
      break;

    default:
      return;
  }
}
