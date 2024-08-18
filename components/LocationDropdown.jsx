import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { location } from "../data/location"; // Assuming the location data is in a file named location.js in the same folder

const LocationDropdown = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);

  const handleRegionChange = (item) => {
    setSelectedRegion(item);
    setSelectedDistrict(null);
    setSelectedVillage(null);
  };

  const handleDistrictChange = (item) => {
    setSelectedDistrict(item);
    setSelectedVillage(null);
  };

  const handleVillageChange = (item) => {
    setSelectedVillage(item);
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
    <View style={styles.container}>
      <Dropdown
        data={regionOptions}
        labelField='label'
        valueField='value'
        placeholder='Select Region'
        value={selectedRegion}
        onChange={(item) => handleRegionChange(item.value)}
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
        onChange={(item) => handleDistrictChange(item.value)}
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
        onChange={(item) => handleVillageChange(item.value)}
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
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
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
