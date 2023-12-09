DROP DATABASE IF EXISTS adp_innovation;
CREATE DATABASE adp_innovation;
USE adp_innovation;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS result_summaries;
DROP TABLE IF EXISTS questions_used_in_survey;
DROP TABLE IF EXISTS surveys;
DROP TABLE IF EXISTS questions_choices;
DROP TABLE IF EXISTS choices;
DROP TABLE IF EXISTS questions;
DROP TABLE if EXISTS section_summaries;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS housing_companies;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS streets;
DROP TABLE IF EXISTS postcodes;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id INT NOT NULL AUTO_INCREMENT,
	user_name VARCHAR(255) NOT NULL,
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
	UNIQUE (survey_key(255)),
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (housing_company_id) REFERENCES housing_companies(id)
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

INSERT INTO users (user_name, PASSWORD, email, role) VALUES ('testi', '$2a$12$8NJd0J.pPsvw8CEMjrQe1uOGJdbxtJgvyn9939oGQfeIufUdvTdsy', 'test@test.com', 'admin');
INSERT INTO users (user_name, PASSWORD, email) VALUES ('testi2', '$2a$12$8NJd0J.pPsvw8CEMjrQe1uOGJdbxtJgvyn9939oGQfeIufUdvTdsy', 'test2@test.com');

INSERT INTO cities (NAME) VALUES ('Helsinki');
INSERT INTO cities (NAME) VALUES ('Espoo');
INSERT INTO cities (NAME) VALUES ('Vantaa');
INSERT INTO cities (NAME) VALUES ('Kauniainen');

INSERT INTO question_categories (category) VALUES ('Lämpötilan hallinta');

INSERT INTO question_categories (category) VALUES ('Valaistuksen hallinta');

INSERT INTO question_categories (category) VALUES ('Ilmanlaadun hallinta');

INSERT INTO question_categories (category) VALUES ('Korjaukset');

INSERT INTO question_categories (category) VALUES ('Kiinteistön ylläpito');

INSERT INTO question_categories (category) VALUES ('Energiatehokkuuden parantaminen');

INSERT INTO question_categories (category) VALUES ('Osallistuminen ja vaikuttaminen');

INSERT INTO question_categories (category) VALUES ('Kiinteistön ylläpito ja energiatehokkuus');

INSERT INTO question_categories (category) VALUES ('Taloudelliset kriteerit ja yhtiökokous');

INSERT INTO question_categories (category) VALUES ('Yhteisöllisyys ja tiedonjakaminen');

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Olet huolehtinut kotisi energiatehokkuudesta ja mukavuudesta erinomaisesti.', 1);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'Olet osoittanut erinomaista huolenpitoa kotisi energiatehokkuudesta ja mukavuudesta, mutta vielä olisi tilaa parantaa.', 1);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Kotisi energiatehokkuudessa olisi kehittämisen varaa.', 1);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Osoitat hyvää huolellisuutta energian ja resurssien säästämisessä.', 2);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'Osoitat huolellisuutta energian ja resurssien säästämisessä, mutta vielä olisi parantamisen varaa.', 2);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Voisit olla huolellisempi energian ja resurssien säästämisessä.', 2); 

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Huolehdit ilmanlaadusta ja asumismukavuudesta erinomaisesti.', 3);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'Huolehdit ilmanlaadustasi jonkin verran, mutta vielä olisi parannettavaa.', 3);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Voisit harkita kotisi ilmanlaadun parantamista.', 3);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Huolehdit erinomaisesti omien vastuidesi mukaisista korjauksista.', 4);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'Osoitat huolellisuutta asuntosi kunnosta, mutta vielä olisi parantamisen varaa.', 4);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Voisit huolehtia omien vastuidesi mukaisista korjauksista paremmin.', 4);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Olet erittäin tarkkaavainen kiinteistön ja kotisi ylläpidon suhteen.', 5);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'Osoitat huolellisuutta kiinteistösi ylläpidoossa, mutta vielä olisi parantamisen varaa.', 5);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Voisit olla tarkkaavaisempi kiinteistön ja kotisi ylläpidon suhteen.', 5);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Loistavaa, osoitat vahvaa kiinnostusta taloyhtiön kestävään kehitykseen ja energiatehokkuuteen.', 6);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'Osoitat kiinnostusta taloyhtiön kestävään kehitykseen ja energiatehokkuuteen, mikä on erinomaista. Loistavaa, että olet motivoitunut tukemaan näitä tavoitteita. Voisit kuitenkin harkita osallistumista enemmän keskusteluihin ja ehdottaa konkreettisia toimenpiteitä energiatehokkuuden parantamiseksi. Näin voit entisestään edistää taloyhtiön kestävää kehitystä ja tuoda omat arvokkaat ideasi esille.', 6);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Voisit harkita osallistumista enemmän keskusteluihin ja ehdottaa konkreettisia toimenpiteitä energiatehokkuuden parantamiseksi.', 6);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Olet erittäin sitoutunut taloyhtiön yhteisiin asioihin ja viestintään. Jatka samaan malliin!', 7);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'Osoitat vahvaa sitoutumista taloyhtiön yhteisiin asioihin ja viestintään, mikä on erinomaista. On hienoa nähdä, että olet aktiivinen ja omistautunut taloyhteisösi hyvinvoinnille. Jatka samaan malliin! Samalla voit harkita laajempaa osallistumista ja tuoda enemmän ideoitasi esiin keskusteluissa. Tällä tavoin voit vielä vahvemmin vaikuttaa taloyhteisön päätöksiin ja kehittämiseen.', 7);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Harkitse laajempaa osaliistumista ja tuo enemmän ideoitasi keskusteluihin.', 7);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Osoitat vahvaa huolta taloyhtiön pitkän aikavälin kehityksestä ja ylläpidosta', 8);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('evem', 'Osoitat vahvaa huolta taloyhtiön pitkän aikavälin kehityksestä ja ylläpidosta.  Kuitenkin voisit harkita aktiivisempaa roolia suunnittelussa ja päätöksenteossa.', 8);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Harkitse aktiivisempaa roolia suunnittelussa ja päätöksenteossa. Osallistuminen keskusteluihin ja ehdotusten tekeminen voisi auttaa sinua vaikuttamaan enemmän taloyhtiön päätöksiin.', 8);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Näytät vahvaa taloudellista huolenpitoa ja halua pitää asumiskustannukset kurissa. Se on erinomainen piirre, ja olet selvästi tietoinen taloyhtiön taloudellisista näkökohdista', 9);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'On hienoa nähdä, että osoitat vahvaa taloudellista huolenpitoa ja pyrkimystä pitää asumiskustannukset kurissa. Samalla voit harkita osallistumista aktiivisemmin yhtiökokouksiin ja päätöksentekoon.', 9);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', 'Osallistuminen aktiivisemmin yhtiökokouksiin ja päätöksentekoon voisi antaa sinulle paremman käsityksen taloyhtiön tilanteesta ja auttaa sinua ymmärtämään paremmin, miksi tiettyjä päätöksiä tehdään.', 9);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('positive', 'Osoitat tietoisuutta taloyhtiön viestinnän merkityksestä ja ymmärrät hallinnollisen viestinnän tarpeen', 10);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('even', 'On hienoa nähdä, että osoitat tietoisuutta taloyhtiön viestinnän merkityksestä ja ymmärrät hallinnollisen viestinnän tarpeen. Voit kuitenkin harkita rohkeampaa osallistumista keskusteluihin ja tuoda esiin omia näkemyksiäsi. ', 10);

