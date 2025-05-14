export function getFacialGameInstructions(
  age: string,
  level: number,
): string[] {
  // Default fallback
  const defaultInstructions = [
    "• Look at the picture of the child.\n",
    "• The child will show one of the expressions.\n",
    "• Choose the correct expression by tapping the matching option below the picture.\n",
    "• Try to pick the correct answer to score points!",
  ];

  if (age === "3-5") {
    if (level === 1)
      return [
        "• Look at the picture of the child.\n",
        "• The child will show either a happy or sad face.\n",
        "• Tap the option that matches how the child is feeling.\n",
        "• Try to pick the correct answer to score points!",
      ];
    if (level === 2)
      return [
        "• Look at the picture of the child.\n",
        "• The child may look happy, sad, or surprised.\n",
        "• Tap the emotion that matches the expression.\n",
        "• Try to pick the correct answer to score points!",
      ];
    if (level === 3)
      return [
        "• Look at the picture of the child.\n",
        "• The child may show happy, sad, surprised, or angry feelings.\n",
        "• Choose the matching emotion from the options.\n",
        "• Try to pick the correct answer to score points!",
      ];
  }

  if (age === "6-8") {
    if (level === 1)
      return [
        "• Look at the picture of the child.\n",
        "• They may be feeling happy, sad, angry, surprised, or confused.\n",
        "• Tap the correct emotion that matches the expression.\n",
        "• Try to pick the correct answer to score points!",
      ];
    if (level === 2)
      return [
        "• Look at the picture of the child.\n",
        "• Emotions shown can include happy, sad, angry, surprised, confused, or scared.\n",
        "• Pick the expression that best matches what you see.\n",
        "• Try to pick the correct answer to score points!",
      ];
    if (level === 3)
      return [
        "• Look at the picture of the child.\n",
        "• The child may show any basic emotion — some may look similar.\n",
        "• Select the emotion that fits best.\n",
        "• Try to pick the correct answer to score points!",
      ];
  }

  if (age === "9-12")
    return [
      "• Read the emotion word shown at the screen.\n",
      "• Look at the three facial expressions shown.\n",
      "• Tap the picture that best matches the emotion word.\n",
      "• Try to pick the correct answer to score points!",
    ];

  return defaultInstructions;
}
