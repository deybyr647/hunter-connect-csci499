# 🦅 HunterConnect

**Hunter Connect** is a dedicated social mobile platform for Hunter College students. It bridges the gap between students by facilitating study partnerships, event discovery, and community connection through interests and courses.

This repository is a **monorepo** containing both the Java Spring Boot Backend and the React Native/Expo Frontend.

## 🛠 Tech Stack

### **Backend (`hunter-connect-be`)**

- **Language:** Java 21
- **Framework:** Spring Boot 3.x
- **Build Tool:** Maven
- **Database:** Google Cloud Firestore (NoSQL)
- **Authentication:** Firebase Authentication (Admin SDK)
- **Security:** Spring Security with Custom JWT Filters
- **Architecture:** Functional Routing (`RouterFunctions`) & Reactive patterns

### **Frontend (`hunter-connect-fe`)**

- **Framework:** React Native with Expo (SDK 54)
- **Language:** TypeScript
- **Routing:** Expo Router (File-based routing)
- **Styling:** StyleSheet & React Native Elements
- **API Client:** Fetch API
- **State/Auth:** Firebase Client SDK

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** (LTS version recommended)
- **Java JDK 21**
- **Firebase Project** with Authentication and Firestore enabled.

### 2. Backend Setup (`hunter-connect-be`)

The backend handles business logic, data validation, and secure communication with Firestore.

1. **Navigate to the backend directory:**

```
cd hunter-connect-be
```


2. **Firebase Credentials:**
    
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Navigate to **Project Settings > Service Accounts**.
    - Click **Generate new private key**.
    - Rename the downloaded file to `service-account-key.json`.
    - Move this file into the resources folder: `hunter-connect-be/src/main/resources/service-account-key.json`
    
    <br></br>

3. **Run the Server:**
	```
	# Linux/Mac
    ./mvnw spring-boot:run
    
    # Windows
    mvnw.cmd spring-boot:run
	```
    
    The server will start on [http://localhost:8080](http://localhost:8080).
    

### 3. Frontend Setup (`hunter-connect-fe`)

The frontend is an Expo app that runs on iOS, Android, and Web.

1. **Navigate to the frontend directory:**

    ```
    cd hunter-connect-fe
    ```
    <br></br>
2. **Install Dependencies:**
    
    ```
    pnpm install
    # or
    npm install
    # or
    yarn install
    ```
    <br></br><br></br>
3. **🔑 Environment Variables (Crucial Step)**
    
    To keep API keys secure and configurable, this project uses a .env file. Expo automatically loads variables starting with `EXPO_PUBLIC_`.
    
    <br></br>
    
    1. Create a file named `.env` in the `hunter-connect-fe` root directory.
    2. Add the following variables (replace with your actual Firebase keys found in Project Settings > General):
    
    ```
    # API Configuration
    # Use 'http://localhost:8080' for iOS Simulator / Web
    # Use your machine's LAN IP (e.g., [http://192.168.1.5:8080](http://192.168.1.5:8080)) for physical Android devices
    EXPO_PUBLIC_API_URL=http://localhost:8080
    
    # Firebase Client Configuration
    EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
    
4. **Run the App:**

   ```
    npx expo start
    ```

<br></br>
- **Note:** If you change the `.env` file while the server is running, you must restart with `npx expo start --clear` to apply changes.

## 📡 API Endpoints

The backend exposes the following REST endpoints. All write operations require a valid Firebase Bearer Token header (`Authorization: Bearer <token>`).

### **Users**

| **Method** | **Endpoint**      | **Access** | **Description**                              |
| ---------- | ----------------- | ---------- | -------------------------------------------- |
| `POST`     | `/api/users`      | **Public** | Create a new user profile after Auth signup. |
| `GET`      | `/api/users`      | Secure     | Get a list of all users.                     |
| `GET`      | `/api/users/{id}` | Secure     | Get a specific user profile.                 |
| `PUT`      | `/api/users`      | Secure     | Update the authenticated user's profile.     |

<br></br>

### **Events**

| **Method** | **Endpoint**                 | **Access**   | **Description**                 |
| ---------- | ---------------------------- | ------------ | ------------------------------- |
| `GET`      | `/api/events`                | Secure       | Fetch all events.               |
| `POST`     | `/api/events`                | Secure       | Create a new event.             |
| `PUT`      | `/api/events/{id}`           | Creator Only | Update event details.           |
| `POST`     | `/api/events/{id}/subscribe` | Secure       | Toggle attendance (Join/Leave). |

<br></br>

### **Posts**

| **Method** | **Endpoint** | **Access** | **Description**      |
| ---------- | ------------ | ---------- | -------------------- |
| `GET`      | `/api/posts` | Secure     | Get community posts. |
| `POST`     | `/api/posts` | Secure     | Create a new post.   |

<br></br><br></br>

## 📂 Project Structure

```
hunter-connect/
├── hunter-connect-be/       # Java Spring Boot Backend
│   ├── src/main/java/       # Source code (Handlers, Models, Config)
│   └── src/main/resources/  # Config files (application.properties, firebase key)
│
└── hunter-connect-fe/       # React Native Frontend
    ├── app/                 # Expo Router screens ((tabs), (auth), etc.)
    ├── api/                 # API service functions (Users.ts, Events.ts)
    ├── components/          # Reusable UI components
    └── assets/              # Images and Fonts
```

<br></br>

## 🤝 Contributing

1. Create a feature branch from `dev`.
2. Ensure your code is formatted (Prettier for TypeScript, standard formatting for Java).
3. Test your changes on both iOS and Android if possible.
4. Submit a Pull Request.
