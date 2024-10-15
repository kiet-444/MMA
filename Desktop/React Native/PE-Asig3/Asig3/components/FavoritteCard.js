import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function FavoriteCard(props) {
  const navigation = useNavigation();

  function handlePress(getId) {
    navigation.navigate("Details", {
      itemId: getId,r
    
    });
  }

  return (
    <Pressable onPress={() => handlePress(props.id)}>
      <View style={styles.container}>
        <Image source={{ uri: `${props.image}` }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <View>
            <Text style={styles.flowerName} > Name:{props.name} </Text>
            <Text style={styles.detail}>Color: {props.color}</Text> 
            <Text style={styles.detail}>Weight: {props.weight}g</Text>
            <Text style={styles.detail}>Price: ${props.price}</Text> 
          </View>
        </View>
        <IconButton
          size={20}
          icon={"heart-remove-outline"}
          style={styles.iconRemove}
          iconColor="red"
          onPress={props.handle} // Hàm xóa yêu thích
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  flowerName: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
    color: "#DD761C",
    fontWeight: "bold",
  },
  iconRemove: {
    marginTop: 20,
    textAlign: "center",
  },
});
