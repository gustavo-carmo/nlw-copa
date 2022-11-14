import { Box, FlatList, Icon, useToast, VStack } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { useCallback, useState } from "react";
import { PoolCard, PoolPros } from "../../components/PoolCard";
import { api } from "../../services/api";
import { Loading } from "../../components/Loading";
import { EmptyPoolList } from '../../components/EmptyPoolList';

export function ListPool () {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { navigate } = useNavigation();
  const [pools, setPools] = useState<PoolPros[]>([])

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get('/pools');

      setPools(response.data.pools)
    } catch(error) {
      console.error(error);
      toast.show({
        description: 'Não foi possivel carregar os bolões, por favor tente novamente mais tarde',
        placement: 'top',
        color: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []));

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} alignItems="center" borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button 
          title="BUSCAR BOLÃO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find_pool')}
        />
      </VStack>

      {isLoading ? 
        <Loading /> : 
        (
          <FlatList 
            data={pools}
            keyExtractor={item => item?.id}
            renderItem={({ item }) => <PoolCard data={item} onPress={() => navigate('details_pool', { id: item.id})}/>}
            px={5}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 10 }}
            ListEmptyComponent={() => <EmptyPoolList />}
          />
        )  
      }

      <Box height={12}>

      </Box>
    </VStack>
  )
}