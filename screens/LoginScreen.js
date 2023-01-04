import React, {useState} from 'react';
import {View, StyleSheet, Image, useWindowDimensions} from 'react-native';
import Logo from '../assets/loginLogo.png';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  //var registereduser = await auth().createUserWithEmailAndPassword('aatmikalakshmi123@gmail.com', 'hJ21236789');

  //navigation.navigate('Home');
  const onLoginPressed = () => {
    //console.warn("Log In");
    //validate user
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection('users');
        usersRef
          .doc(uid)
          .get()
          .then(firestoreDocument => {
            if (!firestoreDocument.exists) {
              alert('User does not exist anymore.');
              return;
            }
            const user = firestoreDocument.data();
            if (user.petimage === 'uninitialized') {
              navigation.navigate('Choose A Pet!');
            } else {
              navigation.navigate('Drawer', {
                screen: 'Home',
                params: {coins: user.chillCoin},
              });
            }
          })
          .catch(error => {
            alert(error);
          });
      })
      .catch(error => {
        alert(error);
      });
  };
  const onForgetPressed = () => {
    navigation.navigate('ResetPasswordScreen');
  };

  const onSignUpPressed = () => {
    navigation.navigate('Sign Up');
  };

  return (
    <View style={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, {height: height * 0.5}]}
        resizeMode="contain"
      />

      <CustomInput placeholder="Email" value={email} setValue={setEmail} />

      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={true}
      />

      <CustomButton text="Log in" onPress={onLoginPressed} />

      <CustomButton
        text="Forgot Password?"
        onPress={onForgetPressed}
        type="TERTIARY"
      />

      <CustomButton
        text="First-time user? Create an Account!"
        onPress={onSignUpPressed}
        type="TERTIARY"
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#FCF6E2',
  },
  logo: {
    width: '70%',
    maxWidth: 150,
    maxHeight: 150,
  },
});
