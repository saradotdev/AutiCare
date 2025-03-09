import React from "react";
import { StyleSheet, View } from "react-native";
import { MyText } from "../MyText";
import theme from "../../../theme";
import { ScoreCardProps } from "../../types";

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, total }) => {
  return (
    <View style={styles.container}>
      <MyText style={styles.scoreHeading}>
        Score:{" "}
        <MyText style={styles.score}>
          {"0" + score.toLocaleString()}/{"0" + total.toLocaleString()}
        </MyText>
      </MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    marginTop: 35,
    marginBottom: 10,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  scoreHeading: {
    fontFamily: theme.comicSansMS,
    width: 180,
    color: theme.colorSummerSky,
    fontSize: 22,
    borderWidth: 3,
    borderColor: theme.colorSummerSky,
    borderRadius: 50,
    padding: 10,
    textAlign: "center",
  },
  score: {
    fontFamily: theme.comicSansMS,
    color: theme.colorDarkGrey,
  },
});

export default ScoreCard;
