import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Image,
  Text,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from "../../constants"; // Assuming the color scheme is defined in a constants file

export default function ScanPage({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [plantInfo, setPlantInfo] = useState(null);

  const pickImageAndUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!pickerResult.cancelled && pickerResult.assets && pickerResult.assets[0].base64) {
      const base64Image = pickerResult.assets[0].base64;
      setImage(pickerResult.assets[0].uri);
      uploadImage(base64Image);
    } else {
      console.log('Image picking was cancelled or no base64 data found');
    }
  };

  const uploadImage = async (base64) => {
    setUploading(true);
    const apiUrl = 'https://api.plant.id/v2/identify';
    const apiKey = 'aPFCrH13CxS2ExKduMDQTpxJi4ynS9MNeoChA4xN2aNvaDGkzu';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: [`data:image/jpeg;base64,${base64}`],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      setPlantInfo(data);
    } catch (error) {
      console.error('Upload error:', error);
      setPlantInfo({ error: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleRefresh = () => {
    setImage(null);
    setUploading(false);
    setPlantInfo(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.muted} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Scan Page</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Button title="Pick an image from camera roll" onPress={pickImageAndUpload} color={colors.primary} />
        {uploading && <ActivityIndicator size="large" color={colors.secondary} />}
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        {plantInfo && (
          <View style={styles.infoContainer}>
            <Text style={styles.plantName}>{plantInfo.suggestions[0].plant_name}</Text>
            <Text style={styles.details}>Scientific Name: {plantInfo.suggestions[0].plant_details.scientific_name}</Text>
            <Text style={styles.details}>Probability: {(plantInfo.suggestions[0].probability * 100).toFixed(2)}%</Text>
            <Image source={{ uri: plantInfo.images[0].url }} style={styles.plantImage} />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button title="Refresh" onPress={handleRefresh} color={colors.secondary} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.light,
  },
  topBarTitle: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.muted,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10, 
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  plantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  details: {
    fontSize: 16,
    marginTop: 5,
    color: '#4E4E4E',
  },
  plantImage: {
    width: 150,
    height: 150,
    marginTop: 15,
    borderRadius: 75,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
