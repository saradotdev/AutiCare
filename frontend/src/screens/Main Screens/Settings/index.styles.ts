import { StyleSheet } from "react-native";
import theme from "../../../../theme";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 35,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorSoftGrey,
  },
  title: {
    color: theme.colorCharcoal,
    textAlign: "center",
    fontSize: 35,
  },
  changeTab: {
    width: "40%",
    backgroundColor: theme.colorSummerSky,
    marginVertical: 0,
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: theme.colorWhite,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorSoftGrey,
  },
  optionTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    width: 30,
    alignItems: "center",
    marginRight: 10,
  },
  optionText: {
    color: theme.colorDarkGrey,
    fontSize: 14,
  },
});
