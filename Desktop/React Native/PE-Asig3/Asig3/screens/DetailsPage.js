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

    // Fetch product details from API
    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(
                `https://66f979feafc569e13a98e57b.mockapi.io/api/v1/mmaapp/name/`
            );

           
            console.log("Fetched product details:", response.data);

            // Lấy tất cả các sản phẩm từ các category
            const productByCate = response.data.flatMap((cate) => {
                return cate.items.map((item) => ({
                    ...item, 
                    category: cate.name, 
                }));
            });

            // Tìm sản phẩm có id khớp với productID
            const foundProduct = productByCate.find((detail) => {
                return Number(detail.id) === Number(productID);
            });

            if (foundProduct) {
                console.log("Found product:", foundProduct);
                setProduct(foundProduct);  // Cập nhật sản phẩm tìm thấy
            } else {
                console.log("No product found with the given ID");
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching product details:", error);
            setLoading(false);
        }
    };

    // Load favorites from AsyncStorage
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

    // Add or remove from favorite list
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

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Product not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Image 
                    style={styles.picture} 
                    source={{ uri: `${product.image}` }} 
                />
                <View style={styles.detailContainer}>
                    <Text style={styles.detailName}>{product.names}</Text>
                    <Text style={styles.position}>{product.color}</Text>
                    <Text style={styles.price}>$ {product.price}</Text>
                    <View style={styles.favoriteContainer}>
                        <View style={styles.iconContainer}>
                            <Button 
                                onPress={() => addToFavoriteList(product)} 
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
                            Origin: <Text style={styles.detailInfo}>{product.origin}</Text>
                        </Text>
                        <Divider style={{ width: "100%", marginVertical: 10 }} bold />
                        <Text style={styles.detailTitle}>
                            Weight:{"\t"}
                            <Text style={styles.detailInfo}>{product.weight} grams</Text>
                        </Text>
                        <Text style={styles.detailTitle}>
                            Is Top of the Week:{"\t"}
                            <Text style={styles.detailInfo}>{product.isTopOfTheWeek ? "Yes" : "No"}</Text>
                        </Text>
                        <Text style={styles.detailTitle}>
                            Bonus:{"\t"}
                            <Text style={styles.detailInfo}>{product.bonus !== "No" ? product.bonus : "No bonus"}</Text>
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
