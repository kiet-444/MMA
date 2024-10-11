import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Button, Divider, Icon } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function DetailsPage() {
    const route = useRoute();
    const productID = route.params.itemId;  

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favoriteList, setFavoriteList] = useState([]);
    

    console.log("Received productID:", productID);

    const fetchProductDetails = async () => {
    try {
        const response = await axios.get(
            `https://66f979feafc569e13a98e57b.mockapi.io/api/v1/mmaapp/name/`
        );

        // console.log("Fetched product details:", response.data);
        
        // const foundProduct = response.data.find((item) => item.id === productID);
        console.log("Found product:", foundProduct);
        setProduct(response.data);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
    }
};
    console.log("undefined ",product);

    const productByCate  = product?.flatMap((cate) =>{
        return cate.items.flatMap((item)=> {
            return {
                items: item,
                category: cate.name,
                // id : index + 1,
            };
        });
    });

    const productDetails = productByCate?.flatMap((detail)=> {
        return Number(detail.items.id) === Number(productID)

    });

    const loadFavorites = async () => {
        try {
            const savedFavorites = await AsyncStorage.getItem("favorites");
            if (savedFavorites !== null) {
                const parsedFavorites = JSON.parse(savedFavorites);
                setFavoriteList(parsedFavorites);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    const addToFavoriteList = async (item) => {
        try {
            let updatedFavorites = [...favoriteList];
            const index = updatedFavorites.findIndex((favItem) => favItem.id === item.id);

            if (index === -1) {
                updatedFavorites.push(item); 
            } else {
                updatedFavorites = updatedFavorites.filter((favItem) => favItem.id !== item.id);
            }

            await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            setFavoriteList(updatedFavorites);
        } catch (error) {
            console.log("Error updating favorites:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
          fetchProductDetails();
          loadFavorites();
        }, [])
      );

    const isFavorite = favoriteList.some((favor) => 
        Number(favor.id) === Number(productID));

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!product || Object.keys(product).length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Product not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Image style={styles.picture} 
                source={{ uri: `${productDetails.items.image}` }} />
                <View style={styles.detailContainer}>
                    <Text style={styles.detailName}>{productDetails.items.name}</Text>
                    <Text style={styles.position}>{productDetails.items.color}</Text>
                    <Text style={styles.price}>$ {productDetails.items.price}</Text>
                    <View style={styles.favoriteContainer}>
                        <View style={styles.iconContainer}>
                            <Button 
                            onPress={() => addToFavoriteList(productDetails.items)} 
                            style={styles.btnPressable}>
                                <Icon
                                    source={isFavorite ? "cards-heart" : "cards-heart-outline"}
                                    size={25}
                                    color="red"
                                />
                            </Button>
                        </View>
                    </View>
                    <View style={styles.detailFrame}>
                        <Text style={styles.detailTitle}>
                            Origin: <Text style={styles.detailInfo}>{productDetails.items.origin}</Text>
                        </Text>
                        <Divider style={{ width: "100%", marginVertical: 10 }} bold />
                        <Text style={styles.detailTitle}>
                            Weight:{"\t"}
                            <Text style={styles.detailInfo}>{productDetails.items.weight} grams</Text>
                        </Text>
                        {/* <Text style={styles.detailTitle}>
                            Price:{"\t"}
                            <Text style={styles.detailInfo}>${productDetails.items.price}</Text>
                        </Text> */}
                        <Text style={styles.detailTitle}>
                            Is Top of the Week:{"\t"}
                            <Text style={styles.detailInfo}>{productDetails.items.isTopOfTheWeek ? "Yes" : "No"}</Text>
                        </Text>
                        <Text style={styles.detailTitle}>
                            Bonus:{"\t"}
                            <Text style={styles.detailInfo}>{productDetails.items.bonus !== "No" ? productDetails.bonus : "No bonus"}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        gap: 20,
        padding: 20,
        alignItems: "center",
    },
    picture: {
        width: 400,
        height: 400,
        resizeMode: "contain",
    },
    detailContainer: {
        display: "flex",
        gap: 10,
    },
    detailName: {
        fontSize: 25,
        color: "#4793AF",
        alignItems: "center",
        textAlign: "center",
        fontWeight: "600",
    },
    detailTitle: {
        fontSize: 18,
        color: "#4793AF",
        fontWeight: "600",
    },
    detailInfo: {
        fontSize: 16,
        color: "grey",
        textAlign: "justify",
    },
    scrollView: {
        backgroundColor: "white",
    },
    favoriteContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    iconContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    btnPressable: {
        shadowColor: "black",
        borderRadius: 50,
        textAlign: "center",
        width: 20,
        height: 40,
    },
    position: {
        fontSize: 22,
        color: "#FF204E",
        fontWeight: "bold",
    },
    detailFrame: {
        borderWidth: 2,
        borderColor: "black",
        padding: 10,
        width: 370,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
