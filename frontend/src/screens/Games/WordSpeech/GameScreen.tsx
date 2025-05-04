import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import theme from '../../../../theme';
import ConfettiCannon from 'react-native-confetti-cannon';
import { MyModal } from '../../../components';

// Import the SVGs
import KidSvg from '../../../assets/images/games/WordSpeech/Kid.svg';
import WordBgSvg from '../../../assets/images/games/WordSpeech/WordBg.svg';

const { width, height } = Dimensions.get('window');

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { level } = route.params as { level: number };
  const confettiRef = useRef<any>();

  // Words for each level - this can be expanded with more words per level
  const levelWords: Record<number, string[]> = {
    1: ['EAT', 'CAT', 'DOG'],
    2: ['BALL', 'BOOK', 'PLAY'],
    3: ['HAPPY', 'HELLO', 'SMILE'],
    4: ['WATER', 'JUICE', 'DRINK'],
    5: ['THANK YOU', 'PLEASE', 'HELP'],
    6: ['I WANT', 'I LIKE', 'I NEED'],
    7: ['GOOD JOB', 'WELL DONE', 'GREAT'],
  };

  // Current word index for the level
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const words = levelWords[level] || ['EAT'];
  const currentWord = words[currentWordIndex];

  const handleNext = () => {
    // Show the success banner
    showSuccessBanner();
  };

  const showSuccessBanner = () => {
    setModalVisible(true);
    confettiRef.current?.start();
    
    // Wait for the banner to be displayed for 2 seconds before proceeding
    setTimeout(() => {
      setModalVisible(false);
      proceedToNextWord();
    }, 2000);
  };

  const proceedToNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // If we've reached the end of words for this level, go back to level selection
      navigation.goBack();
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={theme.colorSummerSky} />
            </TouchableOpacity>
            <Text style={styles.title}>Level {level}</Text>
            <View style={{ width: 30 }} />
          </View>

          {/* Main content */}
          <View style={styles.content}>
            <Text style={styles.promptText}>Can you say?</Text>
            
            <View style={styles.gameArea}>
              {/* Kid SVG */}
              <View style={styles.kidContainer}>
                <KidSvg width={width * 0.4} height={height * 0.4} />
              </View>
              
              {/* Word Bubble */}
              <View style={styles.wordBubbleContainer}>
                <WordBgSvg width={width * 0.5} height={height * 0.2} />
                <Text style={styles.wordText}>{currentWord}</Text>
              </View>
            </View>
            
            {/* Next button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>

          {/* Success Modal */}
          <MyModal
            visible={modalVisible}
            text={"yay!!\nExcellent"}
            onClose={() => setModalVisible(false)}
          />

          {/* Confetti animation */}
          <ConfettiCannon
            ref={confettiRef}
            count={50}
            origin={{ x: width / 2, y: -30 }}
            autoStart={false}
            fadeOut={true}
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colorWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: theme.poppinsRegular,
    color: '#F5B94E',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  promptText: {
    fontSize: 32,
    fontFamily: theme.poppinsBold,
    color: '#F5B94E',
    marginTop: 10,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  gameArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flex: 1,
  },
  kidContainer: {
    position: 'relative',
    left: -10,
  },
  wordBubbleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wordText: {
    position: 'absolute',
    fontSize: 32,
    fontFamily: theme.poppinsBold,
    color: theme.colorCharcoal,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: theme.colorSummerSky,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 30,
    width: '90%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: theme.colorWhite,
    fontSize: 22,
    fontFamily: theme.poppinsBold,
  },
});

export default GameScreen; 