# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql
-- 1. Create a new database called `cyf_classes`
createdb cyf_classes
psql cyf_classes
-- 2. Create a new table `mentors`, for each mentor we want to save their name, how many years they lived in Glasgow, their address and their favourite programming language.
CREATE TABLE mentors (
   id                SERIAL PRIMARY KEY,
   name              VARCHAR(30) NOT NULL,
   years_in_glasgow  SMALLINT NOT NULL,
   address           VARCHAR(100) NOT NULL,
   fav_language      VARCHAR(25) NOT NULL
);
-- 3. Insert 5 mentors in the `mentors` table
INSERT INTO mentors (name, years_in_glasgow, address, fav_language)
VALUES ('Thor Odinson', 6, 'City of Asgard, Asgard', 'Python');
INSERT INTO mentors (name, years_in_glasgow, address, fav_language)
VALUES ('Hulk', 5, 'Dayton, Ohio', 'Javascript');
INSERT INTO mentors (name, years_in_glasgow, address, fav_language)
VALUES ('Iron Man', 9, "Tony Stark's Brownstone,", 'Python');
INSERT INTO mentors (name, years_in_glasgow, address, fav_language)
VALUES ('Captain America', 3, 'New York City, New York', 'React');
INSERT INTO mentors (name, years_in_glasgow, address, fav_language)
VALUES ('Black Widow', 5, 'New York City, New York', 'Django');
-- 4. Create a new table `students`, for each student we want to save their name, address and if they have graduated from Code Your Future.
CREATE TABLE students (
   id                   SERIAL PRIMARY KEY,
   name                 VARCHAR(30) NOT NULL,
   address              VARCHAR(100) NOT NULL,
   graduated_from_cyf   BOOLEAN NOT NULL
);
-- 5. Insert 10 students in the `students` table.
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Barbara', '2 High Road', TRUE);
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Mehtap', 'Industria 63', TRUE );
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Burçak', 'Carrer dels Pescadors', TRUE);
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('John', 'Siguenza 117' , TRUE);
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Johni deep', 'calle de Amber', TRUE);
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Kofi', 'carrer sant migel 6', FALSE);
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Isha', 'Calle de Virgilli', TRUE );
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Paul', '4th Street', TRUE);
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Usman Ghani', 'corts Catalaness', TRUE);
INSERT INTO students (name, address, graduated_from_cyf)
VALUES ('Gloria', 'carrer nou de santa clara 15 ', FALSE);
-- 6. Verify that the data you created for mentors and students are correctly stored in their respective tables.
SELECT * FROM mentors;
SELECT * FROM students;
-- 7. Create a new `classes` table to record the following information:

--    - A class has a leading mentor
--    - A class has a topic (such as Javascript, NodeJS)
--    - A class is taught at a specific date and at a specific location
CREATE TABLE classes (
   id          SERIAL PRIMARY KEY,
   mentor_id   INT REFERENCES mentors(id),
   topic       VARCHAR(30),
   date        DATE NOT NULL,
   location    VARCHAR(30) NOT NULL
);
-- 8. Insert a few classes in the `classes` table
INSERT INTO  classes (mentor_id, topic, date, location)
VALUES (1, 'React', '2019-01-01','Centre Cívic del Besòs');
INSERT INTO  classes (mentor_id, topic, date, location)
VALUES (2, 'Javascript', '2020-01-01','Centre Cívic Urgell');
INSERT INTO  classes (mentor_id, topic, date, location)
VALUES (3, 'C#', '2022-07-01','Centre Cívic Sagrada Família');
-- 9. We now want to store who among the students attends a specific class. How would you store that? Come up with a solution and insert some data if you model this as a new table.
CREATE TABLE attendence (
id             SERIAL primary key,
student_id     INT references students(id),
class_id       INT references classes(id)
);
INSERT INTO attendence (student_id,class_id) VALUES (1,1);
INSERT INTO attendence (student_id,class_id) VALUES (2,1);
INSERT INTO attendence (student_id,class_id) VALUES (3,2);
INSERT INTO attendence (student_id,class_id) VALUES (7,3);
-- 10. Answer the following questions using a `select` SQL statement:
--     - Retrieve all the mentors who lived more than 5 years in Glasgow
--     - Retrieve all the mentors whose favourite language is Javascript
--     - Retrieve all the students who are CYF graduates
--     - Retrieve all the classes taught before June this year
--     - Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).
SELECT * FROM mentors WHERE years_in_glasgow > 5;
SELECT * FROM mentors WHERE fav_language = 'Javascript';
SELECT * FROM students WHERE graduated_from_cyf = true;
SELECT * FROM classes WHERE date < '2021-07-01';
SELECT students_id FROM attendence WHERE class_id = 2;
```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Task

1. Create a new database called `cyf_classes` (hint: use `createdb` in the terminal)
2. Create a new table `mentors`, for each mentor we want to save their name, how many years they lived in Glasgow, their address and their favourite programming language.
3. Insert 5 mentors in the `mentors` table (you can make up the data, it doesn't need to be accurate ;-)).
4. Create a new table `students`, for each student we want to save their name, address and if they have graduated from Code Your Future.
5. Insert 10 students in the `students` table.
6. Verify that the data you created for mentors and students are correctly stored in their respective tables (hint: use a `select` SQL statement).
7. Create a new `classes` table to record the following information:

   - A class has a leading mentor
   - A class has a topic (such as Javascript, NodeJS)
   - A class is taught at a specific date and at a specific location

8. Insert a few classes in the `classes` table
9. We now want to store who among the students attends a specific class. How would you store that? Come up with a solution and insert some data if you model this as a new table.
10. Answer the following questions using a `select` SQL statement:
    - Retrieve all the mentors who lived more than 5 years in Glasgow
    - Retrieve all the mentors whose favourite language is Javascript
    - Retrieve all the students who are CYF graduates
    - Retrieve all the classes taught before June this year
    - Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).
