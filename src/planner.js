// Course data
const courseData = {
    'CMS120': { name: 'Introduction to Computer Science - CMS120', classSize: 30 },
    'CMS250': { name: 'Data Structures and Algorithms - CMS250', classSize: 25 },
    'CMS327': { name: 'Databases - CMS327', classSize: 20 },
    'CMS270': { name: 'Object Oriented Programming - CMS270', classSize: 25 },
    'CMS230': { name: 'Computer Architecture and Systems - CMS230', classSize: 30 },
    'MAT140': { name: 'Discrete Math - MAT140', classSize: 35 }
};

// Sample semester plan data
const semesterPlanData = [
    { crn: '91474', title: 'Data Structures and Algorithms - CMS250', credits: 4, time: '1:00 pm - 2:00 pm', professor: 'Dr. Bank Fo' },
    { crn: '93567', title: 'Human Computer Interaction - CMS354', credits: 4, time: '2:00 pm - 3:00 pm', professor: 'Dr. Jamie Ray' },
    { crn: '95661', title: 'Software engineering - CMS340', credits: 4, time: '6:00 pm - 7:00 pm', professor: 'Dr. Latushka' },
    { crn: '97881', title: 'Databases - CMS327', credits: 4, time: '1:00 pm - 3:00 pm', professor: 'Dr. Ilya M' },
    { crn: '93241', title: 'Discrete Math - MAT140', credits: 4, time: '8:00 am - 9:00 am', professor: 'Dr. Summet' },
    { crn: '93245', title: 'Introduction to Computer Science - CMS120', credits: 4, time: '7:00 am - 7:50 am', professor: 'Dr. Myers' },
    { crn: '93248', title: 'Object Oriented Programming - CMS270', credits: 4, time: '2:00 pm - 3:15 am', professor: 'Dr. Elva' },
    { crn: '93248', title: 'Computer Architecture and Systems - CMS230', credits: 4, time: '3:30 pm - 4:45 am', professor: 'Dr. Myers' }
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
        loadProfileInfo();
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
    document.getElementById('clearPlan').addEventListener('click', clearPlan);
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
    console.log('Drop event triggered');
    this.classList.remove('drag-over');
    const courseId = e.dataTransfer.getData('text/plain');
    const course = courseData[courseId];
    if (course) {
        console.log('Course data:', course);
        const existingCourse = Array.from(this.children).find(
            child => child.querySelector('.course-name').textContent === course.name
        );
        if (existingCourse) {
            alert('This course is already in your plan!');
            return;
        }
        const userInfo = getUserInfo();
        const adjustedProbability = calculateProbability(userInfo, course);
        const courseElement = createDraggableCourse(course, courseId, adjustedProbability);
        this.appendChild(courseElement);
    } else {
        console.log('Course not found in courseData');
    }
}

function getUserInfo() {
    const classYear = document.getElementById('classYear').value;
    const specialProgram = document.getElementById('specialProgram').value;
    const rNumber = document.getElementById('rNumber').value;
    
    // Get selected classes
    const selectedClasses = Array.from(document.querySelectorAll('#classesTaken input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    return {
        year: classYear,
        status: specialProgram,
        rNumber: rNumber,
        classesTaken: selectedClasses
    };
}

function createDraggableCourse(course, courseId, adjustedProbability) {
    const div = document.createElement('div');
    div.className = 'draggable-course';
    let backgroundColor;
    if (adjustedProbability > 75) {
        backgroundColor = 'rgba(144, 238, 144, 0.3)'; // Light green
    } else if (adjustedProbability >= 50) {
        backgroundColor = 'rgba(255, 255, 224, 0.3)'; // Light yellow
    } else {
        backgroundColor = 'rgba(255, 182, 193, 0.3)'; // Light red
    }
    div.style.backgroundColor = backgroundColor;
    div.innerHTML = `
        <div class="course-content">
            <span class="course-name">${course.name}</span>
            <span class="probability-text">${adjustedProbability}%</span>
        </div>
        <button class="remove-course">&times;</button>
    `;
    const removeButton = div.querySelector('.remove-course');
    removeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        div.remove();
    });
    return div;
}

// Semester Plan Functions
function initializeSemesterPlan() {
    const tbody = document.getElementById('semesterPlanBody');
    tbody.innerHTML = ''; // Clear existing content
}

function generatePlan() {
    // Get all courses from the drop zone
    const dropZone = document.getElementById('dropZone');
    const selectedCourses = Array.from(dropZone.children).map(courseElement => {
        const courseName = courseElement.querySelector('.course-name').textContent;
        // Find the matching course in semesterPlanData
        return semesterPlanData.find(planCourse => planCourse.title === courseName);
    }).filter(course => course !== undefined); // Remove any undefined entries

    if (selectedCourses.length === 0) {
        alert('Please add courses to your plan before generating.');
        return;
    }

    // Update the semester plan table with only the selected courses
    updateSemesterPlan(selectedCourses);
}

