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
    padding: 16,
  },
  durationStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationCard: {
    backgroundColor: theme.colorSummerSky,
    width: "48%",
    height: 120,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  durationTitle: {
    color: theme.colorWhite,
    fontSize: 20,
  },
  durationValue: {
    fontSize: 20,
    color: theme.colorWhite,
    backgroundColor: theme.colorBlue,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
