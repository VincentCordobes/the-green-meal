insert into person (email, password, firstname, lastname, email_validated, role)
values ('user1', 'pass', 'firstname1', 'lastname1', true, 'manager');

insert into person (email, password, firstname, lastname, email_validated)
values ('user2', 'pass', 'firstname2', 'lastname2', true);

insert into person (email, password, firstname, lastname, email_validated, manager_id)
values ('user3', 'pass', 'firstname3', 'lastname3', true, 1);

insert into person (email, password, firstname, lastname, email_validated, manager_id)
values ('user4', 'pass', 'firstname4', 'lastname4', true, 1);
