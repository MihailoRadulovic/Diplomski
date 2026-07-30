import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const otvoriKameru = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permisija = await ImagePicker.requestCameraPermissionsAsync();
    if (!permisija.granted) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled) return result.assets[0];
    return null;
  };

  const otvoriGaleriju = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permisija = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permisija.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) return result.assets[0];
    return null;
  };

  return { otvoriKameru, otvoriGaleriju };
}
