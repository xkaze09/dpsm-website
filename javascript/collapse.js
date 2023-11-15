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

// Trigger click event on "Mission" button to highlight it on page load
const missionButton = document.querySelector('[data-bs-target="#missionText"]');
// missionButton.click();