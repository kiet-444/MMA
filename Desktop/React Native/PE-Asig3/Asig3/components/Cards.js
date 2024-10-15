import { View, StyleSheet, Pressable, Animated } from "react-native";
import * as React from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Card, Text, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Cards(props) {
  console.log("Check props: ",props);
  const [favoriteList, setFavoriteList] = React.useState([]);
  const navigation = useNavigation();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(50)).current;

  // Load danh sách yêu thích
  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("favorites");
      const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      setFavoriteList(parsedFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Thêm hoặc xóa khỏi danh sách yêu thích
  const addToFavoriteList = async (item) => {
    try {
      const savedFavorites = await AsyncStorage.getItem("favorites");
      const updatedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      const index = updatedFavorites.findIndex(
        (favItem) => Number(favItem.id) === Number(item.id)
      );

      if (index === -1) {
        // Thêm vào danh sách yêu thích
        updatedFavorites.push(item);
      } else {
        // Xóa khỏi danh sách yêu thích
        updatedFavorites.splice(index, 1);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      console.log("Updated favorites:", updatedFavorites);
      setFavoriteList(updatedFavorites);
    } catch (error) {
      console.log("Error adding to favorites:", error);
    }
  };

  // Kiểm tra hoa lan có trong danh sách yêu thích hay không
  const isFavorite = favoriteList.some(
    (favor) => Number(favor.id) === Number(props.id)
  );


  function handlePress(getId) {
    navigation.navigate("Details", {
      itemId: getId,
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [opacity, translateY])
  );
  return (
    <Animated.View
      style={{
        opacity: opacity,
        transform: [{ translateY: translateY }],
      }}
    >
      <Pressable onPress={() => handlePress(props.id)}>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Cover
              resizeMode="contain"
              source={{ uri: `${props.image}` }}
            />
            <Card.Content>
              <Text variant="titleSmall" style={styles.title}>
                {props.name}
              </Text>
            </Card.Content>
            <Card.Content>
              <Text style={styles.detail}>Color: {props.color}</Text>
            </Card.Content>
            <Card.Content>
              <Text style={styles.detail}>Weight: {props.weight}g</Text>
            </Card.Content>
            <Card.Content>
              <Text style={styles.detail}>Price: ${props.price}</Text>
            </Card.Content>
          </Card>
          {/* <TouchableOpacity onPress={() => handleFavorite(id)}>
          <IconButton
            icon={isFavorite ? "cards-heart" : "cards-heart-outline"}
            style={styles.iconButton}
            iconColor="red"
            onPress={() => addToFavoriteList(props)}
          />
          </TouchableOpacity> */}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  cardContainer: {
    position: "relative",
    alignItems: "center",  // Canh giữa các thẻ
  },
  card: {
    margin: 10,
    width: screenWidth / 2 - 20, // Giới hạn kích thước thẻ để vừa với 2 cột trên màn hình
    height: 300,
    display: "flex",
    flexDirection: "column",
  },
  iconButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  detail: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#DD761C",
  },
  title: {
    color: "#4793AF",
    fontWeight: "700",
  },
});
