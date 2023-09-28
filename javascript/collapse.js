// Mission & Vision Collapse
const missionVisionCollapseButtons = document.querySelectorAll('.collapse-button');
const missionVisionCollapseContents = document.querySelectorAll('.collapse');
let activeMissionVisionButton = null;

missionVisionCollapseButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (activeMissionVisionButton !== button) {
        // Toggle the 'show' class for the clicked button's target
        const targetId = button.getAttribute('data-bs-target');
        const targetCollapse = document.querySelector(targetId);

        if (targetCollapse.classList.contains('show')) {
            targetCollapse.classList.remove('show');
        } else {
            missionVisionCollapseContents.forEach(collapse => {
            collapse.classList.remove('show');
            });
            targetCollapse.classList.add('show');
        }

        // Update the active button
        if (activeMissionVisionButton) {
            activeMissionVisionButton.classList.remove('course-info-active');
        }
        button.classList.add('course-info-active');
        activeMissionVisionButton = button;
        }
    });
});

// Courses Collapse
const coursesButtons = document.querySelectorAll('.collapse-button');
const coursesContents = document.querySelectorAll('.collapse');
let timeoutId;

// Trigger click on default button on page load, in this case, it is "admissions" button
const admissionButton = document.querySelector('[data-bs-target="#admissionText"]');
admissionButton.click();
admissionButton.classList.add('course-info-active'); // Highlight the button

coursesButtons.forEach(button => {
    button.addEventListener('click', () => {
        clearTimeout(timeoutId); // Clear any pending timeouts
        timeoutId = setTimeout(() => { // Set a new timeout
        coursesButtons.forEach(otherButton => {
            otherButton.classList.remove('course-info-active');
        });
        button.classList.add('course-info-active');

        const targetId = button.getAttribute('data-bs-target');
        const targetCollapse = document.querySelector(targetId);

        coursesContents.forEach(collapse => {
            if (collapse !== targetCollapse) {
            collapse.classList.remove('show');
            }
        });
        }, 300); // Adjust delay
    });
    });

    coursesContents.forEach(collapse => {
    collapse.addEventListener('hidden.bs.collapse', () => {
        coursesButtons.forEach(button => {
        button.classList.remove('course-info-active');
        });
    });
});