INSERT INTO question_category_summaries (result, summary, question_category_id) VALUES ('negative', ' Osallistu rohkeammin keskusteluihin ja tuo esiin omia näkemyksiäsi.', 10);

INSERT INTO sections (section_text, description) VALUES ('Omat asumistottumukset', 'Moni ei tule ajatelleeksi, että omat asumistottumukset vaikuttavat osaltaan vastikkeen suuruuteen. Oman huoneiston kunto vaikuttaa myös kiinteistön kuntoon.');
INSERT INTO sections (section_text, description) VALUES ('Taloyhtion yhteisten asioiden hoitaminen', 'Taloyhtiön energiankulutus ja päätökset vaikuttavat siihen, miten esimerkiksi vastike muodostuu. Taloyhtiön hallitus tarvitsee asukkaiden tuen päätöksentekoon ja taloyhtiön johtamiseen.');
INSERT INTO sections (section_text, description) VALUES ('Asenteeni taloyhtiön elinkaaresta ja kiintestön kunnossapidosta', 'Vastaa, mitä mieltä olet seuraavista väittämistä.');

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('positive', 'On ilahduttavaa nähdä, että olet suunnitelmallinen omien asumistottumustesi suhteen. Tämä osoittaa tietoista päätöksentekoa ja huolellisuutta kodin ylläpidossa.', 1);

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('even', 'Vaikuttaa siltä, että asumistottumuksesi ovat tasapainoiset, ja kiinnität jonkin verran humiota energiatehookkuuteen. Tarkkaavaisuutesi kodin ylläpitoon ja resurssien säästämiseen on hyvä, mutta vielä oon tilaa parantaa.', 1);

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('negative', 'Vaikuttaa siltä, että asumistottumuksissasi on jonkin verran passiivisuutta. Pienillä muutoksilla, kuten valojen sammuttamisella ja energiatehokkuuden lisäämisellä, voit vaikuttaa positiivisesti ympäristöön ja asumiskokemukseesi.', 1);

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('positive', 'Kiitos aktiivisuudestasi taloyhtiön yhteisten asioiden hoidossa! Osoitat suunnitelmallisuutta osallistumalla keskusteluihin energiatehokkuudesta ja kiinnostumalla yhtiön kustannusrakenteesta.', 2);

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('even', 'Tasapainoinen suhtautumisesi taloyhtiön yhteisiin asioihin oon arvostetu. Osallistut keskusteluihin energiatehokkuudesta ja yhtiön kulurakenteesta, mikä on positiivista. ', 2);

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('negative', 'Vaikuttaa siltä, että osallistumisesi taloyhtiön yhteisiin asioihin on ollut melko passiivista. Rohkaisen sinua harkitsemaan aktiivisempaa osallistumista yhtiökokouksiin ja päätöksentekoon, sillä voit tuoda arvokasta panosta taloyhtiön päätöksiin ja parantaa yhteisön toimintaa.', 2);

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('positive', 'Hienoa, että suhtaudut suunnitelmallisesti taloyhtiön elinkaareen ja kiinteistön kunnossapitoon. Pitkäjänteinen näkemyksesi on ihailtavaa, ja se tukee taloyhtiön kestävää kehitystä.', 3);

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('even', 'Hyvä, että suhtaudut tasapainoisesti taloyhtiön elinkaareen ja kiinteistön kunnossapitoon.  Jatka samalla linjalla ja harkitse mahdollisia osallistumismahdollisuuksia päätöksentekoon, mikä voisi lisätä vaikutusvaltaasi taloyhtiön kehityksessä.', 3);

