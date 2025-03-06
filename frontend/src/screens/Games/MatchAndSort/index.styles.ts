import { StyleSheet } from "react-native";

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
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  gameContainer: {
    flex: 1,
  },
  fallingObjects: {
    flex: 1,
    alignItems: "center",
  },
  fallingObject: {
    position: "absolute",
    top: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    flex: 1,
    paddingBottom: 10,
  },
});
