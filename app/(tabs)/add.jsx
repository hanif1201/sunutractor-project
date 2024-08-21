import {
  Switch,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import LocationDropdown from "../../components/LocationDropdown";
import { location } from "../../data/location";
import icons from "../../constants/icons";

const add = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    make: "",
    model: "",
    powerSource: "",
    transmission: "",

    location: null,
    isAvailable: false,
    price: "",
    operatorName: "",
    operatorPhone: "",
    operatorEmail: "",
  });
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasOperator, setHasOperator] = useState(null);
  const [sunuTractorOperator, setSunuTractorOperator] = useState(null);
  const [ownerOperator, setOwnerOperator] = useState(null);

  const handleLocationChange = (locationData) => {
    setForm({ ...form, location: { ...form.location, ...locationData } });
  };

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
    setForm({ ...form, isAvailable: !form.isAvailable });
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-primary font-psemibold mt-4 text-center'>
          List a Tractor for Rent
        </Text>

        <View>
          <View className='mt-7 space-y-2'>
            <Text className='text-base text-black font-pmedium'>
              Tractor Image
            </Text>

            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode='cover'
                  className='w-full h-64 rounded-2xl'
                />
              ) : (
                <View className='w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2'>
                  <Image
                    source={icons.upload}
                    resizeMode='contain'
                    alt='upload'
                    className='w-5 h-5'
                  />
                  <Text className='text-sm text-black font-pmedium'>
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title='Tractor Make'
            value={form.make}
            placeholder='What is the maker of your tractor?'
            handleChangeText={(e) => setForm({ ...form, make: e })}
            otherStyles='mt-10'
          />
          <FormField
            title='Tractor Model'
            value={form.model}
            placeholder='What is the model of your tractor?'
            handleChangeText={(e) => setForm({ ...form, model: e })}
            otherStyles='mt-10'
          />
          <FormField
            title='Tractor Power Source'
            value={form.powerSource}
            placeholder='What is the Power Source of your tractor?'
            handleChangeText={(e) => setForm({ ...form, powerSource: e })}
            otherStyles='mt-10'
          />
          <FormField
            title='Tractor Transmission'
            value={form.transmission}
            placeholder='What is the Power Transmission of your tractor?'
            handleChangeText={(e) => setForm({ ...form, transmission: e })}
            otherStyles='mt-10'
          />

          <FormField
            title='Rental Price'
            value={form.price}
            placeholder='What is the rental price for the tractor per hour?'
            handleChangeText={(e) => {
              if (/^\d*$/.test(e)) {
                setForm({ ...form, price: e });
              }
            }}
            otherStyles='mt-10  '
          />
          <LocationDropdown
            onLocationChange={handleLocationChange}
            location={location}
          />
          <View className='flex flex-row'>
            <Text
              style={{ fontSize: 20, color: "black" }}
              className='font-psemibold'
            >
              Is the tractor available?
            </Text>

            <Switch
              value={isAvailable}
              onValueChange={handleToggle}
              accessibilityLabel='Toggle tractor availability'
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default add;
