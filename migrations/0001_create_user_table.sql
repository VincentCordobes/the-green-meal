-- drop table if not exists person;
create table if not exists person(
  id serial primary key,
  username varchar(255) unique,
  password varchar(255)
 );


insert into person (username, password) values ('Vincent', 'toto');
