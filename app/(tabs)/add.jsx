import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";

const add = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-primary font-psemibold mt-4 text-center'>
          List a Tractor for Rent
        </Text>

        <View>
          <FormField
            title='Tractor Name'
            value={form.name}
            placeholder='What is the model of your tractor?'
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles='mt-10'
          />
          <FormField
            title='Tractor Description'
            value={form.description}
            placeholder='What is the description of your tractor?'
            handleChangeText={(e) => setForm({ ...form, description: e })}
            otherStyles='mt-10  '
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default add;

const styles = StyleSheet.create({});
