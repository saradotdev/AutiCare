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
    width: "48%",
    height: 120,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  text: {
    color: theme.colorWhite,
    fontSize: 20,
  },
  textBackground: {
    fontSize: 20,
    color: theme.colorWhite,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  gameStatsCard: {
    marginTop: 16,
    borderRadius: 20,
    justifyContent: "space-between",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subText: {
    color: theme.colorWhite,
    fontSize: 18,
  },
  subTextBackground: {
    fontSize: 18,
    color: theme.colorWhite,
    borderRadius: 10,
    paddingVertical: 5,
    marginVertical: 5,
    width: 80,
    textAlign: "center",
  },
});
