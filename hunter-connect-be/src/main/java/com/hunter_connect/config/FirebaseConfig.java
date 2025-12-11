package com.hunter_connect.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import io.github.cdimascio.dotenv.Dotenv; // Import Dotenv
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // 1. Load the .env file
            // This looks for a .env file in the project root
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

            // 2. Get the JSON content (Checks actual Env Vars first, then .env file)
            String serviceAccountJson = dotenv.get("FIREBASE_CREDENTIALS_JSON");

            // Fallback to System.getenv if dotenv doesn't find it (useful for production where .env might not exist)
            if (serviceAccountJson == null) {
                serviceAccountJson = System.getenv("FIREBASE_CREDENTIALS_JSON");
            }

            if (serviceAccountJson == null || serviceAccountJson.isEmpty()) {
                throw new IllegalStateException("Environment variable FIREBASE_CREDENTIALS_JSON is not set.");
            }

            // 3. Convert the String JSON into an InputStream
            InputStream serviceAccount = new ByteArrayInputStream(serviceAccountJson.getBytes(StandardCharsets.UTF_8));

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // 4. Initialize Firebase
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase Admin SDK initialized successfully.");
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize Firebase: " + e.getMessage());
        }
    }
}