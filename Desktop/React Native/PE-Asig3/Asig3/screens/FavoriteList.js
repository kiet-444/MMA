import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React from "react";
import FavoritteCard from "../components/FavoritteCard"; // Sử dụng tên đúng
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoriteList() {
  const [favoriteList, setFavoriteList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const savedFavorites = await AsyncStorage.getItem("favorites");
      console.log("Check: ",savedFavorites);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        const uniqueFavorites = parsedFavorites.reduce((acc, current) => {
          // const x = acc.find((item) => item.name === current.name);
          const x = acc.find((item) => item.id === current.id);
          return x ? acc : acc.concat([current]);
        }, []);
        console.log("Check12: ",uniqueFavorites);
        setFavoriteList(uniqueFavorites);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavourites = async (favorId) => {
    const updatedFavorites = favoriteList.filter(favor => favor.id !== favorId);
    
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavoriteList(updatedFavorites);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const clearAsyncStorage = async () => {
    try {
      Alert.alert(
        "Clear Your Favorite List",
        "Are you sure you want to clear all Favorite List?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                await AsyncStorage.clear();
                setFavoriteList([]);
                Alert.alert("Success", "Favorite List cleared successfully");
              } catch (error) {
                console.error("Error clearing AsyncStorage:", error);
                Alert.alert("Error", "Failed to clear AsyncStorage");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error displaying alert:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  function showClearAll() {
    if (favoriteList.length === 0) {
      return (
        <Text style={styles.emptyListText}>
          No Product in Favorites
        </Text>
      );
    }
    return (
      <Button
        textColor="white"
        mode="elevated"
        style={styles.clearButton}
        onPress={clearAsyncStorage}
      >
        <Text style={styles.clearText}>Clear All</Text>
      </Button>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      {favoriteList.map((favor) => (
        <FavoritteCard
          key={favor.id}
          id={favor.id}
          name={favor.name}
          color={favor.color}
          weight={favor.weight}
          price={favor.price}
          image={favor.image}
          handle={() => removeFavourites(favor.id)}
        />
      ))}
      {showClearAll()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    backgroundColor: "#FFE61B",
    borderRadius: 10,
    marginVertical: 20,
  },
  clearText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
