// components/AuthStyles.ts
import { StyleSheet } from "react-native";

export const AuthStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E1759",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  haveAccount: {
    color: "#2E1759",
    textAlign: "center",
    marginTop: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  logo: {
    width: 80,
    height: 80,
    marginVertical: 10,
  },
  subtitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "85%",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
  },
    buttonContainer: {
    width: "85%",
  },
    signInButton: {
    backgroundColor: "#fff",
  },
  signUpButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2E1759",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#2E1759",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
