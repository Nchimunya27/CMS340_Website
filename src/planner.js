// Course data
const courseData = {
    'CMS120': { probability: 95, name: 'Introduction to Computer Science - CMS120' },
    'CMS250': { probability: 68, name: 'Data Structures and Algorithms - CMS250' },
    'CMS327': { probability: 75, name: 'Databases - CMS327' },
    'CMS270': { probability: 82, name: 'Object Oriented Programming - CMS270' },
    'CMS230': { probability: 77, name: 'Computer Architecture and Systems - CMS230' },
    'MAT140': { probability: 88, name: 'Discrete Math - MAT140' }
};

// Sample semester plan data
const semesterPlanData = [
    { crn: '91474', title: 'Data Structures and Algorithms - CMS250', credits: 4, time: '1:00 pm - 2:00 pm', professor: 'Dr. Bank Fo' },
    { crn: '93567', title: 'Human Computer Interaction - CMS354', credits: 4, time: '2:00 pm - 3:00 pm', professor: 'Dr. Jamie Ray' },
    { crn: '95661', title: 'Software engineering - CMS340', credits: 4, time: '6:00 pm - 7:00 pm', professor: 'Dr. Latushka' },
    { crn: '97881', title: 'Databases - CMS327', credits: 4, time: '1:00 pm - 3:00 pm', professor: 'Dr. Ilya M' },
    { crn: '93241', title: 'Discrete Math - MAT140', credits: 4, time: '8:00 am - 9:00 am', professor: 'Dr. Summet' }
];

document.addEventListener('DOMContentLoaded', () => {
    // View management
    const plannerView = document.getElementById('plannerView');
    const profileView = document.getElementById('profileView');
    const homeButton = document.getElementById('homeButton');
    const profileButton = document.getElementById('profileButton');

    // View switching
    homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        plannerView.classList.remove('hidden');
        profileView.classList.add('hidden');
    });

    profileButton.addEventListener('click', (e) => {
        e.preventDefault();
        plannerView.classList.add('hidden');
        profileView.classList.remove('hidden');
    });

    // Initialize planner functionality
    initializePlannerFeatures();
    
    // Initialize profile functionality
    initializeProfileFeatures();
});

// Planner initialization and features
function initializePlannerFeatures() {
    const dropZone = document.getElementById('dropZone');
    const courseCards = document.querySelectorAll('.course-card');

    // Add drag event listeners to course cards
    courseCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    // Add drop zone event listeners
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // Initialize semester plan
    initializeSemesterPlan();

    // Add button event listeners
    document.getElementById('generatePlan').addEventListener('click', generatePlan);
    document.getElementById('copyPlan').addEventListener('click', copyPlan);
    document.getElementById('downloadPlan').addEventListener('click', downloadPlan);
}

// Drag and Drop Handlers
function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.courseId);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const courseId = e.dataTransfer.getData('text/plain');
    const course = courseData[courseId];
    
    if (course) {
        // Check if course already exists in drop zone
        const existingCourse = Array.from(this.children).find(
            child => child.querySelector('.course-name').textContent === course.name
        );
        
        if (existingCourse) {
            alert('This course is already in your plan!');
            return;
        }
        
        const courseElement = createDraggableCourse(course, courseId);
        this.appendChild(courseElement);
    }
}

function createDraggableCourse(course, courseId) {
    const div = document.createElement('div');
    div.className = 'draggable-course';
    
    let backgroundColor;
    if (course.probability > 75) {
        backgroundColor = 'rgba(144, 238, 144, 0.3)'; // Light green
    } else if (course.probability >= 50) {
        backgroundColor = 'rgba(255, 255, 224, 0.3)'; // Light yellow
    } else {
        backgroundColor = 'rgba(255, 182, 193, 0.3)'; // Light red
    }
    
    div.style.backgroundColor = backgroundColor;
    
    // Use the HTML template structure
    div.innerHTML = document.querySelector('#course-template').innerHTML;
    
    // Fill in the course data
    div.querySelector('.course-name').textContent = course.name;
    div.querySelector('.probability-text').textContent = `${course.probability}%`;

    // Add click handler for the remove button
    const removeButton = div.querySelector('.remove-course');
    removeButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        div.remove();
    });
    
    return div;
  }

// Semester Plan Functions
function initializeSemesterPlan() {
    const tbody = document.getElementById('semesterPlanBody');
    tbody.innerHTML = ''; // Clear existing content
    
    semesterPlanData.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.crn}</td>
            <td>${course.title}</td>
            <td>${course.credits}</td>
            <td>${course.time}</td>
            <td>${course.professor}</td>
        `;
        tbody.appendChild(row);
    });
}

function generatePlan() {
    // Simulate plan generation
    alert('Generating new semester plan...');
}

function copyPlan() {
    const planText = semesterPlanData
        .map(course => `${course.crn}: ${course.title} - ${course.time}`)
        .join('\n');
    
    navigator.clipboard.writeText(planText)
        .then(() => alert('Plan copied to clipboard!'))
        .catch(err => console.error('Failed to copy plan:', err));
}

function downloadPlan() {
    const planText = semesterPlanData
        .map(course => `${course.crn},${course.title},${course.credits},${course.time},${course.professor}`)
        .join('\n');
    
    const blob = new Blob([planText], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'semester_plan.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Profile Features
function initializeProfileFeatures() {
    // Handle dropdown toggles
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const menu = dropdown.nextElementSibling;
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('show');
                }
            });
            
            menu.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Handle profile form submission
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        rNumber: document.getElementById('rNumber').value,
        classYear: document.getElementById('classYear').value,
        currentSemester: document.getElementById('currentSemester').value,
        specialPrograms: getCheckedItems('specialProgramMenu'),
        classesTaken: getCheckedItems('classesMenu')
    };

    // Store the profile data (could be sent to a server in a real application)
    localStorage.setItem('profileData', JSON.stringify(formData));
    
    // Show success message
    alert('Profile updated successfully!');
    
    // Switch back to planner view
    document.getElementById('plannerView').classList.remove('hidden');
    document.getElementById('profileView').classList.add('hidden');
}

function getCheckedItems(menuId) {
    const checkedItems = [];
    const menu = document.getElementById(menuId);
    if (menu) {
        const checkboxes = menu.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedItems.push(checkbox.nextElementSibling.textContent.trim());
            }
        });
    }
    return checkedItems;
}

// Load profile data on page load
function loadProfileData() {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('firstName').value = data.firstName || '';
        document.getElementById('lastName').value = data.lastName || '';
        document.getElementById('rNumber').value = data.rNumber || '';
        document.getElementById('classYear').value = data.classYear || '';
        document.getElementById('currentSemester').value = data.currentSemester || '';
    }
}

// Call loadProfileData when the page loads
document.addEventListener('DOMContentLoaded', loadProfileData);