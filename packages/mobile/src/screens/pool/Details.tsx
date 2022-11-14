import { RouteProp, useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../../components/EmptyMyPoolList";
import { Guesses } from "../../components/Guesses";

import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { Option } from "../../components/Option";
import { PoolPros } from "../../components/PoolCard";
import { PoolHeader } from "../../components/PoolHeader";
import { Ranking } from "../../components/Ranking";
import { api } from "../../services/api";

type ParamsProps = {
  params: {
    id: string;
  }
}

export function DetailsPool () {
  const [isLoading, setIsLoading] = useState(true);
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses')
  const toast = useToast();

  const { params: { id } } = useRoute<RouteProp<ParamsProps>>();
  const [poolData, setPoolData] = useState<PoolPros>({} as PoolPros)

  async function loadPoolDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`pools/${id}`);

      setPoolData(response.data);
    } catch (error) {
      console.error(error);

      toast.show({
        description: 'Não foi possivel carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShareCode() {
    await Share.share({
      message: poolData.code
    })
  }

  useEffect(() => {
    loadPoolDetails();

    setOptionSelected('guesses');
  }, [id]);

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title={poolData.title} showBackButton showShareButton onShare={handleShareCode}/>

      {
        poolData._count.participants > 0 ?
        (
          <VStack px={5} flex={1}>
            <PoolHeader data={poolData}/>

            <HStack p={1} borderRadius="sm" mb={5} bgColor="gray.800">
              <Option title="Seus palpites"  onPress={() => setOptionSelected('guesses')} isSelected={optionSelected === 'guesses'}/>
              <Option title="Ranking do grupo" onPress={() => setOptionSelected('ranking')} isSelected={optionSelected === 'ranking'}/>
            </HStack>

            { 
              optionSelected === 'guesses' && (
                <Guesses poolId={poolData.id} />
              )
            }

            {
              optionSelected === 'ranking' && (
                <Ranking participants={poolData.participants} />
              )
            }
          </VStack>
        ) :
        (
          <EmptyMyPoolList code={poolData.code} onShare={handleShareCode}/>
        )
      }
    </VStack>
  )
}