import {
  Switch,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Dropdown } from "react-native-element-dropdown";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import LocationDropdown from "../../components/LocationDropdown";
import { location } from "../../data/location";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";
import { createTractor } from "../../lib/appwrite";

const add = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    make: "",
    model: "",
    thumbnail: null,
    powerSource: "",
    transmission: "",

    location: null,
    isAvailable: false,
    price: "",
    hasOperator: null,
    operatorName: "",
    operatorPhone: "",
    operatorEmail: "",
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };
  const [isSubmitting, setSubmitting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasOperator, setHasOperator] = useState(null);
  const [hasHireOperator, setHasHireOperator] = useState(null);
  const [hasHireOperating, setHasHireOperating] = useState(null);
  const [sunuTractorOperator, setSunuTractorOperator] = useState(null);
  const [ownerOperator, setOwnerOperator] = useState(null);
  const submit = async () => {
    try {
      const tractorData = {
        make: form.make,
        model: form.model,
        thumbnail: form.thumbnail,
        powerSource: form.powerSource,
        transmission: form.transmission,
        // location: form.location,
        isAvailable: form.isAvailable,
        price: form.price,
        region: form.location.region,
        district: form.location.district,
        village: form.location.village,

        hasOperator: form.hasOperator,
        operatorName: form.operatorName,
        operatorPhone: form.operatorPhone,
        operatorEmail: form.operatorEmail,
      };

      const newTractor = await createTractor(tractorData); // Call the createTractor function
      // console.log(newTractor);
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");

      // Redirect to the tractors list page or display a success message
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationChange = (locationData) => {
    setForm({ ...form, location: { ...form.location, ...locationData } });
  };

  const handleToggle = () => {
    setIsAvailable(!isAvailable);
    setForm({ ...form, isAvailable: !form.isAvailable });
  };

  const handleHasOperator = (value) => {
    setHasOperator(value);
    setForm({ ...form, hasOperator: value });
  };

  const handleHasHireOperator = (value) => {
    setHasHireOperator(value);
    setForm({ ...form, hasHireOperator: value });
  };
  const handleHasHireOperating = (value) => {
    setHasHireOperating(value);
    setForm({ ...form, hasHireOperating: value });
  };

  const operatorOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];
  const operatorHireOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-primary font-psemibold mt-4 text-center'>
          List a Tractor for Rent
        </Text>

        <View>
          <View className='mt-7 space-y-2'>
            <Text className='text-base text-black font-pmedium'>
              Tractor Image :
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
            title='Tractor Make :'
            value={form.make}
            placeholder='What is the maker of your tractor?'
            handleChangeText={(e) => setForm({ ...form, make: e })}
            otherStyles='mt-10'
          />
          <FormField
            title='Tractor Model :'
            value={form.model}
            placeholder='What is the model of your tractor?'
            handleChangeText={(e) => setForm({ ...form, model: e })}
            otherStyles='mt-10'
          />
          <FormField
            title='Tractor Power Source :'
            value={form.powerSource}
            placeholder='What is the Power Source of your tractor?'
            handleChangeText={(e) => setForm({ ...form, powerSource: e })}
            otherStyles='mt-10'
          />
          <FormField
            title='Tractor Transmission :'
            value={form.transmission}
            placeholder='What is the Power Transmission of your tractor?'
            handleChangeText={(e) => setForm({ ...form, transmission: e })}
            otherStyles='mt-10'
          />

          <FormField
            title='Rental Price :'
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

          <View>
            <Text className='font-pmedium text-lg'>
              Do you have an operator for your tractor?
            </Text>
            <Dropdown
              data={operatorOptions}
              labelField='label'
              valueField='value'
              placeholder='Select Option'
              value={hasOperator}
              onChange={(item) => handleHasOperator(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.dropdownContainer}
            />
          </View>

          {hasOperator === "yes" && (
            <View>
              <FormField
                title='Operator Name'
                value={form.operatorName}
                placeholder="Kindly fill in the Operator's name"
                handleChangeText={(e) => setForm({ ...form, operatorName: e })}
                otherStyles='mt-10'
              />
              <FormField
                title='Operator Phone :'
                value={form.operatorPhone}
                placeholder="Kindly fill in the Operator's phone number"
                handleChangeText={(e) => setForm({ ...form, operatorPhone: e })}
                otherStyles='mt-10'
              />
              <FormField
                title='Operator Email :'
                value={form.operatorEmail}
                placeholder="Kindly fill in the Operator's email"
                handleChangeText={(e) => setForm({ ...form, operatorEmail: e })}
                otherStyles='mt-10'
              />
            </View>
          )}
          {hasOperator === "no" && (
            <View>
              <Text className='font-pmedium text-lg'>
                Will you like to hire an operator from Sunu Tractor?
              </Text>
              <Dropdown
                data={operatorHireOptions}
                labelField='label'
                valueField='value'
                placeholder='Select Option'
                value={hasHireOperator}
                onChange={(item) => handleHasHireOperator(item.value)}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.dropdownContainer}
              />
            </View>
          )}
          {hasHireOperator === "yes" &&
            Alert.alert(
              "SUNUTractor will provide an operator. Thank you for registering your tractor."
            )}
          {hasHireOperator === "no" && (
            <View>
              <Text className='font-pmedium text-lg'>
                Will you be operating the tractor?
              </Text>
              <Dropdown
                data={operatorHireOptions}
                labelField='label'
                valueField='value'
                placeholder='Select Option'
                value={hasHireOperating}
                onChange={(item) => handleHasHireOperating(item.value)}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.dropdownContainer}
              />
            </View>
          )}
          {hasHireOperating === "yes" &&
            Alert.alert(
              "Thank you for registering your tractor. You will be operating the tractor."
            )}
          {hasHireOperating === "no" &&
            Alert.alert("You will need an operator for your tractor!!")}
        </View>

        <CustomButton
          title={isSubmitting ? "Submitting..." : "Submit"}
          handlePress={submit}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    // backgroundColor: "#f8f8f8",
  },
  dropdown: {
    height: 50,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "white",
  },
  placeholderStyle: {
    color: "gray",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 16,
  },
  dropdownContainer: {
    borderRadius: 8,
  },
});

export default add;
