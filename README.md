## Tuners-R-us (our database group project)
### Overview
This is a database group project for the course CMPS 460 at ULL. im not writing any more, if you care, the instructions for running it is below, isn't my best work, but its something.
### Instructions for running
1. Clone the repository (or download the code from this submission):
   ```bash
   git clone https://github.com/Cryogenetics/ihateclassprojects.git
   cd ihateclassprojects
   ```
2. if you don't have node.js installed, install it from [here](https://nodejs.org/en/download/).
3. Install the project dependencies:
   ```bash
   npm install
   ```
4. create a `.env` file in the root directory of the project, a template is provided (`.env.template`) in root, and change/fill whatever values you need. 
5. make sure your MariaDB/MySQL server is actually running and connectable with provided login, or nothing’s gonna work (obviously)
6. Run the database initialization script:
   ```bash
   npm run setup
   ```
7. Run the server:
   ```bash
   npm run dev
   ```
8. Open your browser and go to `http://localhost:5173` to see the application in action.

now, for my professor and TA that may want to quickly look at certain things, or need a rundown on where to look at things
### Loading database information for the page
This is done in all of the auth/x pages, through the loader function, you can search all files for loader, or look at the uses of
makeDBQuery() from my `app/database/index.ts` file. This function is used to make queries to the database and return the results. It uses the `mysql` library to connect to the database and execute the queries. I created my own wrapper with the help of AI to convert the results to a JSON array response

### Changing/Updating the database
- Similar to how loading is done, this is all done in the action() functions exported from all of the `authed/x` pages
- These functions are used to handle the form submissions and update the database with the new values. The `makeDBQuery()` function is also used here to execute the queries.

### Frontend/database stuff
- The frontend is done in react, and is included in every page, as the default export under the loader/action
-  The database setup is slightly done differently, we read the data from `setup.sql` in the root of the project and then run the queries inside the database when connecting

### Security features
- JWT Middleware is inside `app/routes/middleware/auth.middleware.ts` and implemented in `app/routes/authed.tsx`
- inside every query we use parameters, implementation can be seen in `app/database/index.ts`
- Passwords are hashed upon submission, seen in `app/routes/signup.tsx`
- this additionally prevents timing attacks, as the comparison happens with hashed strings, and during signin, a part of the query, so the timing should always be rougly the same.
- speaking of authentication, everything is locked behind authentication, so no page with a `authed/` endpoint is accessible without being logged in