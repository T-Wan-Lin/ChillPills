import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import CustomButton from '../Components/CustomButton';
import BackgroundTimer from 'react-native-background-timer';
import CustomInput from '../Components/CustomInput';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
const BreakTimer = () => {
  const onselected = () => {
    console.warn('Go to Music Page');
  };
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [secondsRemaining, setSecondsRemaining] = useState();
  const [timerOn, setTimerOn] = useState(false);
  let user = firebase.auth().currentUser;
  useEffect(() => {
    if (timerOn) {
      startTimer();
      setSecondsRemaining(secondsLeft);
    } else {
      BackgroundTimer.stopBackgroundTimer();
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerOn]);

  useEffect(() => {
    if (secondsLeft === 0) {
      const coins = addChillCoins(secondsRemaining);
      console.log(coins);

      BackgroundTimer.stopBackgroundTimer();
      const updatecoins = async () => {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            chillCoins: firebase.firestore.FieldValue.increment(coins),
          });
      };
      updatecoins();

      console.log('added coins');
    }

  }, [secondsLeft]);

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft(secs => {
        if (secs > 0) {
          return secs - 1;
        } else {
          return 0;
        }
      });
    }, 1000);
  };
  const clockify = () => {
    let mins = Math.floor(secondsLeft / 60);
    let seconds = Math.floor(secondsLeft % 60);
    let displayMins = mins < 10 ? `0${mins}` : mins;
    let displaySecs = seconds < 10 ? `0${seconds}` : seconds;
    return {
      displayMins,
      displaySecs,
    };
  };
  const handleInput = text => {
    const currValue = parseInt(text, 10);
    if (currValue < 600) {
      setSecondsLeft(600);
    } else if (currValue > 1800) {
      setSecondsLeft(1800);
    } else if (isNaN(currValue)) {
      setSecondsLeft(0);
    } else {
      setSecondsLeft(currValue);
    }
    console.log(secondsLeft);
  };

  const addChillCoins = value => {
    let coins;
    if (value <= 1020) {
      coins = Math.ceil(2 * (value / 60));
    } else if (value > 1020) {
      coins = Math.ceil(value / 60);
    }

    return coins;
  };

  return (
    <View style={styles.root}>
      <CustomInput
        placeholder="Key in your preferred time duration in sec"
        value={secondsLeft}
        setValue={text => handleInput(text)}
        keyboardType="numeric"
      />
      <Text> </Text>
      <Text> </Text>
      <Text style={styles.title}> It is time to unwind 🥳: </Text>
      <Text> </Text>
      <Text style={styles.timer}>
        {' '}
        {clockify().displayMins} Mins {clockify().displaySecs} Secs{' '}
      </Text>
      <Text style={styles.description}>
        ⏳ Hot Tip: Set it between 10-17 minutes for double the amount of
        chillcoins per min! Remember that 30 minutes at a time is the maximum
        duration recommended.
      </Text>
      <CustomButton
        text="Start/Stop"
        onPress={() => setTimerOn(current => !current)}
      />
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
      <Text style={styles.description}> Listen to music in the meantime!</Text>
      <CustomButton text="To Spotify" onPress={() => {Linking.openURL('https://open.spotify.com/')}} />
    </View>
  );
};
export default BreakTimer;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'justify',
    //justifyContent: 'center',
    padding: 50,
    backgroundColor: '#FCF6E2',
  },
  title: {
    fontSize: 27,
    fontFamily: 'Futura',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  timer: {
    fontSize: 30,
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Futura',
    fontStyle: 'italic',
  },
});
