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
        let credits = course.isCredited ? course.credits : '(' + course.credits + ')';
        const link = course.link ? `/courses/${course.link}` : '';

        rows += `
                <tr>
                  <th scope="row"></th>
                  <td>${k == 0 ? semester.title : ''}</td>
                  <td><a href=${link}>${course.name}</a></td>
                  <td>${course.title}</td>
                  <td>${credits ?? ''}</td>
                  <td>${course.preRequisites}</td>
                </tr>`;

        if (course.isCredited) {
          totalUnits += course.credits;
        }
      }

      // Add total units row
      if (totalUnits != 0) {
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
      }

      table.innerHTML += rows;
    }
  }
}

export function initializeProspectus(course) {
  let prospectusData;
  
  // Fetch the data.json file asynchronously
  fetch('../javascript/course/data.json')
    .then(response => response.json())
    .then(data => {
      // Once data is fetched, call generateProspectusTable with the fetched data
      prospectusData = data;
      switch (course) {
        case 'comsci':
          generateProspectusTable(prospectusData.COMSCI);
          break;
        case 'appmath':
          generateProspectusTable(prospectusData.APPMATH);
          break;
        case 'stat':
          generateProspectusTable(prospectusData.STAT);
          break;
        default:
          return;
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}
