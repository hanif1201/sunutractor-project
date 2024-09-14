import React from "react";
import { View, TextInput, Image } from "react-native";
import icons from "../constants/icons";

const CustomInput = ({ placeholder, value, onChangeText }) => {
  return (
    <View className='flex-row items-center border border-white rounded-full p-2'>
      <Image
        source={icons.searchnormal} // Replace with your icon source
        className='w-5 h-5 mr-2' // Adjust size and margin as needed
        style={{ tintColor: "white" }}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className='flex-1 text-white' // Allow the TextInput to take the remaining space
        style={{ padding: 0, tintColor: "white" }} // Remove default padding
        placeholderTextColor='#ffff' // Change placeholder text color here
      />
    </View>
  );
};

export default CustomInput;
