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
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorSoftGrey,
  },
  today: {
    fontSize: 24,
  },
  date: {
    fontSize: 12,
    fontFamily: theme.poppinsLight,
    color: theme.colorDarkGrey,
  },
  sessionContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  sessionTime: {
    color: theme.colorSummerSky,
    fontSize: 24,
  },
  sessionText: {
    color: theme.colorDarkGrey,
    fontSize: 24,
    paddingVertical: 5,
  },
  progressBar: {
    height: 20,
    width: "100%",
    backgroundColor: theme.colorLightGrey,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colorSummerSky,
    borderRadius: 10,
  },
  reportContainer: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  reportTitle: {
    fontSize: 35,
    paddingBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: theme.colorSoftGrey,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  infoIcon: {
    backgroundColor: theme.colorBlue,
    padding: 5,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 20,
  },
  infoText: {
    fontSize: 16,
    color: theme.colorCharcoal,
    fontFamily: theme.poppinsLight,
  },
  cta: {
    backgroundColor: theme.colorSummerSky,
    width: "80%",
    alignSelf: "center",
  },
});