INSERT INTO user_section_summaries (result, summary, section_id) VALUES ('negative', 'Ymmärrettävästi, kaikki eivät ole yhtä kiinnostuneita taloyhtiön elinkaaresta ja kunnossapidosta. Olisi kuitenkin hyödyllistä harkita aktiivisempaa osallistumista, jolla voit vaikuttaa positiivisesti taloyhtiön pitkän aikavälin kehitykseen. Pienikin osallistuminen voi olla merkittävä panos yhteisön hyvinvoinnille.', 3);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'positive',
'Taloyhtiön asukkaiden keskimääräinen arvio omista asumustottumuksistaan viittaa suunnitelmalliseen lähestymistapaan. Asukkaat ovat osoittaneet erinomaista sitoutumista energiatehokkuuteen ja ympäristöystävällisiin käytäntöihin omassa asumisessaan. Suunnitelmallinen lähestymistapa näkyy erityisesti lämpötilan hallinnassa, valojen sammuttamisessa, ja vedenkulutuksen tehokkaassa hallinnassa. Asukkaat ovat panostaneet myös aktiivisesti omien tilojensa ylläpitoon ja kunnossapitoon, mikä vaikuttaa myönteisesti taloyhtiön energiatehokkuuteen ja kiinteistön arvon säilymiseen pitkällä aikavälillä. Tämä antaa vahvan perustan kestävälle asumiselle ja taloyhtiön hyvinvoinnille.',
1);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'even',
'Taloyhtiön asukkaiden keskimääräinen arvio omista asumustottumuksistaan viittaa tasapainoilevaan lähestymistapaan. Asukkaat ovat osoittaneet monipuolista sitoutumista energiatehokkuuteen ja ympäristöystävällisiin käytäntöihin omassa asumisessaan. Tasapainoilevat asumistottumukset näkyvät lämpötilan hallinnassa, valojen sammuttamisessa ja vedenkulutuksen hallinnassa. Asukkaat osallistuvat kohtuullisesti omien tilojensa ylläpitoon ja kunnossapitoon, vaikka voisi olla mahdollisuuksia parantaa kestävää asumista. Tasapainoileva lähestymistapa tarjoaa perustan taloyhtiön energiatehokkuudelle ja kiinteistön ylläpidolle, ja se voi hyötyä lisäponnisteluista kohti entistä kestävämpää asumista ja kiinteistön arvon säilyttämistä.',
1);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'negative',
'Taloyhtiön asukkaiden keskimääräinen arvio omista asumustottumuksistaan viittaa passiiviseen lähestymistapaan. Asukkaiden sitoutuminen energiatehokkuuteen ja ympäristöystävällisiin käytäntöihin omassa asumisessaan on alhainen. Passiivisen lähestymistavan seurauksena lämpötilan hallinta, valojen sammuttaminen ja vedenkulutuksen hallinta voivat kaivata parannusta. Asukkaat eivät välttämättä osallistu aktiivisesti omien tilojensa ylläpitoon ja kunnossapitoon, mikä voi vaikuttaa negatiivisesti taloyhtiön energiatehokkuuteen ja kiinteistön arvon säilymiseen pitkällä aikavälillä. On suositeltavaa harkita tiedotuskampanjoita ja ohjausta, jotta asukkaat voivat lisätä tietoisuuttaan ja aktiivisuuttaan kestävässä asumisessa.',
1);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'positive',
'Taloyhtiön asukkaiden keskimääräinen arvio yhteisten asioiden hoitamisesta viittaa suunnitelmalliseen lähestymistapaan. Asukkaat ovat osoittaneet vahvaa sitoutumista osallistua taloyhtiön päätöksentekoon ja yhteisten asioiden hoitamiseen. Suunnitelmallinen lähestymistapa näkyy erityisesti osallistumisessa yhtiökokouksiin, aktiivisessa roolissa hankinnoissa, korjauksissa ja remontin suunnittelussa, sekä palautteen antamisessa hallitukselle. Asukkaat ovat myös aktiivisia taloyhtiön viestinnässä ja yhteisissä toimintakanavissa. Tämä vahvistaa taloyhtiön hyvää hallintotapaa ja tukee sen kestävää kehitystä.',
2);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'even',
'Taloyhtiön asukkaiden keskimääräinen arvio yhteisten asioiden hoidosta viittaa tasapainoilevaan lähestymistapaan. Asukkaat osallistuvat kohtuullisesti taloyhtiön päätöksentekoon ja yhteisten asioiden hoitamiseen. Tasapainoileva lähestymistapa näkyy osallistumisessa yhtiökokouksiin ja kohtuullisessa aktiivisuudessa hankinnoissa, korjauksissa ja remontin suunnittelussa. Asukkaat voivat parantaa aktiivisuuttaan ja sitoutumistaan yhteisten asioiden hoitamiseen. Lisäpanostukset viestintään ja yhteisiin toimintakanaviin voivat edistää taloyhtiön hyvinvointia ja yhteisöllisyyttä.',
2);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'negative',
'Taloyhtiön asukkaiden keskimääräinen arvio yhteisten asioiden hoidosta viittaa passiiviseen lähestymistapaan. Asukkaat eivät osoita vahvaa sitoutumista osallistua taloyhtiön päätöksentekoon ja yhteisten asioiden hoitamiseen. Passiivisen lähestymistavan seurauksena osallistuminen yhtiökokouksiin ja aktiivisuus hankinnoissa, korjauksissa ja remontin suunnittelussa voi jäädä vähäiseksi. On suositeltavaa harkita toimenpiteitä, kuten tiedotuskampanjoita ja osallistumisen kannustamista, jotta asukkaat voivat lisätä osallisuuttaan taloyhtiön toimintaan ja yhteisten asioiden hoitamiseen.',
2);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'positive',
'Taloyhtiön asukkaiden keskimääräinen arvio asenteesta taloyhtiön elinkaareen ja kiinteistön kunnossapitoon viittaa suunnitelmalliseen lähestymistapaan. Asukkaat osoittavat vahvaa sitoutumista ja tietoista strategiaa kiinteistön ylläpidon ja kehittämisen suhteen. Suunnitelmallinen asenne näkyy erityisesti halussa seurata taloyhtiön energiatehokkuutta, osallistua yhtiökokouksiin ja olla aktiivisia päätöksenteossa. Asukkaat näkevät kiinteistön kunnossapidon pitkän aikavälin suunnitelman merkityksen, mikä tukee kiinteistön arvon säilymistä ja kehittymistä. Suositellaan jatkamaan tätä suuntausta ja mahdollisesti vahvistamaan tiedotusta ja osallistumista edelleen.',
3);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'even',
'Taloyhtiön asukkaiden keskimääräinen arvio asenteesta taloyhtiön elinkaareen ja kiinteistön kunnossapitoon viittaa tasapainoilevaan lähestymistapaan. Asukkaat osallistuvat kohtuullisesti ja tasapainoisesti taloyhtiön päätöksentekoon ja kiinteistön ylläpitoon. Tasapainoileva asenne näkyy osallistumisessa yhtiökokouksiin ja kohtuullisessa kiinnostuksessa taloyhtiön energiatehokkuuteen. Asukkaat voivat parantaa sitoutumistaan ja tiedonkulkuaan kiinteistön pitkän aikavälin suunnitelmaan osallistumalla aktiivisemmin ja seuraamalla taloyhtiön kehitystä tarkemmin. Suositellaan kannustamaan aktiivisempaa osallistumista ja tiedonjakoa.',
3);

