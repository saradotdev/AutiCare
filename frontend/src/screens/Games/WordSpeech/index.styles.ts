import { StyleSheet } from "react-native";
import theme from "../../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: theme.poppinsRegular,
    color: "#F5B94E",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: theme.poppinsRegular,
    color: theme.colorCharcoal,
    textAlign: "center",
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    position: "relative",
  },
  levelsContainer: {
    flex: 1,
    position: "relative",
  },
  pathContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  levelButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  lockedLevel: {
    backgroundColor: theme.colorLightGrey,
  },
  levelText: {
    color: theme.colorWhite,
    fontSize: 24,
    fontFamily: theme.poppinsRegular,
  },
});
