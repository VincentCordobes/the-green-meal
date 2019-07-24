create type role as ENUM ('manager', 'admin', 'regular');

create table if not exists person (
  id serial primary key,
  email text unique not null,
  email_validated boolean default false,
  email_validation_token text,
  password_reset_token text,
  password text not null,
  role role default 'regular',
  firstname text,
  lastname text,
  manager_id integer,
  expected_calories_per_day integer,
  foreign key (manager_id) references person(id) on delete set null
 );


create table if not exists meal (
  id serial primary key,
  text text not null,
  calories int constraint positive_calories check (calories > 0),
  at_date text not null,
  at_time text not null,
  owner_id integer not null,
  foreign key (owner_id) references person(id) on delete cascade
);
