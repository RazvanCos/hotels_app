CREATE database hotels_app_clients;
USE hotels_app_clients;

Create table Users(
	UserID int auto_increment primary key,
    Nume varchar(100) not null,
    Prenume varchar(150) not null,
    Email varchar(150) not null unique,
    PasswordHash varchar(255) not null,
    Role enum('admin', 'user') default 'user',
    CreatedAt Timestamp default current_timestamp
);

Create table ClientHotels(
	ClientHotelId int auto_increment primary key,
    UserID int not null,
    HotelId int not null,
    foreign key(UserID) references Users(UserID)
);

SELECT * FROM Users;