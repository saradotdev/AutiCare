import { StyleSheet } from "react-native";
import theme from "../../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  characterContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    margin: 16,
  },
  bubbleContainer: {
    position: "absolute",
    top: "50%",
    left: "40%",
    transform: [{ translateX: -100 }, { translateY: -100 }],
    width: 220,
    height: 200,
  },
  bubble: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  textOverlay: {
    width: "80%",
    height: "100%",
    transform: [{ translateX: 50 }, { translateY: 0 }],
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  bubbleText: {
    color: theme.colorSummerSky,
    fontSize: 20,
    fontFamily: theme.comicSansMS,
    textAlign: "center",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsHeading: {
    fontSize: 30,
    color: theme.colorSummerSky,
    fontFamily: theme.comicSansMS,
    textAlign: "center",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    backgroundColor: theme.colorSummerSky,
    width: "45%",
    height: 120,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px -3px 0px 0px rgba(0, 0, 0, 0.25) inset",
    borderColor: theme.colorWhite,
    borderWidth: 2,
    padding: 10,
  },
  optionText: {
    color: theme.colorWhite,
    fontSize: 20,
    fontFamily: theme.comicSansMS,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
