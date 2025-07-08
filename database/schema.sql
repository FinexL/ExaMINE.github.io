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

CREATE TABLE grading(
grading_id INT PRIMARY KEY AUTO_INCREMENT,
student_id INT NOT NULL,
score_id INT NOT NULL,
exam_type VARCHAR(50),
score DECIMAL (5,2) NOT NULL,
grade_status VARCHAR(20),
FOREIGN KEY (score_id) REFERENCES topic_scores(score_id),
FOREIGN KEY (student_id) REFERENCES students(student_id)
);
