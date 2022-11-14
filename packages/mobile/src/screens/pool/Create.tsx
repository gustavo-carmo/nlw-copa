import { Heading, VStack, Text, useToast } from "native-base";

import Logo from '../../assets/logo.svg';

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useCallback, useState } from "react";
import { api } from "../../services/api";

export function CreatePool () {
  const [poolTitle, setPoolTitle] = useState('');
  const [isLoading, setIsloading] = useState(false);

  const toast = useToast();

  const handleSubmit = useCallback(async () => {
    

    if (!poolTitle.trim()) {
      return toast.show({
        description: 'Por favor insira um titulo para o seu bolão!',
        backgroundColor: 'red.500',
        placement: 'top',
      });
    }

    try {
      setIsloading(true);

      await api.post('/pools', { title: poolTitle });

      toast.show({
        description: 'Bolão criado com sucesso!',
        backgroundColor: 'green.500',
        placement: 'top',
      });

      setPoolTitle('');
    } catch (err) {
      console.error(err);
      toast.show({
        description: 'Ops, algum erro inesperado aconteceu, por favor tente novamente',
        backgroundColor: 'red.500',
        placement: 'top'
      });
    } finally {
      setIsloading(false);
    }
  }, [poolTitle]);

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </Heading>

        <Input mb={2} placeholder="Qual o nome do seu bolão?" value={poolTitle} onChangeText={setPoolTitle} autoCapitalize="characters" />

        <Button title="CRIAR MEU BOLÃO" onPress={handleSubmit} isLoading={isLoading}/>
        <Text color="gray.200" fontSize="sm" textAlign="center" mt={4} px={10}>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.</Text>
      </VStack>
    </VStack>
  )
}