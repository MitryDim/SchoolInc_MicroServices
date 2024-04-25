# School Inc

SchooInc ltd is a company which aim to produce the best experience for your student and professor with a web native tool.

Your task is to produce a full application with both GraphQL API and frontend using a framework (React, Vue or Angular) to allow users to access information about relevant data of their student / school life. This include grading, but also courses, class ...
This should also allow professor to display some information about a specific class or student like name, number of student, grading...

The API needs to be GraphQL compliant and use micro services (not one big monolith application)

## Requirement
- Docker
- NodeJS

## Microservices

- **Users** : This microservice is used to manage users, such as registering and creating accounts, updating, and deleting.
- **Classes** : This microservice is used to manage Classes.
- **Courses** : This microservice is used for manage Courses.
- **Grades** : This microservice is used to manage Grades.



## Installation

First, we need to install all the dependencies in the different folders of microservices and front-end services
ex: `cd front && npm install`

- Clone the repository : `git clone https://github.com/Valt1-0/Booking.git`
- Setup the Docker compose : `docker compose up -d`
- Configure environment variables as needed in .env of each Microservices.



## Environment Variables

The project uses different environment files depending on the run mode:

- For starting the project in production mode, use `npm start` with the `.env` file.
- For starting the project in development mode, use `npm run dev` with the `.env.dev` file.
- For running tests, use `npm run test` with the `.env.test` file.

Here’s an example of what the `.env` file might look like:

```env
MONGODB_URI="mongodb://localhost:27017/YOURDB"
API_PORT="PORT"
JWT_SECRET_KEY="YOURKEY"
```

## Tests

To run the tests, use the command `npm run test` in the folder of the microservices you want to test.

## Containers

### APIs

- **users1**: A microservice for managing user-related operations.
- **users2**: Another microservice for managing user-related operations. 
- **classes1**: A microservice for managing classes-related operations. 
- **classes12**: Another microservice for managing classes-related operations. 
- **courses1**: A microservice for managing courses-related operations.
- **courses2**: Another microservice for managing courses-related operations.
- **grades1**: A microservice for managing grades operations.
- **grades2**: Another microservice for managing grades operations.

### Databases

- **users-db**: A database for storing user-related data.
- **classes-db**: A database for storing classes-related data.
- **courses-db**: A database for storing courses-related data.
- **grades-db**: A database for storing grades-related data.

