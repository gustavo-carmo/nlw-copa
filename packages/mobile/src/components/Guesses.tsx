import { Box, FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const toast = useToast();

  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');


  async function fetchGuesses() {
    try {
      setIsLoading(true);
      const response = await api.get(`pools/${poolId}/games`);

      setGames(response.data.games);
    } catch (error) {
      console.error(error);

      toast.show({
        description: 'Não foi possivel carregar os palpites',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirmation(gameId: string) {

    if(firstTeamPoints === '' || secondTeamPoints === '') {
      return toast.show({
        description: 'Por favor pontue ambos os times',
        placement: 'top',
        bgColor: 'red.500'
      });
    }

    try {
      setIsLoading(true);

      console.log("Enviando\n\n", {
        firstTeamPoints,
        secondTeamPoints
      })

      console.log("Request: ", `pools/${poolId}/games/${gameId}/guesses`);
      await api.post(`pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints,
        secondTeamPoints
      });

      toast.show({
        description: 'Palpite realizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGuesses();
    } catch (error) {
      console.error(error);

      toast.show({
        description: 'Não foi possivel realizar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGuesses();
  }, [poolId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList 
      data={games} 
      keyExtractor={(item) => item.id} 
      renderItem={({item}) => (
        <Game 
          data={item} 
          setFirstTeamPoints={setFirstTeamPoints} 
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirmation(item.id)}
        />
      )}/>
  );
}
