import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

//form validation
import * as Yup from 'yup';
import { Formik } from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Clipboard from '@react-native-clipboard/clipboard';


const pwdscheme = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'Password must be "Minimum" 5 Characters')
    .max(16, 'Password must be "Maximum" 16 Characters')
    .required('Length is Required!'),
});

export default function App() {
  const [Password, setPassword] = useState('');
  const [isPasswordGenerated, setisPasswordGenerated] = useState(false);

  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const generatePasswordString = (passwordLength: number) => {
    let characterList = '';
    const upperCaseChars = 'ABCDEFGUJKLMNOPRSTUVYZXWQ';
    const lowerCaseChars = 'abcdefgujklmnoprstuvyzxwq';
    const digitChars = '1234567890';
    const specialChars = '!@.,:#$();?=*-_';

    if (upperCase) characterList += upperCaseChars;
    if (lowerCase) characterList += lowerCaseChars;
    if (numbers) characterList += digitChars;
    if (symbols) characterList += specialChars;

    const passwordResult = createPassword(characterList, passwordLength);
    setPassword(passwordResult);
    setisPasswordGenerated(true);
  };

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  };

  const resetPasswordState = () => {
    setPassword('');
    setisPasswordGenerated(false);
    setLowerCase(false);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
 
          <Text style={styles.title}>Password Generator</Text>

          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={pwdscheme}
            onSubmit={(values) => {
              generatePasswordString(+values.passwordLength);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleReset,
              isValid,
              handleSubmit,
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View>
                    <Text style={styles.heading}>Password Length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>
                        {errors.passwordLength}
                      </Text>
                    )}
                       <TextInput
                        style={styles.inputStyle}
                        value={values.passwordLength}
                        onChangeText={text => {
                          // Yalnızca sayıları kabul et
                          if (/^[0-9]*$/.test(text)) {
                            handleChange('passwordLength')(text);  // Sayı geçerliyse, güncelle
                          }
                        }}
                        placeholder="Ex. 8"
                        keyboardType="numeric"
                      />  
                  </View>
                </View>

                {/* Checkbox Options */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Lowercase</Text>
                  <BouncyCheckbox
                    isChecked={lowerCase}
                    onPress={() => setLowerCase(!lowerCase)}
                    fillColor="#29ab87" 
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Uppercase</Text>
                  <BouncyCheckbox
                    isChecked={upperCase}
                    onPress={() => setUpperCase(!upperCase)}
                    fillColor="#29ab87"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Numbers</Text>
                  <BouncyCheckbox
                    isChecked={numbers}
                    onPress={() => setNumbers(!numbers)}
                    fillColor="#29ab87"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Symbols</Text>
                  <BouncyCheckbox
                    isChecked={symbols}
                    onPress={() => setSymbols(!symbols)}
                    fillColor="#29ab87"
                  />
                </View>

                <TouchableOpacity disabled= {!isValid} onPress={handleSubmit}>
                  <Text style={styles.buttonStyle}>Generate Password</Text>
                </TouchableOpacity>


                   
                <TouchableOpacity  onPress={resetPasswordState}>
                  <Text style={styles.buttonStyle}>Reset</Text>
                </TouchableOpacity>
                
                
                { isPasswordGenerated ? (
                   <View>
                    <TouchableOpacity onLongPress={ () => {
                      Clipboard.setString(Password);
                      Alert.alert('Copied', 'Password copied to clipboard!');
                    } }>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, marginTop: 20 }}> {Password}</Text>
                          
                    
                    </TouchableOpacity>
                    <Text style={{ marginTop: 15, color: 'white', textAlign: 'center' }}>
                    {Password ? "Long Press to Copy" : "Select at least 1 condition"} 
                    </Text>
                    </View>
          ) : null
        }
              </>
            )}
          </Formik>
        </View>
      
      </SafeAreaView>
    
      
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: '#121212',
    minHeight: '100%',


  },
  formContainer: {
    backgroundColor: '#1e1e2f',
    padding: 20,
    flex: 1,

  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
     color: 'white',
     marginEnd: 5,
  },
  heading: {
    fontSize: 18,
    color: 'white',
  },
  inputStyle: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    fontSize: 18,
    marginTop: 25,
    padding: 8,
    width: 150,
  },
  buttonStyle: {
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#29ab87',
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
