DROP DATABASE IF EXISTS SmartFox;
CREATE DATABASE SmartFox;
USE SmartFox;

-- Drop tables if they exist
DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS PreRequisite;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Student;

-- Table for Students
CREATE TABLE Student (
    rNumber VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50),
    currentYear INT,
    courseTaken TEXT
);

-- Table for Courses
CREATE TABLE Course (
    courseID INT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    professor VARCHAR(100),
    capacity INT NOT NULL,
    credit INT NOT NULL,
    time VARCHAR(20),
    days VARCHAR(10)
);

-- Table for Enrollments
CREATE TABLE Enrollment (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    rNumber VARCHAR(10),
    courseID INT,
    FOREIGN KEY (rNumber) REFERENCES Student(rNumber),
    FOREIGN KEY (courseID) REFERENCES Course(courseID)
);

-- Table for Prerequisites
CREATE TABLE PreRequisite (
    prereqID INT PRIMARY KEY AUTO_INCREMENT,
    prereqCourseID INT,
    requiredBy INT,
    prereqCourseName VARCHAR(200),
    FOREIGN KEY (prereqCourseID) REFERENCES Course(courseID),
    FOREIGN KEY (requiredBy) REFERENCES Course(courseID)
);

-- Populate the Course table
INSERT INTO Course (courseID, title, professor, capacity, credit, time, days)
VALUES
(13903, 'Intro to Computer Science', 'D Myers', 22, 4, '10:00-10:50A', 'MWF'),
(13904, 'Intro to Computer Sci Lab', 'D Myers', 22, 2, '2:00-5:00P', 'W'),
(13905, 'Prog & Software Development', 'S Tisha', 22, 4, '11:00-12:15P', 'TR'),
(15064, 'Topics: Programming with AI', 'D Myers', 22, 2, '12:00-12:50P', 'MWF'),
(14869, 'Computer Org & Architecture', 'V Summet', 22, 4, '1:00-2:15P', 'MW'),
(14451, 'Data Structures and Algorithms', 'S Tisha', 22, 4, '2:00-3:15P', 'TR'),
(13906, 'Object-Oriented Design & Devel', 'R Elva', 22, 4, '11:00-12:15P', 'TR'),
(15132, 'Human-Computer Interaction', 'V Summet', 22, 4, '12:00-12:50P', 'MWF'),
(14870, 'Simulation/Stochastic Modeling', 'D Myers', 18, 4, '11:00-11:50A', 'MWF'),
(15086, 'Software Modeling', 'R Elva', 22, 4, '2:00-3:15P', 'TR'),
(14872, 'Operating Systems', 'V Summet', 22, 4, '2:30-3:45P', 'MW'),
(13907, 'Computer Science Capstone', 'R Elva', 22, 4, '3:30-4:45P', 'TR');

-- Populate the PreRequisite table
INSERT INTO PreRequisite (prereqCourseID, requiredBy)
VALUES
    (13904, 13903),
    (13903, 13904),
    (13903, 13905),
    (13904, 13905),
    (13903, 15064),
    (13905, 14869),
    (13905, 14451),
    (13905, 13906),
    (13905, 15132),
    (13905, 14870),
    (13906, 15086),
    (14869, 14872),
    (14451, 14872);

-- Update prereqCourseName
UPDATE PreRequisite
SET prereqCourseName = (
    SELECT title
    FROM Course
    WHERE Course.courseID = PreRequisite.prereqCourseID
);

-- Create a view for dynamic course names
CREATE OR REPLACE VIEW PreRequisiteView AS
SELECT 
    p.prereqID,
    p.prereqCourseID,
    c1.title AS prereqCourseName,
    p.requiredBy,
    c2.title AS requiredByCourseName
FROM PreRequisite p
JOIN Course c1 ON p.prereqCourseID = c1.courseID
JOIN Course c2 ON p.requiredBy = c2.courseID;

-- Verify the view
SELECT * FROM PreRequisiteView;

SELECT 
    p.prereqID,
    p.prereqCourseID,
    c1.title AS prereqCourseName,
    p.requiredBy,
    c2.title AS requiredByCourseName
FROM PreRequisite p
JOIN Course c1 ON p.prereqCourseID = c1.courseID
JOIN Course c2 ON p.requiredBy = c2.courseID;

-- Verify the view
SELECT * FROM PreRequisiteView;
INSERT INTO Student (rNumber, name, email, status, currentYear, courseTaken)
VALUES
    ('R1001', 'Alice Freshman', 'alice.freshman@example.com', 'Active', 1, NULL),
    ('R1002', 'Bob Sophomore', 'bob.sophomore@example.com', 'Active', 2, NULL),
    ('R1003', 'Charlie Junior', 'charlie.junior@example.com', 'Active', 3, NULL),
    ('R1004', 'Dana Senior', 'dana.senior@example.com', 'Active', 4, NULL);
SELECT * FROM Student;
