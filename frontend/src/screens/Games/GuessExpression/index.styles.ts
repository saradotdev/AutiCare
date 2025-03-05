import { StyleSheet } from "react-native";
import theme from "../../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    width: 100,
    backgroundColor: theme.colorSummerSky,
    borderColor: theme.colorWhite,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 250,
    height: 350,
    backgroundColor: theme.colorWhite,
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "-5px -8px 3.7px 0px rgba(0, 132, 255, 0.25) inset",
  },
  modalText: {
    fontSize: 45,
    textAlign: "center",
    color: theme.colorSummerSky,
  },
});
