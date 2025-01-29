import { StyleSheet } from "react-native";
import theme from "../../../theme";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  main: {
    color: theme.colorWhite,
    fontWeight: 400,
    fontSize: 35,
  },
  sub: {
    color: theme.colorWhite,
    fontFamily: theme.poppinsRegular,
    fontSize: 14,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: theme.colorOrangeRed,
    borderRadius: 50,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  googleButtonText: {
    color: theme.colorWhite,
    textAlignVertical: "center",
    fontSize: 18,
    flex: 1,
  },
  emailButton: {
    backgroundColor: theme.colorWhite,
    borderRadius: 50,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emailButtonText: {
    color: theme.colorSummerSky,
    textAlignVertical: "center",
    fontSize: 18,
    flex: 1,
  },
  icon: {
    paddingHorizontal: 15,
  },
  signInButton: {
    fontSize: 18,
    color: theme.colorWhite,
    textDecorationLine: "underline",
  },
});

export default styles;