INSERT INTO section_summaries (result, summary, section_id) VALUES (
'negative',
'Taloyhtiön asukkaiden keskimääräinen arvio asenteesta taloyhtiön elinkaareen ja kiinteistön kunnossapitoon viittaa passiiviseen lähestymistapaan. Asukkaat eivät osoita vahvaa kiinnostusta tai sitoutumista osallistua taloyhtiön päätöksentekoon ja kiinteistön ylläpitoon. Passiivisen asenteen seurauksena osallistuminen yhtiökokouksiin ja energiatehokkuuteen liittyvät toimet voivat jäädä vähäisiksi. Suositellaan harkitsemaan keinoja aktivoimiseen, kuten tiedotuskampanjoita ja tapahtumia, jotta asukkaat voivat lisätä tietoisuuttaan ja kiinnostustaan taloyhtiön elinkaareen ja kunnossapitoon.',
3);

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Ei tarpeeksi vastauksia',
'Ei tarpeeksi vastauksia',
'empty', 'empty', 'empty');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat osoittavat suunnitelmallista asennetta kaikilla arvioitavilla aihealueilla. He tekevät tietoisia päätöksiä omista asumustottumuksistaan, osallistuvat aktiivisesti taloyhtiön yhteisten asioiden hoitoon ja osoittavat vahvaa kiinnostusta taloyhtiön elinkaareen ja kiinteistön kunnossapitoon.',
'Vaikka asukkaiden asenne on pääosin suunnitelmallinen, suositellaan jatkuvaa tiedotusta ja vuorovaikutusta ylläpitoon liittyvissä päätöksissä. Tämä voi vahvistaa asukkaiden ymmärrystä ja sitoutumista entisestään. Lisäksi kannustetaan järjestämään tapahtumia ja koulutuksia, jotka ylläpitävät asukkaiden osallistumista yhteisten asioiden hoitoon ja kiinteistön kestävään kehitykseen.',
'positive', 'positive', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat suunnitelmallisia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa. He tekevät tietoisia päätöksiä ja suunnitelmia asumisen ja yhteisten asioiden suhteen. Kuitenkin heidän asenteensa taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on tasapainoileva. He eivät ole äärimmäisen suunnitelmallisia, mutta pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä.',
'Suositellaan jatkuvaa tiedotusta taloyhtiön elinkaaresta ja kunnossapidosta, erityisesti keskittyen tasapainoisen asenteen vahvistamiseen. Tämä voisi tapahtua esimerkiksi tiedotustilaisuuksilla, joissa korostetaan tasapainoisen lähestymistavan merkitystä kiinteistön ylläpidossa. Asukkaille voisi tarjota myös mahdollisuuksia ilmaista mielipiteensä ja kysyä kysymyksiä, jotta he tuntevat osallisuutta ja ymmärtävät paremmin taloyhtiön tarpeita.',
'positive', 'positive', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat suunnitelmallisia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa. He tekevät tietoisia päätöksiä ja suunnitelmia asumisensa ja yhteisten asioiden suhteen. Kuitenkin heidän asenteensa taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on passiivinen. He eivät osoita vahvaa kiinnostusta osallistua päätöksentekoon tai ylläpitotoimiin.',
'Suositellaan lisää aktiivisuutta ja osallistumista kiinteistön ylläpitoon liittyvissä päätöksissä. Tämä voisi toteutua tiedotuskampanjoilla, joissa korostetaan asukkaiden roolia kiinteistön kunnossapitopäätöksissä. Lisäksi voitaisiin järjestää tapahtumia ja tiedotustilaisuuksia, joissa asukkaat saavat mahdollisuuden ilmaista mielipiteensä ja saada lisätietoa taloyhtiön ylläpidosta. Tavoitteena on lisätä yhteisöllisyyttä ja ymmärrystä kiinteistön kunnossapidon tärkeydestä.',
'positive', 'positive', 'negative');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat suunnitelmallisia omien asumustottumustensa suhteen, pyrkien tekemään tietoisia päätöksiä asumisen suunnittelussa. Taloyhtiön yhteisten asioiden hoidossa heillä on tasapainoileva asenne, eivätkä he ole äärimmäisen suunnitelmallisia mutta pyrkivät ylläpitämään tasapainoa. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on suunnitelmallinen, he pyrkivät huolehtimaan kiinteistöstä pitkäjänteisesti.',
'Kannustetaan asukkaita lisäämään aktiivisuutta taloyhtiön yhteisten asioiden hoidossa. Tämä voisi toteutua esimerkiksi osallistumalla aktiivisemmin yhtiökokouksiin ja osallistumalla päätöksentekoon taloyhtiön asioissa. Suositellaan myös tiedotuskampanjoita, joissa korostetaan taloyhtiön elinkaaren merkitystä ja kehotetaan asukkaita osallistumaan kiinteistön pitkäjänteiseen ylläpitoon.',
'positive', 'even', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on suunnitelmallinen lähestymistapa omiin asumustottumuksiinsa. He tekevät tietoisia päätöksiä ja suunnitelmia omasta asumisestaan. Taloyhtiön yhteisten asioiden hoidossa he ovat tasapainoilevia, eivät äärimmäisen suunnitelmallisia, mutta pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on tasapainoileva. He eivät ole äärimmäisen suunnitelmallisia mutta pyrkivät säilyttämään tasapainon ylläpitoon liittyvissä päätöksissä.',
'Kannustetaan asukkaita aktiivisempaan osallistumiseen taloyhtiön yhteisten asioiden hoidossa. Tiedotuskampanjat voivat toimia hyvin, jotta asukkaat ymmärtävät paremmin taloyhtiön elinkaaren ja ylläpidon merkityksen. Lisäksi suositellaan tapahtumia, joissa asukkaat voivat ilmaista mielipiteensä ja saada lisätietoa taloyhtiön asioista. Tavoitteena on lisätä ymmärrystä ja aktiivista osallistumista taloyhtiön päätöksentekoon ja ylläpitoon liittyvissä asioissa.',
'positive', 'even', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on suunnitelmallinen lähestymistapa omiin asumustottumuksiinsa. He tekevät tietoisia päätöksiä ja suunnitelmia omasta asumisestaan. Taloyhtiön yhteisten asioiden hoidossa he ovat tasapainoilevia, eivät äärimmäisen suunnitelmallisia, mutta pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on passiivinen. He eivät osoita vahvaa kiinnostusta osallistua päätöksentekoon tai ylläpitotoimiin.',
'Kannustetaan asukkaita aktiivisempaan osallistumiseen taloyhtiön yhteisten asioiden hoidossa. Tiedotuskampanjat voivat toimia hyvin, jotta asukkaat ymmärtävät paremmin taloyhtiön elinkaaren ja ylläpidon merkityksen. Lisäksi suositellaan tapahtumia, joissa asukkaat voivat ilmaista mielipiteensä ja saada lisätietoa taloyhtiön asioista. Tavoitteena on lisätä ymmärrystä ja aktiivista osallistumista taloyhtiön päätöksentekoon ja ylläpitoon liittyvissä asioissa.',
'positive', 'even', 'negative');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on suunnitelmallinen lähestymistapa omiin asumustottumuksiinsa, tekevät tietoisia päätöksiä ja suunnitelmia asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa he ovat passiivisia, eivät osoita suurta kiinnostusta tai sitoutumista osallistua päätöksentekoon. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on suunnitelmallinen. He pyrkivät huolehtimaan kiinteistöstä ja kehittämään sitä aktiivisesti.',
'Kannustetaan asukkaita lisäämään aktiivisuuttaan taloyhtiön yhteisten asioiden hoidossa. Tiedotuskampanjat voivat auttaa heitä ymmärtämään paremmin taloyhtiön elinkaaren ja ylläpidon tärkeyttä. Lisäksi suositellaan tapahtumia ja tilaisuuksia, joissa asukkaat voivat ilmaista mielipiteensä ja saada lisätietoa taloyhtiön asioista. Tavoitteena on herättää kiinnostusta ja osallistumista taloyhtiön päätöksentekoon ja ylläpitoon liittyvissä kysymyksissä.',
'positive', 'negative', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on suunnitelmallinen lähestymistapa omiin asumustottumuksiinsa. He tekevät tietoisia päätöksiä ja suunnitelmia asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa he ovat passiivisia eivätkä näytä osoittavan suurta kiinnostusta osallistua päätöksentekoon. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on tasapainoileva. He pyrkivät säilyttämään tasapainon kiinteistön ylläpitopäätöksissä.',
'Kannustetaan asukkaita lisäämään osallistumistaan taloyhtiön yhteisten asioiden hoitoon. Tiedotuskampanjat voivat auttaa heitä ymmärtämään tasapainoisen lähestymistavan merkitystä kiinteistön ylläpidossa. Suositellaan myös tilaisuuksia ja tapahtumia, joissa asukkaat voivat ilmaista mielipiteensä ja saada lisätietoa taloyhtiön asioista. Tavoitteena on herättää kiinnostusta ja tasapainoista osallistumista taloyhtiön päätöksenteossa ja ylläpidossa.',
'positive', 'negative', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on suunnitelmallinen lähestymistapa omiin asumustottumuksiinsa. He tekevät tietoisia päätöksiä ja suunnitelmia asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa he ovat passiivisia ja eivät näytä osoittavan suurta kiinnostusta osallistua päätöksentekoon. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on myös passiivinen, ilman vahvaa sitoutumista ylläpitotoimiin.',
'Kehotetaan aktiivisempaan osallistumiseen taloyhtiön yhteisten asioiden hoidossa. Tiedotuskampanjat voivat olla tehokkaita herättämään kiinnostusta ja osallistumista päätöksentekoon. Lisäksi suositellaan tilaisuuksien järjestämistä, jotta asukkaat voivat ilmaista näkemyksiään ja saada lisätietoa taloyhtiön asioista. Tavoitteena on luoda aktiivisempi ja osallistavampi ilmapiiri taloyhtiön päätöksenteossa ja ylläpidossa.',
'positive', 'negative', 'negative');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa. He eivät ole äärimmäisen suunnitelmallisia omassa asumisessaan mutta pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on suunnitelmallinen, osoittaen kiinnostusta ja sitoutumista ylläpitotoimiin.',
'Tässä tilanteessa voidaan suositella jatkuvaa tasapainon ylläpitämistä omien asumustottumusten ja taloyhtiön yhteisten asioiden hoidossa. Tiedotuskampanjat voivat auttaa lisäämään tietoisuutta tasapainosta ja kannustaa asukkaita osallistumaan aktiivisesti päätöksentekoon. Lisäksi suositellaan järjestämään tilaisuuksia, joissa asukkaat voivat ilmaista näkemyksiään ja saada lisätietoa taloyhtiön ylläpidosta. Tavoitteena on ylläpitää tasapainoinen ja osallistava ilmapiiri taloyhtiön päätöksenteossa ja ylläpidossa.',
'even', 'even', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia omien asumustottumustensa, taloyhtiön yhteisten asioiden hoidon ja asenteensa suhteen taloyhtiön elinkaareen ja kiinteistön kunnossapitoon. He eivät ole äärimmäisen suunnitelmallisia, mutta pyrkivät ylläpitämään tasapainoa eri osa-alueiden välillä.',
'Suositellaan avointa keskustelua ja vuorovaikutusta asukkaiden kanssa näiden tasapainoilun aiheiden ympärillä. Järjestetään vuorovaikutteisia tilaisuuksia ja työpajoja, joissa asukkaat voivat ilmaista mielipiteensä ja saada lisätietoa taloyhtiön ylläpidosta. Tavoitteena on vahvistaa asukkaiden osallistumista ja ymmärrystä näistä näkökulmista.',
'even', 'even', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa. He eivät ole äärimmäisen suunnitelmallisia omassa asumisessaan ja pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on passiivinen, osoittaen vähäistä kiinnostusta ja sitoutumista ylläpitotoimiin.',
'Tässä tilanteessa suositellaan aktiivisuuden lisäämistä erityisesti taloyhtiön ylläpitoon liittyvissä päätöksissä. Tiedotuskampanjat voisivat toimia keinona herättää kiinnostusta ja motivoida asukkaita osallistumaan päätöksentekoon. Lisäksi voitaisiin harkita matalan kynnyksen tapahtumia, joissa asukkaat voivat saada lisätietoa ja ilmaista näkemyksiään kiinteistön kunnossapidosta. Tavoitteena on aktivoida asukkaita ja edistää ymmärrystä taloyhtiön ylläpidon tärkeydestä.',
'even', 'even', 'negative');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa. He ovat passiivisia yhteisten asioiden käsittelyssä, sekä taspainoisia omassa asumisessaan. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on suunnitelmallinen, osoittaen kiinnostusta ja valmiutta osallistua ylläpitotoimiin.',
'Tässä tilanteessa suositellaan lisää aktiivisuutta omien asumustottumusten suunnitelmallisuuden lisäämiseksi, sekä erityisesti yhteisiin asioihin osalistumisen lisäämiseksi. Voitaisiin järjestää tiedotuskampanjoita ja tapahtumia, joissa korostetaan suunnitelmallisuuden merkitystä omassa asumisessa sekä yhteisten asioiden hoitamisen merkityksestä. Lisäksi voitaisiin kannustaa asukkaita jakamaan kokemuksiaan ja parhaita käytäntöjään toisilleen. Taloyhtiön ylläpitoon liittyen suositellaan jatkamaan suunnitelmallista lähestymistapaa ja rohkaista aktiivista osallistumista päätöksentekoon. Tavoitteena on tukea asukkaita omien asumustottumustensa suunnitelmallisessa kehittämisessä ja samalla vahvistaa suunnitelmallista asennetta taloyhtiön ylläpitoon.',
'even', 'negative', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa. He pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä, mutta eivät ole äärimmäisen suunnitelmallisia omassa asumisessaan. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on tasapainoileva, viitaten siihen, että he eivät osoita voimakasta kiinnostusta tai sitoutumista, mutta eivät myöskään ole täysin passiivisia.',
'Tässä tilanteessa suositellaan lisää selkeää suunnitelmallisuutta erityisesti omien asumustottumusten kehittämiseen. Järjestämällä tiedotuskampanjoita ja tapahtumia voidaan rohkaista asukkaita tekemään tietoisia päätöksiä asumisen suhteen. Samalla olisi hyödyllistä tuoda esille tasapainoilevan asenteen merkitystä taloyhtiön ylläpidossa. Suositellaan tiedotustilaisuuksien järjestämistä, joissa keskitytään taloyhtiön elinkaareen ja kiinteistön kunnossapitoon liittyviin kysymyksiin. Tavoitteena on tukea asukkaita tasapainoilevasta asenteesta kohti selkeää suunnitelmallisuutta kaikilla arvosana-alueilla.',
'even', 'negative', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa. He pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä, mutta eivät ole äärimmäisen suunnitelmallisia omassa asumisessaan. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on passiivinen, viitaten siihen, että he eivät osoita voimakasta kiinnostusta osallistua päätöksentekoon tai ylläpitotoimiin.',
'Tässä tilanteessa suositellaan lisää selkeää suunnitelmallisuutta erityisesti omien asumustottumusten kehittämiseen. Järjestämällä tiedotuskampanjoita ja tapahtumia voidaan rohkaista asukkaita tekemään tietoisia päätöksiä asumisen suhteen. Samalla olisi hyödyllistä tuoda esille tasapainoilevan ja passiivisen asenteen eroja taloyhtiön ylläpidossa. Suositellaan tiedotustilaisuuksien järjestämistä, joissa keskitytään erityisesti taloyhtiön elinkaareen ja kiinteistön kunnossapitoon liittyviin kysymyksiin. Tavoitteena on tukea asukkaita tasapainoilevasta ja passiivisesta asenteesta kohti selkeää suunnitelmallisuutta kaikilla arvosana-alueilla.',
'even', 'negative', 'negative');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa. He pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä, mutta eivät ole äärimmäisen suunnitelmallisia omassa asumisessaan. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on suunnitelmallinen, mikä viittaa siihen, että he osoittavat kiinnostusta ja sitoutumista osallistua päätöksentekoon ja ylläpitotoimiin.',
'Tässä tilanteessa suositellaan jatkamaan suunnitelmallisuuden vahvistamista erityisesti omien asumustottumusten kehittämisessä. Positiivista on, että asukkaat ovat jo suunnitelmallisia taloyhtiön ylläpidon suhteen, mutta suunnitelmallisuutta voisi vahvistaa myös omien asumistottumusten alueella. Kannustetaan asukkaita osallistumaan aktiivisesti taloyhtiön päätöksentekoon ja ylläpitotoimiin, jotta voidaan varmistaa suunnitelmallinen lähestymistapa kaikilla arvosana-alueilla. Järjestämällä tiedotustilaisuuksia ja kampanjoita voidaan vahvistaa yhteisön tietoisuutta ja sitoutumista.',
'even', 'positive', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia taloyhtiön yhteisten asioiden hoidossa ja omien asumustottumustensa suhteen. He eivät ole äärimmäisen suunnitelmallisia omassa asumisessaan ja pyrkivät säilyttämään tasapainon yhteisten asioiden käsittelyssä. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on passiivinen, mikä viittaa siihen, että he eivät osoita voimakasta kiinnostusta osallistua päätöksentekoon tai ylläpitotoimiin.',
'Tässä tilanteessa suositellaan kiinnittämään erityistä huomiota passiivisen asenteen muuttamiseen. Asukkaiden aktivoimiseksi taloyhtiön päätöksenteossa ja ylläpitotoimissa voidaan järjestää tiedotuskampanjoita, joissa korostetaan heidän rooliaan näissä prosesseissa. Lisäksi suositellaan tiedotustilaisuuksien järjestämistä, jotta asukkaat saavat mahdollisuuden ilmaista mielipiteensä ja saada lisätietoa taloyhtiön ylläpidosta. Tavoitteena on lisätä yhteisöllisyyttä ja osallistumista taloyhtiön päätöksentekoon.',
'even', 'positive', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat tasapainoilevia taloyhtiön yhteisten asioiden hoidossa, suunnitelmallisia omien asumustottumustensa suhteen, ja heillä on passiivinen asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon. Tämä tarkoittaa, että he eivät ole äärimmäisen suunnitelmallisia yhteisten asioiden suhteen, mutta tekevät tietoisia päätöksiä omassa asumisessaan. Kuitenkin he eivät osoita voimakasta kiinnostusta osallistua taloyhtiön päätöksentekoon tai ylläpitotoimiin.',
'Tässä tilanteessa suositellaan lisää aktiivisuutta ja osallistumista taloyhtiön päätöksissä sekä ylläpitotoimissa. Tiedotuskampanjat, joissa korostetaan asukkaiden roolia päätöksenteossa, voivat auttaa lisäämään tietoisuutta. Lisäksi suositellaan järjestämään tapahtumia ja tiedotustilaisuuksia, joissa asukkaat voivat ilmaista mielipiteensä ja saada lisätietoa taloyhtiön ylläpidosta. Tavoitteena on aktivoida asukkaat osallistumaan taloyhtiön päätöksentekoon ja ylläpitotoimiin.',
'even', 'positive', 'negative');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat passiivisia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa, mutta heillä on suunnitelmallinen asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon. Tämä tarkoittaa, että he eivät tee tietoisia päätöksiä omassa asumisessaan eivätkä osallistu aktiivisesti taloyhtiön yhteisten asioiden hoitoon. Kuitenkin he osoittavat kiinnostusta ja sitoutumista osallistua taloyhtiön ylläpidon päätöksentekoon.',
'Tässä tilanteessa suositellaan tiedotuskampanjoita ja aktiivista osallistumista taloyhtiön ylläpitoon liittyvissä päätöksissä. Tavoitteena on herättää asukkaissa kiinnostusta ja sitoutumista osallistua päätöksentekoon. Lisäksi voidaan harkita tiedotustilaisuuksia, joissa asukkaat voivat saada lisätietoa taloyhtiön ylläpidon merkityksestä ja roolista.',
'negative', 'negative', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat passiivisia omien asumustottumustensa ja taloyhtiön yhteisten asioiden hoidossa, mutta heillä on tasapainoileva asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon. Tämä tarkoittaa, että he eivät tee tietoisia päätöksiä omassa asumisessaan eivätkä osallistu aktiivisesti taloyhtiön yhteisten asioiden hoitoon. Kuitenkin he osoittavat tasapainoilevaa kiinnostusta ja sitoutumista osallistua taloyhtiön ylläpidon päätöksentekoon.',
'Tässä tilanteessa suositellaan tiedotuskampanjoita ja aktiivista osallistumista taloyhtiön ylläpitoon liittyvissä päätöksissä. Tavoitteena on herättää asukkaissa kiinnostusta ja tasapainoilevaa sitoutumista osallistua päätöksentekoon. Lisäksi voidaan harkita tiedotustilaisuuksia, joissa asukkaat voivat saada lisätietoa taloyhtiön ylläpidon merkityksestä ja roolista.',
'negative', 'negative', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkaat ovat passiivisia omien asumustottumustensa, taloyhtiön yhteisten asioiden hoidon ja asenteensa suhteen taloyhtiön elinkaareen ja kiinteistön kunnossapitoon. He eivät osoita vahvaa kiinnostusta tai aktiivista osallistumista näihin osa-alueisiin.',
'Suositellaan tiedotuskampanjoita ja aktiivista osallistumista kiinteistön ylläpitoon liittyvissä päätöksissä. Tämä voisi sisältää tiedotteita, jotka korostavat asukkaiden roolia kiinteistön kunnossapitopäätöksissä, sekä mahdollisuutta järjestää tapahtumia ja tiedotustilaisuuksia. Tavoitteena on herättää kiinnostusta ja lisätä ymmärrystä taloyhtiön elinkaaresta ja kunnossapidosta.',
'negative', 'negative', 'negative');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on passiivinen lähestymistapa omiin asumustottumuksiinsa. He eivät tee tietoisia päätöksiä asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa heillä on suunnitelmallinen asenne, ja he pyrkivät osallistumaan päätöksentekoon. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on myös suunnitelmallinen. He osoittavat vahvaa kiinnostusta ja sitoutumista päätöksentekoon ja ylläpitotoimiin osallistumiseen.',
'Suositellaan erityisesti panostamaan tiedotuskampanjoihin, jotka keskittyvät asukkaiden energiatehokkuuden edistämiseen. Tällä tavoin pyritään luomaan energiatehokkaammin asuva yhteisö.',
'negative', 'positive', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on passiivinen lähestymistapa omiin asumustottumuksiinsa. He eivät tee tietoisia päätöksiä asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa heillä on suunnitelmallinen asenne, ja he pyrkivät osallistumaan päätöksentekoon. He osoittavat passiivista kiinnostusta ja sitoutumista taloyhtiön elinkaaren ja kunnossapidon asioihin.',
'Suositellaan erityisesti panostamaan tiedotuskampanjoihin, jotka keskittyvät asukkaiden energiatehokkuuden edistämiseen. Tällä tavoin pyritään luomaan energiatehokkaammin asuva yhteisö.',
'negative', 'positive', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on passiivinen lähestymistapa omiin asumustottumuksiinsa, eivätkä he tee tietoisia päätöksiä asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa he ovat suunnitelmallisia, pyrkien olemaan aktiivisia päätöksenteossa. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on passiivinen, eivätkä he osoita vahvaa kiinnostusta osallistua päätöksentekoon tai ylläpitotoimiin.',
'Tässä tilanteessa suositellaan tiedotuskampanjoita ja tapahtumia, jotka voivat lisätä asukkaiden tietoisuutta taloyhtiön elinkaaresta ja kunnossapitotarpeista. Isännöitsijä voi harkita aktiivista viestintää, jossa korostetaan taloyhtiön kehitystavoitteita ja tarpeellisia ylläpitotoimia. Erityiset tilaisuudet, kuten infoillat tai koulutukset, voivat auttaa herättämään kiinnostusta ja sitoutumista asukkaissa.',
'negative', 'positive', 'negative');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on passiivinen lähestymistapa omiin asumustottumuksiinsa. He eivät tee tietoisia päätöksiä asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa heillä on tasapainoileva asenne, pyrkien säilyttämään tietyn tasapainon päätöksenteossa. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on suunnitelmallinen. He osoittavat tietoista kiinnostusta ja valmiutta osallistua päätöksentekoon ja ylläpitotoimiin.',
'Tässä tilanteessa suositellaan vahvistamaan tiedotuskampanjoita, jotka korostavat taloyhtiön elinkaaren ja kunnossapidon tärkeyttä. Asukkaille voitaisiin tarjota lisää tietoa ja resursseja, jotta he voivat tulla aktiivisemmin mukaan taloyhtiön päätöksentekoon. Lisäksi voitaisiin harkita workshop-tyyppisiä tilaisuuksia, joissa asukkaat voivat käsityönä oppia taloyhtiön ylläpitoon liittyvistä näkökohdista.',
'negative', 'even', 'positive');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on passiivinen lähestymistapa omiin asumustottumuksiinsa, eivätkä he tee tietoisia päätöksiä asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa he ovat tasapainoilevia, pyrkien säilyttämään tietyn tasapainon päätöksenteossa. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on tasapainoileva, mikä osoittaa tasapainoitettua kiinnostusta ja halua pitää kiinteistö kunnossa.',
'Tässä tilanteessa suositellaan tiedotuskampanjoita ja tapahtumia, jotka voivat lisätä asukkaiden tietoisuutta taloyhtiön elinkaaresta ja kunnossapitotarpeista. Isännöitsijä voi korostaa suunnitelmallisen asenteen positiivisia puolia, kuten kiinteistön arvon säilyttämistä ja pitkäaikaista hyötyä asukkaille. On tärkeää tuoda esiin, miten suunnitelmallinen lähestymistapa voi vaikuttaa myönteisesti taloyhtiön pitkän aikavälin kehitykseen.',
'negative', 'even', 'even');

