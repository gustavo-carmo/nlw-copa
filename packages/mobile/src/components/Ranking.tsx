import { FlatList, HStack, VStack, Avatar, Text, Box } from "native-base";
import { ParticipantProps } from "./Participants";

interface RankingItemProps {
  participant: ParticipantProps;
}

interface RankingProps {
  participants: ParticipantProps[];
}

function RankingItem({ participant }: RankingItemProps) {
  console.log("\nParticipante: ", participant)

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      justifyContent="space-between"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <HStack flex={1} p={1} w="full">
        <Box>
          <Avatar
              key={participant.id}
              source={{ uri: participant.user.avatarUrl}}
              w={10}
              h={10}
              rounded="full"
              borderWidth={2}
              marginRight={-3}
              borderColor="gray.800"
            >
            {participant.user?.name}
          </Avatar>

          <Box>
            <Text color="gray.100" fontFamily="heading" fontSize="sm">
              {/* {participant.user?.name} */}
              Abobrinha
            </Text>
          </Box>
        </Box>
        <Box h={10}>
        </Box>
      </HStack>
    </VStack>
  )
}

export function Ranking({ participants }: RankingProps) {
  return (
    <FlatList 
      data={participants}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RankingItem participant={item}/>}
    />
  )
}