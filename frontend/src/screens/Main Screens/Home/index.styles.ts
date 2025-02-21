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
});
