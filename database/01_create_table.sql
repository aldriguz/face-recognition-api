create table users (
	id serial primary key,
	name varchar(100) null,
	email varchar(250) unique not null,
	password varchar(500) not null,
	entries integer default 0,
	joined_at timestamp not null
);