export const getSkillsPracticed = (
  gameCode: string,
  difficulty: number | string,
  age: string,
): string[] => {
  const level = parseInt(difficulty.toString());

  switch (gameCode) {
    case "FACIAL":
      if (age === "3-5") {
        if (level === 1)
          return [
            "Recognizing happy and sad faces",
            "Matching expressions to labels",
            "Understanding basic emotions through visuals",
          ];
        if (level === 2)
          return [
            "Identifying happy, sad, and surprised faces",
            "Learning new emotions gradually",
            "Improving attention to facial changes",
          ];
        if (level === 3)
          return [
            "Spotting happy, sad, surprised, and angry expressions",
            "Improving emotional vocabulary",
            "Distinguishing between similar feelings",
          ];
      } else if (age === "6-8") {
        if (level === 1)
          return [
            "Recognizing happy, sad, angry, surprised, and confused expressions",
            "Understanding a wider range of emotions",
            "Matching emotions with real-life situations",
          ];
        if (level === 2)
          return [
            "Identifying happy, sad, angry, surprised, confused, and fear",
            "Strengthening focus and observation",
            "Connecting feelings to social cues",
          ];
        if (level === 3)
          return [
            "Recognizing all basic facial expressions",
            "Analyzing differences between subtle emotions",
            "Enhancing empathy and perspective-taking",
          ];
      } else if (age === "9-12") {
        if (level === 1)
          return [
            "Identifying key facial expressions (happy, sad, angry)",
            "Learning to choose correct expressions from distractors",
            "Practicing emotional reasoning with limited cues",
          ];
        if (level === 2)
          return [
            "Recognizing expressions like happy, sad, angry, surprise and confused",
            "Distinguishing emotions among mixed options",
            "Applying emotional understanding to context",
          ];
        if (level === 3)
          return [
            "Differentiating complex expressions",
            "Choosing the most accurate emotion in subtle scenarios",
            "Practicing deeper emotional analysis with full sets",
          ];
      }
      return ["Practicing emotion recognition"];

    case "MATCHSORT":
      if (age === "3-5") {
        if (level === 1)
          return [
            "Sorting objects based on basic colors",
            "Using 2 buckets to keep choices simple",
            "Practicing slow-paced categorization",
          ];
        if (level === 2)
          return [
            "Color-based sorting with more variety",
            "Managing 3 color buckets with increased challenge",
            "Reacting to medium-speed object drops",
          ];
        if (level === 3)
          return [
            "Advanced color sorting with similar shades",
            "Using 4 buckets to boost sorting accuracy",
            "Improving reflexes with faster falling objects",
          ];
      } else if (age === "6-8") {
        if (level === 1)
          return [
            "Sorting objects by basic shapes (circle, square, etc.)",
            "Introducing 2 shape buckets for easier practice",
            "Developing focus at a slow game speed",
          ];
        if (level === 2)
          return [
            "Shape-based sorting with added complexity",
            "Using 3 buckets to encourage flexible thinking",
            "Handling faster drop speeds with precision",
          ];
        if (level === 3)
          return [
            "Sorting tricky shapes with minimal differences",
            "Using 4 buckets for detailed visual sorting",
            "Sharpening quick decision-making with fast gameplay",
          ];
      } else if (age === "9-12") {
        if (level === 1)
          return [
            "Sorting objects by both shape and color",
            "Starting with 2 buckets to build foundational skills",
            "Focusing on slower object drop timing",
          ];
        if (level === 2)
          return [
            "Multi-attribute sorting (color + shape) with 3 buckets",
            "Practicing accuracy with moderate game speed",
            "Enhancing attention to dual characteristics",
          ];
        if (level === 3)
          return [
            "Advanced sorting with complex combinations of shape and color",
            "Using 4 buckets for high-level challenge",
            "Mastering fast-paced matching under time pressure",
          ];
      }
      return ["Practicing categorization"];

    case "SOCIAL":
      if (age === "3-5")
        return [
          "Learning how to respond to greetings and introductions",
          "Practicing kind responses like saying hello or sharing",
          "Understanding simple social cues and polite behavior",
        ];
      if (age === "6-8")
        return [
          "Practicing sharing, turn-taking, and friendly conversations",
          "Reacting politely when asked for something",
          "Building confidence in everyday social interactions",
        ];
      if (age === "9-12")
        return [
          "Handling more emotional or tricky situations (e.g., exclusion, arguments)",
          "Solving problems respectfully and with empathy",
          "Improving communication during group and peer conflicts",
        ];
      return ["Practicing social responses"];

    default:
      return ["Skill data not available"];
  }
};
