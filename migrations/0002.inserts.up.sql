INSERT INTO person (email, email_validated, email_validation_token, password_reset_token, password, role, firstname, lastname, manager_id, expected_calories_per_day) VALUES 
('admin@meals.com', true, NULL, NULL, '$2b$10$9dLZKYh.NEVxUCxj3Tc.Weqv1GJUiJHe0z99hd9oJH7PWXYcV350a', 'admin', 'Vincent', 'Cordobes', NULL, NULL),
('manager@meals.com', true, NULL, NULL, '$2b$10$9dLZKYh.NEVxUCxj3Tc.Weqv1GJUiJHe0z99hd9oJH7PWXYcV350a', 'manager', 'Indiana', 'Jones', NULL, NULL),
('regular@meals.com', true, NULL, NULL, '$2b$10$9dLZKYh.NEVxUCxj3Tc.Weqv1GJUiJHe0z99hd9oJH7PWXYcV350a', 'regular', 'Bruce', 'Willis', 2, 700),
('george@delajungle.com', false, '1cfb04b1-5224-4273-ae90-3c32e754e817', NULL, '$2b$10$0FYExKJQGhw4vW3JiFjx7.IRiSI1K9a2chXe77boF/k08/iS5ma0W', 'regular', 'George', 'Delajungle', NULL, NULL),
('jake@sully.com', true, '16761c8f-e48d-4a1a-9c63-194fd58ea973', NULL, '$2b$10$dqYqnPdQWP/KEcOGKJwMLeGQhKsAFpttUPSvBxCvpeQwKqBnTqrgq', 'admin', 'Jake', 'Sully', NULL, NULL);


INSERT INTO meal (text, calories, at, owner_id) VALUES ('Fried chicken with rice', 500, '2018-01-01 12:00:00', 1);
INSERT INTO meal (text, calories, at, owner_id) VALUES ('Banana and 3 apples', 200, '2019-01-01 19:00:00', 1);
INSERT INTO meal (text, calories, at, owner_id) VALUES ('Tom yum Goong', 90, '2019-01-01 19:00:00', 3);
INSERT INTO meal (text, calories, at, owner_id) VALUES ('Côtes d''agneau et pois chiches', 567, '2019-06-12 13:30:31', 3);
INSERT INTO meal (text, calories, at, owner_id) VALUES ('Burger frites', 1000, '2017-07-21 13:30:31', 3);
INSERT INTO meal (text, calories, at, owner_id) VALUES ('Omelette, salade de tomate, fromage blanc', 689, '2019-01-01 12:29:31', 3);
