create type role as ENUM ('manager', 'admin', 'regular');

create table if not exists person (
  id serial primary key,
  username text unique not null,
  password text not null,
  role role default 'regular',
  firstname text,
  lastname text 
 );


create table if not exists meal (
  id serial primary key,
  text text not null,
  calories int constraint positive_calories check (calories > 0),
  at timestamptz not null
);
