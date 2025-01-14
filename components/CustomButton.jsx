import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary rounded-full min-h-[42px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-white font-psemibold text-base ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color='#fff'
          size='small'
          className='ml-2'
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
