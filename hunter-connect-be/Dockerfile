# 1. Build Stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the application, skipping tests to speed it up
RUN mvn clean package -DskipTests

# 2. Run Stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copy the built jar from the previous stage
COPY --from=build /app/target/*.jar app.jar

# We need to get the firebase key in here.
# In production, we usually pass the key content as an Environment Variable
# and write it to a file at runtime.
COPY src/main/resources/service-account-key.json /app/service-account-key.json

# Expose port 8080
EXPO 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]