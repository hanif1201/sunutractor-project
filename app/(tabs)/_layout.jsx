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
            height: 84,
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
                icon={icons.house}
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
                icon={icons.heart}
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
                icon={icons.message}
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
                avatar={user?.avatar} // Pass the avatar URL
                color={color}
                name='Profile'
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor='#161622' style='light' />
    </>
  );
};

export default TabLayout;
