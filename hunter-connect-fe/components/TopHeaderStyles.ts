import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
    position: "relative",
    zIndex: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: 25,
    right: -10,
    width: 220,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 30,
  },
  dropdownHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 10,
  },
  dropdownName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  dropdownEmail: {
    fontSize: 13,
    color: "#555",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#333",
  },
  signOutText: {
    fontSize: 15,
    color: "red",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});