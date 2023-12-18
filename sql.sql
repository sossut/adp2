CREATE TABLE users
(
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(255) NOT NULL,
	password TEXT NOT NULL,
	email TEXT NOT NULL,
	role VARCHAR(255) NOT NULL DEFAULT 'user',
	PRIMARY KEY (id),
	UNIQUE (user_name(255), email(255))
);


CREATE TABLE cities
(
	id INT NOT NULL AUTO_INCREMENT,
	NAME TEXT NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (NAME(255))
);


CREATE TABLE postcodes
(
	id INT NOT NULL AUTO_INCREMENT,
	code TEXT NOT NULL,
	NAME TEXT NOT NULL,
	city_id INT NOT NULL,
	AREA TEXT DEFAULT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (city_id) REFERENCES cities(id),
	UNIQUE (CODE(255))
);

CREATE TABLE streets
(
	id INT NOT NULL AUTO_INCREMENT,
	NAME TEXT NOT NULL,
	postcode_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (postcode_id) REFERENCES postcodes(id)
);		

CREATE TABLE addresses
(
	id INT NOT NULL AUTO_INCREMENT,
	NUMBER TEXT NOT NULL,
	street_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (street_id) REFERENCES streets(id)
);

CREATE TABLE housing_companies
(
	id INT NOT NULL AUTO_INCREMENT,
	address_id INT NOT NULL,
	NAME TEXT NOT NULL,
	user_id INT NOT NULL,
	apartment_count INT NOT NULL,
	location TEXT,
	UNIQUE (NAME(255)),
	PRIMARY KEY (id),
	FOREIGN KEY (address_id) REFERENCES addresses(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE question_categories
(
	id INT NOT NULL AUTO_INCREMENT,
	category TEXT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE question_category_summaries
(
	id INT NOT NULL AUTO_INCREMENT,
	result TEXT NOT NULL,
	summary TEXT NOT NULL,
	question_category_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (question_category_id) REFERENCES question_categories(id)
);

CREATE TABLE sections
(
	id INT NOT NULL AUTO_INCREMENT,
	section_text TEXT NOT NULL,
	active VARCHAR(255) DEFAULT 'true',
	description TEXT,
	PRIMARY KEY (id)
);	

CREATE TABLE user_section_summaries
(
	id INT NOT NULL AUTO_INCREMENT,
	result TEXT NOT NULL,
	summary TEXT NOT NULL,
	section_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (section_id) REFERENCES sections(id)
);


CREATE TABLE questions
(
	id INT NOT NULL AUTO_INCREMENT,
	question_order INT,
	question TEXT NOT NULL,
	weight INT NOT NULL DEFAULT 1,
	active VARCHAR(255) DEFAULT 'true',
	section_id INT NOT NULL,
	question_category_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (section_id) REFERENCES sections(id),
	FOREIGN KEY (question_category_id) REFERENCES question_categories(id)
);


CREATE TABLE choices
(
	id INT NOT NULL AUTO_INCREMENT,
	choice_text TEXT NOT NULL,
	choice_value INT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE questions_choices
(
	id INT NOT NULL AUTO_INCREMENT,
	question_id INT,
	choice_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (question_id) REFERENCES questions(id),
	FOREIGN KEY (choice_id) REFERENCES choices(id)
);

CREATE TABLE questionnaires (
  id int NOT NULL AUTO_INCREMENT,
  date_time timestamp NOT NULL DEFAULT current_timestamp(),
  name text NOT NULL UNIQUE,
  description text DEFAULT NULL,
  questionnaire_status text NOT NULL DEFAULT 'active',
  end_date date DEFAULT NULL,
  PRIMARY KEY (id),

);

CREATE TABLE questionnaires_sections (
  id int NOT NULL AUTO_INCREMENT,
  questionnaire_id int NOT NULL,
  section_id int NOT NULL,
  PRIMARY KEY (id),
FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (id),
FOREIGN KEY (question_id) REFERENCES `questions` (id)
);

CREATE TABLE surveys
(
	id INT NOT NULL AUTO_INCREMENT,
	start_date DATE,
	end_date DATE,
	min_responses INT,
	max_responses INT,
	survey_status VARCHAR(255) DEFAULT 'open',
	survey_key TEXT NOT NULL,
	date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	user_id INT NOT NULL,
	housing_company_id INT NOT NULL,
	questionnaire_id INT NOT NULL,
	UNIQUE (survey_key(255)),
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (housing_company_id) REFERENCES housing_companies(id),
	FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
);

CREATE TABLE questions_used_in_survey
(
	id INT NOT NULL AUTO_INCREMENT,
	questions_used TEXT NOT NULL,
	survey_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (survey_id) REFERENCES surveys(id)
);

CREATE TABLE sections_used_in_survey
(
	id INT NOT NULL AUTO_INCREMENT,
	sections_used TEXT NOT NULL,
	survey_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (survey_id) REFERENCES surveys(id)
);

CREATE TABLE result_summaries
(
	id INT NOT NULL AUTO_INCREMENT,
	summary TEXT NOT NULL,
	recommendation TEXT NOT NULL,
	section_one TEXT,
	section_two TEXT,
	section_three TEXT,
	PRIMARY KEY (id)
);

CREATE TABLE results
(
	id INT NOT NULL AUTO_INCREMENT,
	filename TEXT,
	date_time TIMESTAMP NOT NULL,
	survey_id INT NOT NULL,
	result_summary_id INT,
	answer_count INT DEFAULT 0,
	PRIMARY KEY (id),
	FOREIGN KEY (survey_id) REFERENCES surveys(id),
	FOREIGN KEY (result_summary_id) REFERENCES result_summaries(id)
);


CREATE TABLE answers
(
	id INT NOT NULL AUTO_INCREMENT,
	answer INT NOT NULL,
	question_id INT NOT NULL,
	survey_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (question_id) REFERENCES questions(id),
	FOREIGN KEY (survey_id) REFERENCES surveys(id)
);

CREATE TABLE section_summaries
(
	id INT NOT NULL AUTO_INCREMENT,
	result TEXT NOT NULL,
	summary TEXT NOT NULL,
	section_id INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (section_id) REFERENCES sections(id)
);

DROP VIEW IF EXISTS questions_choices_summary;
CREATE VIEW questions_choices_summary AS
	SELECT
		JSON_OBJECT ('question_id', questions.id, 'question', questions.question, 'weight', questions.weight, 'question_order', questions.question_order, 'active', active, 'section_id', section_id, 'question_category_id', question_category_id) AS question,
		CONCAT('[', GROUP_CONCAT(JSON_OBJECT('choices_id', choices.id, 'choice_text', choices.choice_text, 'choice_value', choices.choice_value)), ']') AS choices
	FROM questions
		JOIN questions_choices
			ON questions.id = questions_choices.question_id
		JOIN choices
			ON questions_choices.choice_id = choices.id
	GROUP BY question_id
	ORDER BY question_order ASC;

DROP VIEW IF EXISTS questions_choices_summary_active;
CREATE VIEW questions_choices_summary_active AS
	SELECT
		JSON_OBJECT ('question_id', questions.id, 'question', questions.question, 'weight', questions.weight, 'question_order', questions.question_order, 'active', active, 'section_id', section_id, 'question_category_id', question_category_id) AS question,
		CONCAT('[', GROUP_CONCAT(JSON_OBJECT('choices_id', choices.id, 'choice_text', choices.choice_text, 'choice_value', choices.choice_value)), ']') AS choices
	FROM questions
		JOIN questions_choices
			ON questions.id = questions_choices.question_id
		JOIN choices
			ON questions_choices.choice_id = choices.id
	WHERE questions.active = 'true'		
	GROUP BY question_id
	ORDER BY section_id ASC, question_order ASC;