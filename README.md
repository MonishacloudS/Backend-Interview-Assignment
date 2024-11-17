Steps:



git clone <repository-url>
cd <repository-folder>






npm install









The server will start on http://localhost:3000.







command for starting the server: npm run dev




Base URL: http://localhost:3000/api






POST /api/register: Register a new user.
POST /api/login: Login with email and password.
POST /api/admin/unlock-user: Manually unlock a user account (Admin).
GET  /api/profile: gets user profile details










.env credentials


MONGODB_URL=mongodb+srv://node_interview_task:root@cluster0.jdbytoc.mongodb.net/
JWT_SECRET=secretKey
ACCOUNT_UNLOCK_TIME=30  #in minutes





