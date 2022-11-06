import { Center, Icon, Text } from 'native-base';
import { Fontisto } from '@expo/vector-icons';

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export function SignIn() {
  const { signIn } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />

      <Button 
        type='SECONDARY'
        title='ENTRAR COM O GOOGLE' 
        leftIcon={<Icon as={Fontisto} color="white" name="google" size="sm"/>}
        mt={12}
        onPress={signIn}
      />

      <Text color="white" mt={4} textAlign="center">
        Não utilizamos nenhuma informação além do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  )
}