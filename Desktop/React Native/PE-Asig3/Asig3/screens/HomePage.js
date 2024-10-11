import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Cards from '../components/Cards';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log("Fetching data...");
                const response = await axios.get(
                    'https://66f979feafc569e13a98e57b.mockapi.io/api/v1/mmaapp/name'
                );
                console.log("Fetched data: ", response.data);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
    
        fetchProduct();
    }, []);

    console.log("C: ",products);
    console.log("C: ",AsyncStorage.getItem("products"));


    // Flatten the data to loop over categories and their items
    const flattenProducts = (products) => {
        return products.flatMap(product => 
            product.items.map((item, index) => ({
                ...item,
                categoryName: product.name, // Add category name to each item
                id: index+1,
            }))
        );
    };

    const renderItem = ({ item }) => {
        console.log("C1: ",item);
        return (
            <Cards
                key={item.id}
                name={item.names}   
                id={item.id}
                weight={item.weight}
                rating={item.rating}
                price={item.price}
                isTopOfTheWeek={item.isTopOfTheWeek}
                image={item.image}
                color={item.color}
                bonus={item.bonus}
                origin={item.origin}
                category={item.categoryName} 
            />
        );
    };

    const onChangeCategory = (category) => {
        setCategory(category);
    };

    const showItems = (category, products) =>
        category === 'All' ? flattenProducts(products) : flattenProducts(products).filter(item => item.categoryName === category);

    const categoryNames = [...new Set(products.map((item) => item.name))];
    const categoryListWithAll = ['All', ...categoryNames];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.scrollView}>
            <View>
                <FlatList
                    style={styles.filterBrand}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categoryListWithAll}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.filterButton, {
                                backgroundColor: category === item ? "#65B741" : "transparent",
                            }]}
                            onPress={() => onChangeCategory(item)}
                        >
                            <Text style={{ color: category === item ? "#FFFFFF" : "#45474B" }}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={showItems(category, products)} 
                renderItem={renderItem}
                keyExtractor={(item) => item.names} 
                numColumns={2}
                showsVerticalScrollIndicator={false}
                style={{ marginVertical: 20 }}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "white",
    },
    filterBrand: {
        marginTop: 20,
        width: Dimensions.get("window").width - 20,
    },
    filterButton: {
        marginLeft: 10,
        padding: 10, 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
