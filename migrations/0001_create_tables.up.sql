create table if not exists person (
  id serial primary key,
  username text unique not null,
  password text,
  firstname text,
  lastname text 
 );

create table if not exists meal (
  id serial primary key,
  text text,
  calories int,
  at timestamptz
);
