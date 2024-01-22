# Obsidian Chat

A web chat application built using the MERN stack. Includes real-time messaging and file sharing, user authentication, and intuitive interface for modern interactive conversations

## Images

<img src="https://github.com/TN0123/Obsidian-Chat/blob/main/images/Register%20and%20Login%20Page.png" alt="Register and Login Page"/>
<img src="https://github.com/TN0123/Obsidian-Chat/blob/main/images/Chat%20Page.png" alt="Chat Page"/>

## Current Features

- Real time messaging - instant communication with real-time updates, ensuring a dynamic and responsive chatting experience
- Secure user authentication - uses secure encryption and authentication protocols, safeguarding user accounts and ensuring confidential, private conversations
- File sharing - ability to seamlessly share files within the chat, enhancing collaboration and information exchange
- Online indicators - ability to identify when contacts are online, fostering timely and efficient communication
- Message History - access and review past conversations effortlessly, maintaining a comprehensive record for users to revisit and reference

## Technologies 

- MongoDB - a NoSQL database for storing user information, messages, and other application data
- Express.js - a web application framework for building the server-side of the application
- React.js - a frontend JavaScript library for building user interfaces and handling dynamic content
- Node.js - JavaScript runtime for executing server-side code, facilitating the backend functionality
- JSON Web Tokens - securely transmits information between parties as a JSON object, used for user authentication
- Bcrypt - Hashing library for securing user passwords stored in the database
- Mongoose - MongoDB object modeling for Node.js, simplifying interactions with MongoDB database
- Axios - HTTP client for making requests to the server and handling asynchronous operations

## Installation
1. Clone the Repository
   ```sh
   git clone https://github.com/TN0123/Obsidian-Chat.git
   ```
2. Install Server Dependencies
   ```sh
   cd api
   npm install
   ```
3. Set up Database
   - Create an account on MongoDB Atlas
   - Set up a new cluster and obtain the connection string.
4. Configure Environment Variables
   - Add the following variables to the `.env` file
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```
5. Install Client Dependencies
   ```
   cd ../client
   npm install
   ```
6. Run the application
   - Run this command from both the client and api directory
   ```
   npm start
   ```

## Usage
Access the application in your web browser at `http://localhost:5173`
