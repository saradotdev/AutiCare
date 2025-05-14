export function getMatchAndSortGameInstructions(
  age: string,
  level: number,
): string[] {
  // Default fallback
  const defaultInstructions = [
    "• Look at the buckets shown.\n",
    "• Colored objects will fall from the top.\n",
    "• Swipe the object towards the correct bucket to score.\n",
    "• Score 8 points to finish the game.",
  ];

  if (age === "3-5") {
    if (level === 1)
      return [
        "• Look at the 2 buckets shown.\n",
        "• Colored objects will fall from the top.\n",
        "• Swipe the object towards the correct color bucket to score.\n",
        "• Score 8 points to finish the game.",
      ];
    if (level === 2)
      return [
        "• Look at the 3 buckets shown.\n",
        "• Colored objects will fall from the top.\n",
        "• Swipe the object towards the correct color bucket to score.\n",
        "• Score 8 points to finish the game.",
      ];
    if (level === 3)
      return [
        "• Look at the 4 buckets shown.\n",
        "• Colored objects will fall from the top.\n",
        "• Swipe the object towards the correct color bucket to score.\n",
        "• Score 8 points to finish the game.",
      ];
  }

  if (age === "6-8") {
    if (level === 1)
      return [
        "• Look at the 2 buckets shown.\n",
        "• Different shapes will fall from the top.\n",
        "• Swipe the object towards the correct shape bucket to score.\n",
        "• Score 8 points to finish the game.",
      ];
    if (level === 2)
      return [
        "• Look at the 3 buckets shown.\n",
        "• Different shapes will fall from the top.\n",
        "• Swipe the object towards the correct shape bucket to score.\n",
        "• Score 8 points to finish the game.",
      ];
    if (level === 3)
      return [
        "• Look at the 4 buckets shown.\n",
        "• Different shapes will fall from the top.\n",
        "• Swipe the object towards the correct shape bucket to score.\n",
        "• Score 8 points to finish the game.",
      ];
  }

  if (age === "9-12")
    if (level === 1)
      return [
        "• Look at the 2 buckets shown.\n",
        "• Colored shapes will fall from the top.\n",
        "• Swipe the object towards the correct colored shape bucket to score.\n",
        "• Score 8 points to finish the game.",
      ];
  if (level === 2)
    return [
      "• Look at the 3 buckets shown.\n",
      "• Colored shapes will fall from the top.\n",
      "• Swipe the object towards the correct colored shape bucket to score.\n",
      "• Score 8 points to finish the game.",
    ];
  if (level === 3)
    return [
      "• Look at the 4 buckets shown.\n",
      "• Colored shapes will fall from the top.\n",
      "• Swipe the object towards the correct colored shape bucket to score.\n",
      "• Score 8 points to finish the game.",
    ];

  return defaultInstructions;
}
