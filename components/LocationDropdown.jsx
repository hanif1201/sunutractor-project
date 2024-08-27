import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { location } from "../data/location";

const LocationDropdown = ({ onLocationChange, location }) => {
  const [selectedRegion, setSelectedRegion] = useState(location.region);
  const [selectedDistrict, setSelectedDistrict] = useState(location.district);
  const [selectedVillage, setSelectedVillage] = useState(location.village);

  const handleRegionChange = (item) => {
    setSelectedRegion(item.value);
    setSelectedDistrict("");
    setSelectedVillage("");
    onLocationChange({ region: item.value, district: "", village: "" });
  };

  const handleDistrictChange = (item) => {
    setSelectedDistrict(item.value);
    setSelectedVillage("");
    onLocationChange({
      region: selectedRegion,
      district: item.value,
      village: "",
    });
  };

  const handleVillageChange = (item) => {
    setSelectedVillage(item.value);
    onLocationChange({
      region: selectedRegion,
      district: selectedDistrict,
      village: item.value,
    });
  };

  const regionOptions = location.map((region) => ({
    label: region.region,
    value: region.region,
  }));

  const selectedRegionObject = location.find(
    (region) => region.region === selectedRegion
  );
  const districtOptions = selectedRegionObject
    ? selectedRegionObject.districts.map((district) => ({
        label: district.district,
        value: district.district,
      }))
    : [];

  const selectedDistrictObject = selectedRegionObject
    ? selectedRegionObject.districts.find(
        (district) => district.district === selectedDistrict
      )
    : null;
  const villageOptions = selectedDistrictObject
    ? selectedDistrictObject.villages.map((village) => ({
        label: village,
        value: village,
      }))
    : [];

  return (
    <View style={styles.container} className='mt-6'>
      <Text className='font-pmedium text-lg'>Tractor Location </Text>
      <Dropdown
        data={regionOptions}
        labelField='label'
        valueField='value'
        placeholder='Select Region'
        value={selectedRegion}
        onChange={(item) => handleRegionChange(item)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.dropdownContainer}
      />
      <Dropdown
        data={districtOptions}
        labelField='label'
        valueField='value'
        placeholder='Select District'
        value={selectedDistrict}
        onChange={(item) => handleDistrictChange(item)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.dropdownContainer}
      />
      <Dropdown
        data={villageOptions}
        labelField='label'
        valueField='value'
        placeholder='Select Village'
        value={selectedVillage}
        onChange={(item) => handleVillageChange(item)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.dropdownContainer}
      />
    </View>
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

export default LocationDropdown;
