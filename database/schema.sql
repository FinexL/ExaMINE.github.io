CREATE TABLE students(
student_id INT PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(255) NOT NULL,
middle_name VARCHAR(100),
last_name VARCHAR(100) NOT NULL,
suffix VARCHAR (10),
university_id INT NOT NULL,
add_date DATE DEFAULT (CURRENT_DATE),
FOREIGN KEY (university_id) REFERENCES universities(university_id)
);



CREATE TABLE universities(
university_id INT PRIMARY KEY AUTO_INCREMENT,
university_name VARCHAR (255) UNIQUE,
dean_name VARCHAR (255),
dean_email VARCHAR (100) UNIQUE

);

select * from universities;
CREATE TABLE subjects(
subject_id INT PRIMARY KEY AUTO_INCREMENT,
subject_name VARCHAR (255) NOT NULL
);


CREATE TABLE topics(
topic_id INT PRIMARY KEY AUTO_INCREMENT,
topic_name VARCHAR (255) NOT NULL,
subject_id INT NOT NULL,
FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)

);

CREATE TABLE users(
user_id INT PRIMARY KEY AUTO_INCREMENT,
user_name VARCHAR (255) NOT NULL,
user_role VARCHAR (50) NOT NULL,
user_status VARCHAR (50) NOT NULL,
user_email VARCHAR(100) NOT NULL UNIQUE,
user_password VARCHAR(255) NOT NULL,
add_date DATE DEFAULT (CURRENT_DATE)
);


CREATE TABLE topic_scores(
score_id INT PRIMARY KEY AUTO_INCREMENT,
topic_id INT NOT NULL,
max_score INT NOT NULL,
score_date DATE DEFAULT (CURRENT_DATE),
FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
);
SELECT * FROM topic_scores;

CREATE TABLE grading(
grading_id INT PRIMARY KEY AUTO_INCREMENT,
student_id INT NOT NULL,
score_id INT NOT NULL,
exam_type VARCHAR(50),
score DECIMAL (5,2) NOT NULL,
grade_status VARCHAR(20),
FOREIGN KEY (score_id) REFERENCES topic_scores(score_id),
FOREIGN KEY (student_id) REFERENCES students(student_id )
);



SELECT DATE(add_date) AS add_date FROM students;

SELECT * from students;
SELECT * from universities;
SELECT * from subjects;
SELECT * from topics;  
SELECT * from users;
SELECT * from topic_scores;
SELECT s.first_name, s.last_name, u.university_name, add_date
FROM students s
JOIN universities u ON s.university_id = u.university_id;
SELECT g.grading_id, s.student_id, sc.score_id, g.exam_type, g.score, g.grade_status FROM grading g
JOIN students s ON g.student_id = s.student_id
JOIN topic_scores sc ON g.score_id = sc.score_id; 
SELECT university_id, university_name, dean_name, dean_email
FROM universities;

SELECT t.topic_name, s.subject_name
FROM topics t
JOIN subjects s ON t.subject_id = s.subject_id;

SELECT * FROM subjects;
