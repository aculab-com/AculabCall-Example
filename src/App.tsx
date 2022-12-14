import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { styles, COLOURS } from './styles';
import AcuCall from './AcuCall';
import { RegisterScreen } from './RegisterScreen';

const Stack = createNativeStackNavigator();

function AculabCallScreen({ route }: any) {
  const {
    webRTCAccessKey,
    cloudRegionId,
    logLevel,
    registerClientId,
    webRTCToken,
  } = route.params;
  return (
    <View style={styles.container}>
      <AcuCall
        webRTCAccessKey={webRTCAccessKey}
        cloudRegionId={cloudRegionId}
        logLevel={logLevel}
        registerClientId={registerClientId}
        webRTCToken={webRTCToken}
      />
    </View>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: 'Registration',
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: COLOURS.BACKGROUND },
        }}
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AculabCall"
        component={AculabCallScreen}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <AppStack />
    </NavigationContainer>
  );
};

export default App;
