BEGIN TRANSACTION;

--first user
insert into users (name, email, entries, joined_at)
values ('username1', 'admin@admin.com', 2, '2020-01-01');

insert into logins (hash, email)
values ('$2a$10$Pkh5nlAtroKYtspRoN/koeS5r7ebWhE2AyaiRvHnFgdKDXUF4g9uy', 'admin@admin.com');


--second user
insert into users (name, email, entries, joined_at)
values ('username2', 'user2@email.com', 6, '2020-12-01');

insert into logins (hash, email)
values ('$2a$10$Pkh5nlAtroKYtspRoN/koeS5r7ebWhE2AyaiRvHnFgdKDXUF4g9uy', 'user2@email.com');


COMMIT;