create table users (
	id serial primary key,
	name varchar(100) null,
	email text unique not null,
	entries integer default 0,
	joined_at timestamp not null
);