-- person
insert into person (email, password, firstname, lastname, email_validated, role)
values ('manager@toto.com', 'pass', 'firstname1', 'lastname1', true, 'manager');

insert into person (email, password, firstname, lastname, email_validated, expected_calories_per_day)
values ('user2@toto.com', 'pass', 'firstname2', 'lastname2', true, 600);

insert into person (email, password, firstname, lastname, email_validated, manager_id)
values ('user3@toto.com', 'pass', 'firstname3', 'lastname3', true, 1);

insert into person (email, password, firstname, lastname, email_validated, manager_id)
values ('user4@toto.com', 'pass', 'firstname4', 'lastname4', true, 1);

insert into person (email, password, firstname, lastname, email_validated, role)
values ('admin@toto.com', '$2b$10$8XHQDalaR3KcsyipYt8N3.2a2e0nfBoZNPVbggDNWc8IoQovop.Ym', 'Vincent', 'Cordobes', true, 'admin');


-- meal
insert into meal (at_date,at_time, text, calories, owner_id) 
values ('2018-01-01', '12:00', 'Fried chicken with rice', 500, 2), 
       ('2019-01-01', '19:00', 'Banana with ice', 400, 2),
       ('2019-01-01', '19:00', 'Banana with ice', 400, 5);
