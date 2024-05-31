# Northcoders News API

#### NC-News

Welcome to NC-News. This app runs a series of endpoints for a database called nc_news. The database is a collective of news topics, articles, comments and users. This app allows users to access, add to, update and delete content in the database.

###Instructions:

To clone this repo, type the following into your terminal: git clone https://github.com/kjb2104/KB-NC-News.git

After cloning you need to set the environment variables:

* Create two files - .env.test and .env.development to store the environment variables.
* Locate the names of test and development databases on the setup.sql file.
* Add PGDATABASE= with the correct database name to the corresponding .env file.

##Installation:

**Run npm install** to install the dependencies listed in the package.json file including:

* dotenv
* express
* husky
* pg
* supertest

Dev dependencies:
* jest
* jest-extended
* jest-sorted
* pg-format

Node and postgres minimum requirements:
node.js - 21.6.2
pg - 8.11.5

You will also need **psql** installed to run this application. Ensure that the service is running before attempting to seed the database or it will throw an error.

##Seeding:

Now that you have installed all the required packages, check that the database is seeding correctly.

In your terminal type: npm run seed

You should not receive any error.

##Testing:

The api was built using both Supertest and Jest to facilitate integration and unit testing. To test it locally, you can run the test suite by typing the following in your terminal: npm test 

This should run both the utils function tests for the seed file and the test suite for the app.

##Accessing Hosted api:

The app has also been hosted using a combination of Superbase and Render.

Each endpoint can be accessed through the following url:

https://newsbase.onrender.com/api






--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)




You should include:

A link to the hosted version.
A summary of what the project is.
Clear instructions of how to clone, install dependencies, seed local database, and run tests.
Information about how to create the two .env files.
The minimum versions of Node.js, and Postgres needed to run the project.