import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider"; // Import the context
import icons from "../../constants/icons";

const TabIcon = ({ icon, color, name, focused, avatar }) => {
  return (
    <View className='flex items-center justify-center gap-2'>
      {avatar ? (
        <Image
          source={{ uri: avatar }} // Use the avatar URL
          resizeMode='contain'
          className='w-6 h-6 rounded-full' // Make it circular
        />
      ) : (
        <Image
          source={icon}
          resizeMode='contain'
          tintColor={color}
          className='w-6 h-6'
        />
      )}
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { user } = useGlobalContext(); // Access user from context

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#336431",
          tabBarInactiveTintColor: "#000",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#ffff",
            borderTopWidth: 1,
            height: 60,
            borderTopLeftRadius: 40, // Curved edges
            borderTopRightRadius: 40, // Curved edges
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 2, height: -2 }, // Shadow offset
            shadowOpacity: 0.25, // Shadow opacity
            shadowRadius: 4, // Shadow radius
            elevation: 5, // For Android shadow
          },
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home05}
                color={color}
                name='Home'
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name='favourites'
          options={{
            title: "Favourites",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.lovely}
                color={color}
                name='Favourites'
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name='add'
          options={{
            title: "Add",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.add}
                color={color}
                name='Add'
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name='messages'
          options={{
            title: "Messages",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.messages}
                color={color}
                name='Messages'
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name='Profile'
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor='#218225' style='light' />
    </>
  );
};

export default TabLayout;
