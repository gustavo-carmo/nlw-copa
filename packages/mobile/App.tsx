import React from 'react';
import { Box, NativeBaseProvider, StatusBar } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { THEME } from './src/styles/theme';
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthProvider>
        <Box flex={1} bg="gray.900">
          <StatusBar 
            barStyle="light-content"
            backgroundColor="transparent"
            translucent        
          />
          
          {fontsLoaded ? <Routes /> : <Loading /> }
        </Box>
      </AuthProvider>
    </NativeBaseProvider>
  );
}
