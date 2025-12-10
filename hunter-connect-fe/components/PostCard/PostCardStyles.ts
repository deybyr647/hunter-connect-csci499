import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  /* Post Card */
  post: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    marginRight: 10,
  },

  username: {
    fontWeight: "600",
    fontSize: 16,
    color: "#222",
  },

  timestamp: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  postTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222",
  },

  content: {
    fontSize: 15,
    marginBottom: 12,
    color: "#444",
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    gap: 15,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  likeText: {
    color: "#555",
    fontSize: 14,
  },

  /* Tags */
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 8,
  },

  tagPurple: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },

  tagPurpleText: {
    color: "#6B4CF6",
    fontSize: 12,
    fontWeight: "600",
  },

  tagGreen: {
    backgroundColor: "#E8F9EF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },

  tagGreenText: {
    color: "#0F6F3C",
    fontSize: 12,
    fontWeight: "600",
  },

  remove: {
    color: "#999",
    marginLeft: 4,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  cardDetail: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
  },
});

export default styles;
