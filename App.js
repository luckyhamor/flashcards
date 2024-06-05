import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

const FlashcardApp = () => {
  const [data, setData] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isGermanToEnglish, setIsGermanToEnglish] = useState(true);
  const [timer, setTimer] = useState(60);
  const [intervalId, setIntervalId] = useState(null); // Added state for interval ID
  const [isNextBtnHeight, setIsNextBtnHeight] = useState(false); // Added state for next button height

  // Fetch data function
  const fetchData = async (file) => {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/luckyhamor/flashcards/main/${file}`);
      const jsonData = await response.json();
      setData(jsonData);
      setCurrentCardIndex(0);
      shuffleData();
      startTimer();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Load initial data
    fetchData('words.json');
    return () => clearInterval(intervalId); // Clear interval when unmounting
  }, []);

  // Show card function
  const showCard = () => {
    const card = data[currentCardIndex];
    if (card) {
      return isGermanToEnglish ? card.question : card.answer;
    }
    return 'Loading...';
  };

  // Shuffle data function
  const shuffleData = () => {
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
  };

  // Next card function
  const nextCard = () => {
    if (currentCardIndex < data.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      startTimer();
    } else {
      setCurrentCardIndex(0);
      stopTimer();
    }
  };

  // Start timer function
  const startTimer = () => {
    setTimer(20); // Change timer to 20 seconds
    clearInterval(intervalId); // Clear previous interval
    const id = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        } else {
          nextCard(); // Move to next card automatically when timer reaches 0
          return 20; // Reset timer to 20 seconds
        }
      });
    }, 1000);
    setIntervalId(id); // Save interval ID
  };

  // Stop timer function
  const stopTimer = () => {
    setTimer(20);
    clearInterval(intervalId); // Clear interval
  };

  // Read card content function
  const readCardContent = () => {
    const textToRead = showCard();
    Speech.speak(textToRead, { language: 'de-DE' });
  };

  // Toggle card function
  const toggleCard = () => {
    setIsGermanToEnglish(!isGermanToEnglish);
  };

  // Updated styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F0F0F0',
    },
    levelContainer: {
      alignItems: 'center',
      marginBottom: 20,
      paddingVertical: 10, // Add padding
      marginTop: 100, // Adjust margin top
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      maxWidth: 600,
    },
    btn: {
      padding: 10,
      margin: 5, // Add margin
      backgroundColor: '#153448',
      borderRadius: 10,
    },
    btnText: {
      color: '#fff',
      fontSize: 16,
    },
    flashcard: {
      width: '90%',
      maxWidth: 600,
      position: 'relative',
      marginBottom: 20,
    },
    timer: {
      fontSize: 24,
      color: '#333',
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
    card: {
      width: '100%',
      height: 200,
      position: 'relative',
      backgroundColor: isGermanToEnglish ? '#fff' : '#ccc', // Change color based on isGermanToEnglish
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      justifyContent: 'center',
      alignItems: 'center', // Center text horizontally and vertically
    },
    cardText: {
      fontSize: 24,
      textAlign: 'center',
    },
    readBtn: {
      width: 40,
      height: 40,
      backgroundColor: '#153448',
      borderRadius: 20,
      position: 'absolute',
      bottom: 10,
      right: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    readBtnIcon: {
      color: '#fff',
    },
    nextBtnContainer: {
      width: '100%',
      maxWidth: 600,
      marginTop: 70, // Move next button to top
      marginBottom: 'auto',
      paddingHorizontal: 20, // Add horizontal padding
    },
    nextBtn: {
      height: 80, // Add height
      paddingVertical: 10, // Updated padding
      backgroundColor: '#153448', // Fixed color
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nextBtnText: {
      color: '#fff',
      fontSize: 20,
    },
  });

  // Render function
  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={() => fetchData('words.json')}>
            <Text style={styles.btnText}>Level 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => fetchData('phrase.json')}>
            <Text style={styles.btnText}>Level 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => fetchData('sentence.json')}>
            <Text style={styles.btnText}>Level 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => fetchData('conversation.json')}>
            <Text style={styles.btnText}>Level 4</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.flashcard}>
        <Text style={styles.timer}>{timer > 9 ? `${timer}` : `${timer}`}</Text>
        <TouchableOpacity style={styles.card} onPress={toggleCard}>
          <Text style={styles.cardText}>{showCard()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.readBtn} onPress={readCardContent}>
          {/* Add icon for read button */}
          <Text style={styles.readBtnIcon}>🔊</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.nextBtnContainer}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={nextCard}
          onPressIn={() => setIsNextBtnHeight(true)}
          onPressOut={() => setIsNextBtnHeight(false)}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlashcardApp;
