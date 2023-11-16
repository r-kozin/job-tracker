-- This file includes the SQL commands to create the database and tables

CREATE DATABASE jobtracker;

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL,
    jobTitle VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    salaryMin INT,
    salaryMax INT,
    ATS VARCHAR(255),
    appURL VARCHAR(255),
    appStatus VARCHAR(255) NOT NULL,
    dateApplied DATE NOT NULL,
    dateCreated DATE
);

CREATE TABLE columns(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    jobIds text,
);