INSERT INTO result_summaries (summary, recommendation, section_one, section_two, section_three) VALUES (
'Asukkailla on passiivinen lähestymistapa omiin asumustottumuksiinsa. He eivät tee tietoisia päätöksiä asumisensa suhteen. Taloyhtiön yhteisten asioiden hoidossa heillä on tasapainoileva asenne, pyrkien säilyttämään tietyn tasapainon päätöksenteossa. Asukkaiden asenne taloyhtiön elinkaareen ja kiinteistön kunnossapitoon on myös passiivinen. He eivät osoita vahvaa kiinnostusta tai sitoutumista osallistua päätöksentekoon tai ylläpitotoimiin.',
'Tässä tilanteessa suositellaan tiedotuskampanjoita ja aktiivista osallistumista taloyhtiön ylläpitoon liittyvissä päätöksissä. Tavoitteena on herättää asukkaissa kiinnostusta ja passiivista sitoutumista osallistua päätöksentekoon. Lisäksi voidaan harkita tiedotustilaisuuksia, joissa asukkaat voivat saada lisätietoa taloyhtiön ylläpidon merkityksestä ja roolista.',
'negative', 'even', 'negative');

INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (1, 'Pyrin pitämään huonelämpötilan suositusten mukaisena (n. 20-22 C).', 1, 1, 1);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (2, 'Ohjeita noudattamalla varmistan, että lämmitysjärjestelmä toimii oikein. En peitä patteritermostaatteja verhoilla tai huonekaluilla.', 1, 1, 1);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (3, 'Sammutan valot tiloista, joissa ei oleskella.', 1, 1, 2);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (4, 'Käyn suihkussa ripeästi, jotta en tuhlaa lämmintä vettä.', 1, 1, 1);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (5, 'Tarvittaessa tuuletan lyhyesti ja tehokkaasti, etenkin lämmityskaudella.', 1, 1, 3);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (6, 'Jos huoneistossa vetää, selvitän syyn enkä tuki korvausilmaventtiiliä.', 1, 1, 3);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (7, 'Huolehdin asuntoni poistoilmaventtiilin ja liesituulettimen rasvasuodattimen puhdistuksesta.', 1, 1, 5);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (8, 'Huolehdin huoneistoni viilennyksestä kesällä sulkemalla sälekaihtimet/verhot ja tuuletan vain iltaisin.', 1, 1, 1);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (9, 'Seuraan kotini rakenteiden kuntoa ja ilmoitan vioista huollolle (esim. ovien ja ikkunoiden veto, vesikalusteiden vuodot sekä tiivisteiden kunto)', 1, 1, 5);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (10, 'Huolehdin asunnossani vastuulleni kuuluvista korjauksista, sillä ne vaikuttavat energiankulutukseen ja kiinteistön arvoon.', 1, 1, 5);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (11, 'Arvostaisin mahdollisuutta seurata ja ohjata asumisolosuhteitani digitaalisesti.', 1, 1, 4);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (12, 'Sammutan valot taloyhtiön yleisistä tiloista niistä poistuessani ja huolehdin, että ovet menevät kiinni.?', 1, 1, 2);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (13, 'Ilmoitan huoltoon, jos huomaan yhteisissä tiloissa viallisen valaisimen, laitteen, ikkunan jne.', 1, 1, 4);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (14, 'Talvella ilmoitan huoltoon liukkaudesta tai katoille kasaantuvista lumimassoista.', 1, 1 ,4);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (15, 'Luen saamani viestit ja taloyhtiötiedotteet. Toimin niissä annettujen ohjeiden mukaan tai vastaan niissä oleviin pyyntöihin.', 1, 1, 5);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (16, 'Haluan tietää, miten taloyhtiön energiatehokkuutta parannetaan, jotta energialasku pienentyisi.', 1, 2, 6);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (17, 'Taloyhtiössäni pitäisi keskustella siitä, miten korkea kulutus vaikuttaa vastikkeiden ja maksujen muodostumiseen, esimerkiksi lämpimän veden käyttö.', 1, 2, 6);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (18, 'Toivon, että taloyhtiö ostaa sähköä ja lämpöä uusiutuvista energialähteistä, vaikka kiinteistön järjestelmiä ei muutettaisi.', 1, 2, 6);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (19, 'Kannatan maalämpöä, aurinkoenergiaa ja muita uusiutuvia energialähteitä, jos investointi on kannattavaa.', 1, 2, 6);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (20, 'Pyrin aina osallistumaan yhtiökokouksiin.', 1, 2, 7);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (21, 'Osallistun taloyhtiön hankinnoista, korjauksista ja remontin suunnittelusta käytävään keskusteluun. Äänestän yhtiökokouksessa kiinteistön kuntoa parantavien korjausten puolesta.', 1, 2, 7);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (22, 'Minulla on mahdollisuus antaa palautetta ja kehitysehdotuksia hallitukselle.', 1, 2, 7);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (23, 'Taloyhtiössämme on yhteistä toimintaa tai viestintäkanavia. Olen itse aktiivinen näissä.', 1, 2, 7);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (24, 'Taloyhtiöllä pitää olla selkeät suuntaviivat siitä, miten energiankulutus ja kustannukset pidetään kurissa.', 1, 3, 8);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (25, 'Haluan, että taloyhtiömme kuntoa seurataan säännöllisesti ja korjaukset perustuvat pitkän aikavälin (10-15 vuotta) suunnitelmaan, jotta kiinteistö ei rapistu.', 1, 3, 8);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (26, 'Taloyhtiön rakenteiden huoltoon, ylläpitoon ja ennakoiviin korjauksiin kuluu turhaan rahaa. Korjataan asiat sitten vasta, kun ne on rikki.', 1, 3, 8);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (27, 'Minulle riittää, että taloyhtiömme on rakennusaikaisessa tasossaan. En kaipaa uudistuksia.', 1, 3, 8);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (28, 'Taloyhtiön hankinnoissa halvin hinta on tärkein kriteeri.', 1, 3, 9);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (29, 'Pelkään joka yhtiökokouksessa, että hoitovastike nousee enkä tiedä miksi.', 1, 3, 9);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (30, 'Maksan mieluummin ylimääräisen vastikkeen tai kaksi kuin kerrytän yhtiön kassaan rahaa korjauksiin.', 1, 3, 9);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (31, 'Yhtiön kassan pitää kestää tilanne, että maksan vastikkeen myöhässä.', 1, 3, 9);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (32, 'Vastikkeeni pitää olla pieni, jotta saan asumisen näyttämään houkuttelevalta (esim. myyntitarkoituksessa).', 1, 3, 9);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (33, 'Taloyhtiössämme viestitään säännöllisesti yhteisistä asioista. Tiedän, mitä minulta odotetaan ja miten taloyhtiöllä menee. ', 1, 3, 10);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (34, 'En usko, että energiasäästökeinoista tiedottamisesta on asukkaille taloudellista hyötyä, jos asuu kerrostalossa.', 1, 3, 10);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (35, 'Taloyhtiön viestit ovat lakisääteistä hallintoa varten eikä siinä ole minulle tärkeää sisältöä.', 1, 3, 10);
INSERT INTO questions (question_order, question, weight, section_id, question_category_id) VALUES (36, 'Osakkailla on tiedossa taloyhtiön kunnossapidon vastuunjako ja huoneistojen laitteiden käyttöohjeet. Osakkaat ja asukkaat tietävät, miten toimia vikatilanteissa.', 1, 3, 10);

