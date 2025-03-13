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
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    width: 100,
    fontFamily: theme.comicSansMS,
    backgroundColor: theme.colorSummerSky,
    borderColor: theme.colorWhite,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
