import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CreatePool } from '../screens/pool/Create';
import { FindPool } from '../screens/pool/Find';
import { ListPool } from '../screens/pool/List';
import { PlusCircle, SoccerBall } from 'phosphor-react-native';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';
import { DetailsPool } from '../screens/pool/Details';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors, sizes } = useTheme();
  const size = sizes[6];

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarLabelPosition: 'beside-icon',
      tabBarActiveTintColor: colors.yellow[500],
      tabBarInactiveTintColor: colors.gray[300],
      tabBarStyle: {
        position: 'absolute',
        height: 87,
        borderTopWidth: 0,
        backgroundColor: colors.gray[800],
        marginBottom: -10
      },
      tabBarItemStyle: {
        position: 'relative',
        top: Platform.OS === 'android' ? -10 : 0
      }
    }}>
      <Screen
        name='create_pool'
        component={CreatePool}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={size}/>,
          tabBarLabel: 'Novo bolão'
        }}
      />

      <Screen
        name='list_pool'
        component={ListPool}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall color={color} size={size}/>,
          tabBarLabel: 'Meus bolões'
        }}
      />


      <Screen
        name='find_pool'
        component={FindPool}
        options={{ tabBarButton: () => null}}
      />

      <Screen
        name='details_pool'
        component={DetailsPool}
        options={{ tabBarButton: () => null}}
      />


    </Navigator>
  )
}