INSERT INTO choices (choice_text, choice_value) VALUES ('Pidän tärkeänä tai toimin näin', 1);
INSERT INTO choices (choice_text, choice_value) VALUES ('Asialla ei ole merkitystä tai asia ei koske minua', 0);
INSERT INTO choices (choice_text, choice_value) VALUES ('En pidä tärkeänä tai en toimi näin', -1);

INSERT INTO choices (choice_text, choice_value) VALUES ('Olen samaa mieltä', 1);
INSERT INTO choices (choice_text, choice_value) VALUES ('Asialla ei ole minulle merkitystä', 0);
INSERT INTO choices (choice_text, choice_value) VALUES ('Olen eri mieltä', -1);

INSERT INTO questions_choices (question_id, choice_id) VALUES (1,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (1,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (1,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (2,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (2,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (2,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (3,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (3,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (3,3);

INSERT INTO questions_choices (question_id, choice_id) VALUES (4,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (4,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (4,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (5,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (5,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (5,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (6,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (6,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (6,3);

INSERT INTO questions_choices (question_id, choice_id) VALUES (7,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (7,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (7,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (8,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (8,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (8,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (9,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (9,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (9,3);

INSERT INTO questions_choices (question_id, choice_id) VALUES (10,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (10,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (10,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (11,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (11,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (11,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (12,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (12,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (12,3);

INSERT INTO questions_choices (question_id, choice_id) VALUES (13,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (13,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (13,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (14,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (14,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (14,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (15,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (15,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (15,3);

INSERT INTO questions_choices (question_id, choice_id) VALUES (16,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (16,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (16,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (17,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (17,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (17,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (18,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (18,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (18,3);

INSERT INTO questions_choices (question_id, choice_id) VALUES (19,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (19,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (19,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (20,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (20,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (20,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (21,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (21,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (21,3);

INSERT INTO questions_choices (question_id, choice_id) VALUES (22,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (22,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (22,3);
INSERT INTO questions_choices (question_id, choice_id) VALUES (23,1);
INSERT INTO questions_choices (question_id, choice_id) VALUES (23,2);
INSERT INTO questions_choices (question_id, choice_id) VALUES (23,3);

INSERT INTO questions_choices (question_id, choice_id) VALUES (24,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (24,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (24,6);
INSERT INTO questions_choices (question_id, choice_id) VALUES (25,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (25,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (25,6);
INSERT INTO questions_choices (question_id, choice_id) VALUES (26,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (26,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (26,6);

INSERT INTO questions_choices (question_id, choice_id) VALUES (27,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (27,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (27,6);
INSERT INTO questions_choices (question_id, choice_id) VALUES (28,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (28,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (28,6);
INSERT INTO questions_choices (question_id, choice_id) VALUES (29,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (29,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (29,6);

INSERT INTO questions_choices (question_id, choice_id) VALUES (30,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (30,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (30,6);
INSERT INTO questions_choices (question_id, choice_id) VALUES (31,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (31,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (31,6);
INSERT INTO questions_choices (question_id, choice_id) VALUES (32,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (32,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (32,6);

INSERT INTO questions_choices (question_id, choice_id) VALUES (33,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (33,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (33,6);
INSERT INTO questions_choices (question_id, choice_id) VALUES (34,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (34,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (34,6);
INSERT INTO questions_choices (question_id, choice_id) VALUES (35,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (35,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (35,6);

INSERT INTO questions_choices (question_id, choice_id) VALUES (36,4);
INSERT INTO questions_choices (question_id, choice_id) VALUES (36,5);
INSERT INTO questions_choices (question_id, choice_id) VALUES (36,6);


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