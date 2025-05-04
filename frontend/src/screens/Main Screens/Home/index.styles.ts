import { StyleSheet } from "react-native";
import theme from "../../../../theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  changeTab: {
    width: 170,
    backgroundColor: theme.colorLightGrey,
    marginTop: 40,
    marginLeft: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "82%",
    backgroundColor: theme.colorWhite,
    padding: 20,
    borderRadius: 50,
  },
  modalCloseButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: theme.colorLightCrimson,
    borderRadius: 50,
    padding: 10,
  },
  modalTitle: {
    fontSize: 35,
    paddingBottom: 10,
    textAlign: "center",
    paddingTop: 50,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    color: theme.colorMediumGrey,
    paddingBottom: 40,
  },
  modalSubText: {
    fontSize: 18,
    color: theme.colorMediumGrey,
    paddingBottom: 30,
  },
  code: {
    fontSize: 24,
    color: theme.colorSummerSky,
    paddingBottom: 20,
  },
  input: {
    borderColor: theme.colorSummerSky,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 10,
    width: "100%",
    height: 50,
    fontFamily: theme.ibrand,
    fontSize: 30,
    textAlign: "center",
    textAlignVertical: "center",
  },
  keypadContainer: {
    alignSelf: "center",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  key: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 25,
    width: 40,
    height: 35,
  },
  keyText: {
    fontSize: 35,
    color: theme.colorDarkGrey,
  },
});
