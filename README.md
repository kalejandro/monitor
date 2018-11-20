# Monitor (PoC)

## Project description

Monitor is a MongoDB statistics monitor. It has a web UI and displays the stats
in charts.

The backend was built with Spring (Java) and the frontend with Reactjs
(JavaScript).

### Some of the libraries used (frontend)

* Redux, thunk
* Stomp.js (over WebSockets, for control and stats updates)
* Chart.js (Dashboard charts)

## Running the project

### Requirements

The versions used to develop/test the project are enclosed in parentheses.
* MongoDB (v4.0.2)
* JDK 8 (OpenJDK)
* Maven (v3.5.4)
* Nodejs (v8.12.0)
* Yarn (v1.10.1)
* Chromium/Chrome (v70) or Firefox (v63)

#### Notes

As of November 2018, i'm experiencing the
[Surefire/OpenJDK bug](https://issues.apache.org/jira/browse/SUREFIRE-1588).
Adding -Dsurefire.useSystemClassLoader=false works.

### How to configure

The Monitor configuration can be set using the Spring Boot properties files.

### How to run

1. Set the Monitor configuration using the properties files (or use the defaul
settings in the development profile properties file).  
This includes the MongoDB client URI and the Monitor credentials.
2. Start mongod 
3. Start the frontend (yarn start)
4. Start the Spring Boot app (mvn spring-boot:run)
5. Open Monitor in localhost:3000
6. Login

### How to run the tests

* yarn test (frontend)
* mvn test (backend)

### Known problems

* Zooming after the charts are rendered causes the chart labels to be blurry.