function updateSemesterPlan(selectedCourses) {
    const tbody = document.getElementById('semesterPlanBody');
    tbody.innerHTML = ''; // Clear existing content
    selectedCourses.forEach(course => {
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

function copyPlan() {
    const planTable = document.getElementById('semesterPlanTable');
    const range = document.createRange();
    range.selectNode(planTable);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Semester plan copied to clipboard!');
}

function downloadPlan() {
    const planTable = document.getElementById('semesterPlanTable');
    const html = planTable.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'semester_plan.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function clearPlan() {
    const tbody = document.getElementById('semesterPlanBody');
    tbody.innerHTML = '';
    const dropZone = document.getElementById('dropZone');
    dropZone.innerHTML = '';
}

// Profile functionality
function initializeProfileFeatures() {
  const finishButton = document.querySelector('.finish-button');
  finishButton.addEventListener('click', (e) => {
    e.preventDefault();
    saveProfileInfo();
    alert('Profile information saved successfully!');
    document.getElementById('plannerView').classList.remove('hidden');
    document.getElementById('profileView').classList.add('hidden');
  });

  // Add event listeners for dropdowns
  const dropdowns = document.querySelectorAll('.dropdown-toggle');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', toggleDropdown);
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', closeDropdowns);

  // Update dropdown text on checkbox change
  const checkboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateDropdownText);
  });
}

function toggleDropdown(e) {
  e.stopPropagation();
  const dropdownMenu = this.nextElementSibling;
  dropdownMenu.classList.toggle('show');
}

function closeDropdowns(e) {
  if (!e.target.closest('.dropdown-container')) {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
    updateAllDropdownTexts();
  }
}

function updateDropdownText(e) {
  const dropdown = e.target.closest('.dropdown-container');
  const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
  const toggleText = dropdown.querySelector('.dropdown-toggle span');
  
  if (checkboxes.length === 0) {
    toggleText.textContent = 'Select options';
  } else if (checkboxes.length === 1) {
    toggleText.textContent = checkboxes[0].nextElementSibling.textContent;
  } else {
    toggleText.textContent = `${checkboxes.length} selected`;
  }
}

function updateAllDropdownTexts() {
  const dropdowns = document.querySelectorAll('.dropdown-container');
  dropdowns.forEach(dropdown => {
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    const toggleText = dropdown.querySelector('.dropdown-toggle span');
    
    if (checkboxes.length === 0) {
      toggleText.textContent = 'Select options';
    } else if (checkboxes.length === 1) {
      toggleText.textContent = checkboxes[0].nextElementSibling.textContent;
    } else {
      toggleText.textContent = `${checkboxes.length} selected`;
    }
  });
}


function saveProfileInfo() {
    const rNumber = document.getElementById('rNumber').value;
    const classYear = document.getElementById('classYear').value;
    const specialPrograms = Array.from(document.querySelectorAll('#specialPrograms input[type="checkbox"]:checked')).map(cb => cb.value);
    const classesTaken = Array.from(document.querySelectorAll('#classesTaken input[type="checkbox"]:checked')).map(cb => cb.value);
    const currentSemester = document.getElementById('currentSemester').value;

    const profileData = {
        rNumber,
        classYear,
        specialPrograms,
        classesTaken,
        currentSemester
    };

    localStorage.setItem('profileData', JSON.stringify(profileData));
}

function loadProfileInfo() {
    const profileData = JSON.parse(localStorage.getItem('profileData'));
    if (profileData) {
        document.getElementById('rNumber').value = profileData.rNumber || '';
        document.getElementById('classYear').value = profileData.classYear || '';
        
        profileData.specialPrograms.forEach(program => {
            const checkbox = document.querySelector(`#specialPrograms input[value="${program}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        profileData.classesTaken.forEach(course => {
            const checkbox = document.querySelector(`#classesTaken input[value="${course}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        document.getElementById('currentSemester').value = profileData.currentSemester || '';
    }
}

// Calculate Probability function
function calculateProbability(person, course) {
    let classYearStat = 0;
    let statusStat = 0;
    let courseCapStat = 0;
 
    // Calculate class year probability
    if (person.year === 'Senior') {
        classYearStat = 50;
    } else if (person.year === 'Junior') {
        classYearStat = 40;
    } else if (person.year === 'Sophomore') {
        classYearStat = 30;
    } else if (person.year === 'Freshman') {
        classYearStat = 20;
    }
 
    // Calculate status probability (Honors/3-2/Athlete)
    if (person.status === 'Honors Student' || person.status === '3/2 AMP Program' || person.status === 'Student Athlete') {
        statusStat = 20;
    }
 
    // Calculate capacity probability
    if (course.classSize < 18) {
        if (person.year === 'Senior') {
            courseCapStat = 10;
        } else if (person.year === 'Junior') {
            courseCapStat = 8;
        } else if (person.year === 'Sophomore') {
            courseCapStat = 6;
        } else if (person.year === 'Freshman') {
            courseCapStat = 4;
        }
    } else if (course.classSize < 30) {
        if (person.year === 'Senior') {
            courseCapStat = 15;
        } else if (person.year === 'Junior') {
            courseCapStat = 12;
        } else if (person.year === 'Sophomore') {
            courseCapStat = 9;
        } else if (person.year === 'Freshman') {
            courseCapStat = 6;
        }
    } else {
        if (person.year === 'Senior') {
            courseCapStat = 20;
        } else if (person.year === 'Junior') {
            courseCapStat = 15;
        } else if (person.year === 'Sophomore') {
            courseCapStat = 12;
        } else if (person.year === 'Freshman') {
            courseCapStat = 8;
        }
    }
 
    // Calculate total probability
    const totalProbability = classYearStat + statusStat + courseCapStat;
   
    // Ensure probability doesn't exceed 100%
    return Math.floor(Math.random() * 100);
}