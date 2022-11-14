import { Heading, useToast, VStack } from "native-base";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useState } from "react";
import { api } from "../../services/api";
import { useNavigation } from "@react-navigation/native";

export function FindPool () {
  const toast = useToast();
  const { navigate } = useNavigation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [poolCode, setPoolCode] = useState('');


  async function handlePoolSearch() {
    try {
      setIsLoading(true);

      await api.post('pools/join', {
        code: poolCode
      });

      toast.show({
        placement: 'top',
        description: 'Você entrou no bolão.',
        bgColor: 'green.500'
      });

      setPoolCode('');
      setIsLoading(false);

      return navigate('list_pool')
    } catch (error: any) {

      console.log("Error: ", error);
      if (error?.response?.data?.message === 'You already joined this pool.') {
        toast.show({
          placement: 'top',
          description: 'Você já esta participando do bolão.',
          bgColor: 'red.500'
        });
      }
      
      toast.show({
        placement: 'top',
        description: 'Bolão não encontrado',
        bgColor: 'red.500'
      });

      setIsLoading(false);
      return;
    }
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">

        <Heading fontFamily="heading" color="white" fontSize="xl" textAlign="center">
          Encontre um bolão através de seu código único
        </Heading>

        <Input value={poolCode} onChangeText={setPoolCode} mb={2} mt={8} placeholder="Qual o código do bolão?" autoCapitalize="characters" />

        <Button title="BUSCAR BOLÃO" onPress={handlePoolSearch} isLoading={isLoading} />
      </VStack>
    </VStack>
  )
}