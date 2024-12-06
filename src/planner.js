// Global state
let courseObjects = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // View management
    const plannerView = document.getElementById('plannerView');
    const profileView = document.getElementById('profileView');
    const homeButton = document.getElementById('homeButton');
    const profileButton = document.getElementById('profileButton');

    // View switching
    homeButton?.addEventListener('click', (e) => {
        e.preventDefault();
        plannerView.classList.remove('hidden');
        profileView.classList.add('hidden');
    });

    profileButton?.addEventListener('click', (e) => {
        e.preventDefault();
        plannerView.classList.add('hidden');
        profileView.classList.remove('hidden');
    });

    // Initialize main features
    initializeCourseManagement();
    initializeProfileFeatures();
    loadProfileData();
});

// Course Management System
function initializeCourseManagement() {
    // Create and store course objects
    courseObjects = createCourseData();
    
    // Initialize course container
    const courseContainer = document.getElementById('courseContainer');
    if (courseContainer) {
        courseObjects.forEach(course => {
            const courseCard = createCourseCard(course);
            courseContainer.appendChild(courseCard);
        });
    }

    // Initialize drop zone
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
    }

    // Initialize semester plan
    initializeSemesterPlan();

    // Add button event listeners
    document.getElementById('generatePlan')?.addEventListener('click', generatePlan);
    document.getElementById('copyPlan')?.addEventListener('click', copyPlan);
    document.getElementById('downloadPlan')?.addEventListener('click', downloadPlan);
    document.getElementById('clearPlan')?.addEventListener('click', clearPlan);
}

function createCourseObjects(courses, prerequisites) {
    const prereqMap = organizePrerequisites(prerequisites);
    
    return courses.map(course => ({
        crn: course.courseID.toString(),
        title: course.title,
        credits: course.credit,
        time: course.time,
        professor: course.professor,
        capacity: course.capacity,
        days: course.days,
        prerequisites: prereqMap[course.courseID] || []
    }));
}

function organizePrerequisites(prerequisites) {
    const prereqMap = {};
    prerequisites.forEach(prereq => {
        if (!prereqMap[prereq.requiredBy]) {
            prereqMap[prereq.requiredBy] = [];
        }
        prereqMap[prereq.requiredBy].push({
            courseId: prereq.prereqCourseID,
            courseName: prereq.prereqCourseName
        });
    });
    return prereqMap;
}

