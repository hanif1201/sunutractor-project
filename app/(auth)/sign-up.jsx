import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import React, { useState } from "react";
import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const result = await createUser(
        form.email,
        form.password,
        form.username,
        form.phone
      );
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <SafeAreaView className='bg-white h-full '>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps='handled'
      >
        <View
          className='w-full flex justify-center h-full px-4 '
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode='contain'
            className='w-[300px] h-[200px]  ml-10 justify-center items-center  '
          />
          <Text className='text-base font-psemibold text-center  '>
            Get Started with sunu<Text className='text-danger'>TRACTOR</Text>
          </Text>
          <Text className='text-base font-base text-black  text-center font-pregular'>
            Create a free account and explore efficient tractor to rent.
          </Text>
          <FormField
            title='Username'
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles=''
          />
          <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />
          <FormField
            title='Phone'
            value={form.phone}
            handleChangeText={(e) => setForm({ ...form, phone: e })}
            otherStyles='mt-7'
            keyboardType='phone-pad'
          />

          <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
          />

          <CustomButton
            title='Sign Up'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className='flex justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-black font-pregular'>
              Have an account already?
            </Text>
            <Link
              href='/sign-in'
              className='text-lg font-psemibold text-secondary'
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Dimensions.get("window").height,
  },
});

export default SignUp;
