insert into person (email, password, firstname, lastname, email_validated, role) values 
('admin@meals.com', '$2b$10$9dLZKYh.NEVxUCxj3Tc.Weqv1GJUiJHe0z99hd9oJH7PWXYcV350a', 'Vincent', 'Cordobes', true, 'admin'),
('manager@meals.com', '$2b$10$9dLZKYh.NEVxUCxj3Tc.Weqv1GJUiJHe0z99hd9oJH7PWXYcV350a', 'Indiana', 'Jones', true, 'manager'),
('regular@meals.com', '$2b$10$9dLZKYh.NEVxUCxj3Tc.Weqv1GJUiJHe0z99hd9oJH7PWXYcV350a', 'Bruce', 'Willis', true, 'regular');


insert into meal (at, text, calories, owner_id) 
values ('2018-01-01 12:00:00 +00:00', 'Fried chicken with rice', 500, 1), 
       ('2019-01-01 19:00:00 +00:00', 'Banana and 3 apples', 200, 1),
       ('2019-01-01 19:00:00 +00:00', 'Tom yum Goong', 90, 3);