// Course Card Creation
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.setAttribute('data-crn', course.crn);
    card.draggable = true;

    const currentUser = createPersonObject();
    const probability = calculateProbability(currentUser, course);

    card.innerHTML = `
        <div class="course-header">
            <h3>${course.title}</h3>
            <span class="probability-badge">${probability}%</span>
        </div>
        <div class="course-info">
            <p>Time: ${course.time}</p>
            <p>Days: ${course.days}</p>
            ${course.prerequisites.length > 0 ? `
            <div class="prerequisites">
                <p>Prerequisites:</p>
                <ul>
                    ${course.prerequisites.map(prereq => 
                        `<li>${prereq.courseName}</li>`
                    ).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `;

    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
}

function createDraggableCourse(course) {
    const div = document.createElement('div');
    div.className = 'draggable-course';
    div.setAttribute('data-crn', course.crn);

    const currentUser = createPersonObject();
    const probability = calculateProbability(currentUser, course);
    
    let backgroundColor = probability > 75 ? 'rgba(144, 238, 144, 0.3)' :
                         probability >= 50 ? 'rgba(255, 255, 224, 0.3)' :
                         'rgba(255, 182, 193, 0.3)';
    
    div.style.backgroundColor = backgroundColor;
    
    div.innerHTML = `
        <div class="course-header">
            <span class="course-name">${course.title}</span>
            <span class="probability-text">${probability}%</span>
            <button class="remove-course" aria-label="Remove course">×</button>
        </div>
        
    `;

    div.querySelector('.remove-course').addEventListener('click', (e) => {
        e.stopPropagation();
        div.remove();
    });
    
    return div;
}

// Drag and Drop Handlers
function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.getAttribute('data-crn'));
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
    
    const crn = e.dataTransfer.getData('text/plain');
    const course = courseObjects.find(c => c.crn === crn);
    
    if (course) {
        const existingCourse = Array.from(this.children).find(
            child => child.getAttribute('data-crn') === crn
        );
        
        if (existingCourse) {
            alert('This course is already in your plan!');
            return;
        }
        
        const courseElement = createDraggableCourse(course);
        this.appendChild(courseElement);
    }
}

// Probability Calculation
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
    if (person.status === 'Honors' || person.status === '3/2' || person.status === 'Athlete') {
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
    return Math.min(totalProbability, 100);
}

// Semester Plan Functions
function initializeSemesterPlan() {
    const tbody = document.getElementById('semesterPlanBody');
    if (tbody) tbody.innerHTML = '';
}

function checkPrerequisites() {
    const dropZone = document.getElementById('dropZone');
    const selectedCourses = Array.from(dropZone.children);
    const currentUser = createPersonObject();
    const unmetPrereqs = [];

    // Check each course in the drop zone
    selectedCourses.forEach(courseElement => {
        const crn = courseElement.getAttribute('data-crn');
        const course = courseObjects.find(c => c.crn === crn);
        
        if (course && course.prerequisites && course.prerequisites.length > 0) {
            const missingPrereqs = course.prerequisites.filter(prereq => 
                !currentUser.completedCourses.includes(prereq.courseName)
            );

            if (missingPrereqs.length > 0) {
                unmetPrereqs.push({
                    course: course.title,
                    missing: missingPrereqs.map(p => p.courseName)
                });
            }
        }
    });

    return unmetPrereqs;
}

function checkTimeConflicts() {
    const dropZone = document.getElementById('dropZone');
    const selectedCourses = Array.from(dropZone.children).map(courseElement => {
        const crn = courseElement.getAttribute('data-crn');
        return courseObjects.find(course => course.crn === crn);
    }).filter(Boolean);

    const conflicts = [];

    // Compare each course with every other course
    for (let i = 0; i < selectedCourses.length; i++) {
        for (let j = i + 1; j < selectedCourses.length; j++) {
            const course1 = selectedCourses[i];
            const course2 = selectedCourses[j];

            // If courses have same days and same time, they conflict
            if (course1.time === course2.time && course1.days === course2.days) {
                conflicts.push({
                    course1: course1.title,
                    course2: course2.title,
                    time: course1.time,
                    days: course1.days
                });
            }
        }
    }

    return conflicts;
}


function generatePlan() {
    const dropZone = document.getElementById('dropZone');
    const selectedCourses = Array.from(dropZone.children).map(courseElement => {
        const crn = courseElement.getAttribute('data-crn');
        return courseObjects.find(course => course.crn === crn);
    }).filter(Boolean);

    if (selectedCourses.length === 0) {
        alert('Please add courses to your plan before generating.');
        return;
    }

    // Check prerequisites
    const unmetPrereqs = checkPrerequisites();
    if (unmetPrereqs.length > 0) {
        let message = 'Cannot generate plan. Missing prerequisites:\n\n';
        unmetPrereqs.forEach(item => {
            message += `${item.course} requires:\n`;
            item.missing.forEach(prereq => {
                message += `- ${prereq}\n`;
            });
            message += '\n';
        });
        alert(message);
        return;
    }

    // Check time conflicts
    const timeConflicts = checkTimeConflicts();
    if (timeConflicts.length > 0) {
        let message = 'Cannot generate plan. Time conflicts found:\n\n';
        timeConflicts.forEach(conflict => {
            message += `${conflict.course1} and ${conflict.course2} at ${conflict.time} on ${conflict.days}\n`;
        });

        alert(message);
        return;
    }
    


    updateSemesterPlan(selectedCourses);
}

function updateSemesterPlan(selectedCourses) {
    const tbody = document.getElementById('semesterPlanBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
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
    const tbody = document.getElementById('semesterPlanBody');
    if (!tbody?.children.length) {
        alert('Please generate a plan first.');
        return;
    }

    const courses = Array.from(tbody.children).map(row => {
        const cells = row.children;
        return `${cells[0].textContent}: ${cells[1].textContent} - ${cells[3].textContent}`;
    }).join('\n');

    navigator.clipboard.writeText(courses)
        .then(() => alert('Plan copied to clipboard!'))
        .catch(err => console.error('Failed to copy plan:', err));
}

function downloadPlan() {
    const tbody = document.getElementById('semesterPlanBody');
    if (!tbody?.children.length) {
        alert('Please generate a plan first.');
        return;
    }

    const courses = Array.from(tbody.children).map(row => {
        const cells = row.children;
        return `${cells[0].textContent},${cells[1].textContent},${cells[2].textContent},${cells[3].textContent},${cells[4].textContent}`;
    }).join('\n');

    const blob = new Blob([courses], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'semester_plan.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function clearPlan() {
    const tbody = document.getElementById('semesterPlanBody');
    if (tbody) tbody.innerHTML = '';
    
    const dropZone = document.getElementById('dropZone');
    if (dropZone) dropZone.innerHTML = '';
}

// Profile Management
function createPersonObject() {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    return {
        rNumber: profileData.rNumber || '',
        completedCourses: profileData.classesTaken || [],
        classYear: profileData.classYear || 'Freshman',
        specialPrograms: profileData.specialPrograms || []
    };
}

function initializeProfileFeatures() {
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

    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName: document.getElementById('lastName')?.value || '',
        rNumber: document.getElementById('rNumber')?.value || '',
        classYear: document.getElementById('classYear')?.value || '',
        currentSemester: document.getElementById('currentSemester')?.value || '',
        specialPrograms: getCheckedItems('specialProgramMenu'),
        classesTaken: getCheckedItems('classesMenu')
    };

    localStorage.setItem('profileData', JSON.stringify(formData));
    
    // Refresh course cards
    const courseContainer = document.getElementById('courseContainer');
    if (courseContainer) {
        courseContainer.innerHTML = '';
        courseObjects.forEach(course => {
            const courseCard = createCourseCard(course);
            courseContainer.appendChild(courseCard);
        });
    }

    // Refresh dropped courses
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        const droppedCourses = Array.from(dropZone.children);
        droppedCourses.forEach(courseElement => {
            const crn = courseElement.getAttribute('data-crn');
            const course = courseObjects.find(c => c.crn === crn);
            if (course) {
                const newCourseElement = createDraggableCourse(course);
                courseElement.replaceWith(newCourseElement);
            }
        });
    }

    alert('Profile updated successfully!');

    // Switch back to planner view
    const plannerView = document.getElementById('plannerView');
    const profileView = document.getElementById('profileView');
    if (plannerView && profileView) {
        plannerView.classList.remove('hidden');
        profileView.classList.add('hidden');
    }
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

function loadProfileData() {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Load basic profile fields
        const fields = ['firstName', 'lastName', 'rNumber', 'classYear', 'currentSemester'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.value = data[field] || '';
            }
        });

        // Load checkboxes for special programs
        if (data.specialPrograms) {
            const specialProgramMenu = document.getElementById('specialProgramMenu');
            if (specialProgramMenu) {
                const checkboxes = specialProgramMenu.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    const label = checkbox.nextElementSibling?.textContent.trim();
                    if (label && data.specialPrograms.includes(label)) {
                        checkbox.checked = true;
                    }
                });
            }
        }

        // Load checkboxes for completed classes
        if (data.classesTaken) {
            const classesMenu = document.getElementById('classesMenu');
            if (classesMenu) {
                const checkboxes = classesMenu.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    const label = checkbox.nextElementSibling?.textContent.trim();
                    if (label && data.classesTaken.includes(label)) {
                        checkbox.checked = true;
                    }
                });
            }
        }
    }
}

const BASE_URL = "https://305d-2603-9001-2af0-4c60-5d41-1cf-df83-2a86.ngrok-free.app";


// Fetches from Database
function createCourseData() {
    return fetch(`${BASE_URL}/courses`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch courses data');
            }
            return response.json();
        })
        .then(coursesData => {
            return fetch(`${BASE_URL}/prereqs`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch prerequisites data');
                    }
                    return response.json();
                })
                .then(prerequisitesData => {
                    if (Array.isArray(coursesData) && Array.isArray(prerequisitesData)) {
                        return createCourseObjects(coursesData, prerequisitesData);
                    }
                    throw new Error('Invalid data format');
                });
        })
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}



// Function to process course and prerequisites data (assuming this function exists)
function createCourseObjects(coursesData, prerequisitesData) {
    // You can process the data or simply return it, depending on your needs
    return {
        courses: coursesData,
        prerequisites: prerequisitesData
    };
}

