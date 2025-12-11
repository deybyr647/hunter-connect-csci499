import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,

    // 👇 Reddit-style center column
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",

    borderWidth: 1,
    borderColor: "#dcdcdc",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1b",
    marginRight: 6,   
  },

  timestamp: {
    fontSize: 12,
    color: "#7c7c7c",
  },


  /* TITLE */
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1b",
    marginBottom: 6,
  },

  /* CONTENT */
  body: {
    fontSize: 14,
    color: "#1c1c1c",
    marginBottom: 14,
    lineHeight: 20,
  },

  /* LOCATION */
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#d9534f",
  },

  /* TAGS */
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  tagPurple: {
    backgroundColor: "#ede9ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  tagPurpleText: {
    color: "#5A31F4",
    fontWeight: "600",
    fontSize: 12,
  },
  tagGreen: {
    backgroundColor: "#def7e6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  tagGreenText: {
    color: "#2f9e5c",
    fontWeight: "600",
    fontSize: 12,
  },

  /* FOOTER (Reddit-style action bar) */
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ededed",
    paddingTop: 10,
  },
  footerBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 22,
  },
  footerBtnText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#7c7c7c",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "rgba(90, 49, 244, 0.15)", // lavender
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationTextSmall: {
    marginLeft: 4,
    fontSize: 12,
    color: "#e34d4d",
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5A31F4", // purple initial
  },

  dot: {
    marginHorizontal: 4,
    color: "#7c7c7c",
    fontSize: 12,
  },

  commentPill: {
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  commentPillText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
  },

});
