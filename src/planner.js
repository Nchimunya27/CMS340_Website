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

    // Class year probability
    switch(person.classYear) {
        case 'Senior': classYearStat = 50; break;
        case 'Junior': classYearStat = 40; break;
        case 'Sophomore': classYearStat = 30; break;
        case 'Freshman': classYearStat = 20; break;
        default: classYearStat = 20;
    }

    // Special programs bonus
    if (person.specialPrograms.some(program => 
        ['Honors Student', '3/2 AMP Program', 'Student Athlete'].includes(program))) {
        statusStat = 20;
    }


    // Capacity scaling
    if (course.capacity <= 18) {
        courseCapStat = person.classYear === 'Senior' ? 10 :
                       person.classYear === 'Junior' ? 8 :
                       person.classYear === 'Sophomore' ? 6 : 4;
    } else if ((course.capacity > 18) && (course.capacity < 30)) {
        courseCapStat = person.classYear === 'Senior' ? 15 :
                       person.classYear === 'Junior' ? 12 :
                       person.classYear === 'Sophomore' ? 9 : 6;
    } else {
        courseCapStat = person.classYear === 'Senior' ? 20 :
                       person.classYear === 'Junior' ? 15 :
                       person.classYear === 'Sophomore' ? 12 : 8;
    }

    const totalProbability = classYearStat + statusStat + courseCapStat;
    return Math.max(0, Math.min(totalProbability, 100));
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

// Course Data Creation
function createCourseData() {
    const coursesData = [
        {
            capacity: 30,
            courseID: 13903,
            credit: 4,
            days: "MWF",
            professor: "D Myers",
            time: "10:00-10:50A",
            title: "Intro to Computer Science"
        },
        {
            capacity: 30,
            courseID: 13904,
            credit: 2,
            days: "W",
            professor: "D Myers",
            time: "2:00-5:00P",
            title: "Intro to Computer Sci Lab"
          },
          {
            capacity: 22,
            courseID: 13905,
            credit: 4,
            days: "TR",
            professor: "S Tisha",
            time: "11:00-12:15P",
            title: "Prog & Software Development"
          },
          {
            capacity: 22,
            courseID: 13906,
            credit: 4,
            days: "TR",
            professor: "R Elva",
            time: "11:00-12:15P",
            title: "Object-Oriented Design & Devel"
          },
          {
            capacity: 22,
            courseID: 13907,
            credit: 4,
            days: "TR",
            professor: "R Elva",
            time: "3:30-4:45P",
            title: "Computer Science Capstone"
          },
          {
            capacity: 22,
            courseID: 14451,
            credit: 4,
            days: "TR",
            professor: "S Tisha",
            time: "2:00-3:15P",
            title: "Data Structures and Algorithms"
          },
          {
            capacity: 22,
            courseID: 14869,
            credit: 4,
            days: "MW",
            professor: "V Summet",
            time: "1:00-2:15P",
            title: "Computer Org & Architecture"
          },
          {
            capacity: 15,
            courseID: 14870,
            credit: 4,
            days: "MWF",
            professor: "D Myers",
            time: "11:00-11:50A",
            title: "Simulation/Stochastic Modeling"
          },
          {
            capacity: 22,
            courseID: 14872,
            credit: 4,
            days: "MW",
            professor: "V Summet",
            time: "2:30-3:45P",
            title: "Operating Systems"
          },
          {
            capacity: 22,
            courseID: 15064,
            credit: 2,
            days: "MWF",
            professor: "D Myers",
            time: "12:00-12:50P",
            title: "Topics: Programming with AI"
          },
          {
            capacity: 22,
            courseID: 15086,
            credit: 4,
            days: "TR",
            professor: "R Elva",
            time: "2:00-3:15P",
            title: "Software Modeling"
          },
          {
            capacity: 22,
            courseID: 15132,
            credit: 4,
            days: "MWF",
            professor: "V Summet",
            time: "12:00-12:50P",
            title: "Human-Computer Interaction"
          }
    ];

    const prerequisitesData = [
        {
            prereqCourseID: 13904,
            prereqCourseName: "Intro to Computer Sci Lab",
            prereqID: 1,
            requiredBy: 13903
        },
        {
            "prereqCourseID": 13903,
            "prereqCourseName": "Intro to Computer Science",
            "prereqID": 2,
            "requiredBy": 13904
          },
          {
            "prereqCourseID": 13903,
            "prereqCourseName": "Intro to Computer Science",
            "prereqID": 3,
            "requiredBy": 13905
          },
          {
            "prereqCourseID": 13904,
            "prereqCourseName": "Intro to Computer Sci Lab",
            "prereqID": 4,
            "requiredBy": 13905
          },
          {
            "prereqCourseID": 13903,
            "prereqCourseName": "Intro to Computer Science",
            "prereqID": 5,
            "requiredBy": 15064
          },
          {
            "prereqCourseID": 13905,
            "prereqCourseName": "Prog & Software Development",
            "prereqID": 6,
            "requiredBy": 14869
          },
          {
            "prereqCourseID": 13905,
            "prereqCourseName": "Prog & Software Development",
            "prereqID": 7,
            "requiredBy": 14451
          },
          {
            "prereqCourseID": 13905,
            "prereqCourseName": "Prog & Software Development",
            "prereqID": 8,
            "requiredBy": 13906
          },
          {
            "prereqCourseID": 13905,
            "prereqCourseName": "Prog & Software Development",
            "prereqID": 9,
            "requiredBy": 15132
          },
          {
            "prereqCourseID": 13905,
            "prereqCourseName": "Prog & Software Development",
            "prereqID": 10,
            "requiredBy": 14870
          },
          {
            "prereqCourseID": 13906,
            "prereqCourseName": "Object-Oriented Design & Devel",
            "prereqID": 11,
            "requiredBy": 15086
          },
          {
            "prereqCourseID": 14869,
            "prereqCourseName": "Computer Org & Architecture",
            "prereqID": 12,
            "requiredBy": 14872
          },
          {
            "prereqCourseID": 14451,
            "prereqCourseName": "Data Structures and Algorithms",
            "prereqID": 13,
            "requiredBy": 14872
          }
    ];

    return createCourseObjects(coursesData, prerequisitesData);
}