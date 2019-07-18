insert into person (email, password, firstname, lastname, email_validated, role)
values ('manager@toto.com', 'pass', 'firstname1', 'lastname1', true, 'manager');

insert into person (email, password, firstname, lastname, email_validated)
values ('user2@toto.com', 'pass', 'firstname2', 'lastname2', true);

insert into person (email, password, firstname, lastname, email_validated, manager_id)
values ('user3@toto.com', 'pass', 'firstname3', 'lastname3', true, 1);

insert into person (email, password, firstname, lastname, email_validated, manager_id)
values ('user4@toto.com', 'pass', 'firstname4', 'lastname4', true, 1);

insert into person (email, password, firstname, lastname, email_validated, role)
values ('admin@toto.com', '$2b$10$8XHQDalaR3KcsyipYt8N3.2a2e0nfBoZNPVbggDNWc8IoQovop.Ym', 'Vincent', 'Cordobes', true, 'admin');
