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

  headerRightColumn: {
    alignItems: "flex-end",
    justifyContent: "center",
    maxWidth: 140,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },


  tagPurpleSmall: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },

  tagPurpleTextSmall: {
    color: "#6B4CF6",
    fontSize: 10,
    fontWeight: "600",
  },

  tagGreenSmall: {
    backgroundColor: "#E8F9EF",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },

  tagGreenTextSmall: {
    color: "#0F6F3C",
    fontSize: 10,
    fontWeight: "600",
  },

  headerTagRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
    maxWidth: 120,  // prevents expanding
  },

  tagSmall: {
    backgroundColor: "#EFE9FF",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    maxWidth: 80,
  },

  tagSmallText: {
    color: "#6B4CF6",
    fontSize: 10,
    fontWeight: "600",
  },

  moreTagPill: {
    backgroundColor: "#ddd",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  moreTagText: {
    color: "#444",
    fontSize: 10,
    fontWeight: "600",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center",
  },

  modalTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 20,
  },

  modalTagBadge: {
    backgroundColor: "#EFEAFE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  modalTagText: {
    color: "#5A31F4",
    fontSize: 14,
    fontWeight: "500",
  },

  modalCloseBtn: {
    backgroundColor: "#5A31F4",
    paddingVertical: 10,
    borderRadius: 10,
  },

  modalCloseText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

});
