import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import fallbackFoodImage from '../../assets/fallbackFoodImage.jpg'

const { width } = Dimensions.get("window");

const BASE_URL = 'http://localhost:5000/api/v1'

const CATEGORIES = [
  { id: 1, name: "All", emoji: "🍽️" },
  { id: 2, name: "Pizza", emoji: "🍕" },
  { id: 3, name: "Burger", emoji: "🍔" },
  { id: 4, name: "Biryani", emoji: "🍱" },
  { id: 5, name: "Chinese", emoji: "🍜" },
  { id: 6, name: "Desserts", emoji: "🍰" },
  { id: 7, name: "Drinks", emoji: "🥤" },
  { id: 8, name: "Veg", emoji: "🥗" },
];

const RESTAURANTS = [
  {
    id: 1,
    name: "Spice Garden",
    cuisine: "North Indian • Biryani",
    rating: 4.5,
    deliveryTime: "25-30 min",
    deliveryFee: "₹20",
    discount: "30% OFF",
    emoji: "🍱",
    image: "https://via.placeholder.com/300x200?text=Spice+Garden",
  },
  {
    id: 2,
    name: "Burger Palace",
    cuisine: "Burgers • Fast Food",
    rating: 4.3,
    deliveryTime: "20-25 min",
    deliveryFee: "₹15",
    discount: "25% OFF",
    emoji: "🍔",
    image: "https://via.placeholder.com/300x200?text=Burger+Palace",
  },
  {
    id: 3,
    name: "Pizza Hub",
    cuisine: "Pizza • Italian",
    rating: 4.6,
    deliveryTime: "30-35 min",
    deliveryFee: "₹30",
    discount: "40% OFF",
    emoji: "🍕",
    image: "https://via.placeholder.com/300x200?text=Pizza+Hub",
  },
  {
    id: 4,
    name: "Noodle Express",
    cuisine: "Chinese • Noodles",
    rating: 4.2,
    deliveryTime: "15-20 min",
    deliveryFee: "₹10",
    discount: "20% OFF",
    emoji: "🍜",
    image: "https://via.placeholder.com/300x200?text=Noodle+Express",
  },
  {
    id: 5,
    name: "Dessert Delight",
    cuisine: "Desserts • Sweets",
    rating: 4.7,
    deliveryTime: "10-15 min",
    deliveryFee: "₹5",
    discount: "35% OFF",
    emoji: "🍰",
    image: "https://via.placeholder.com/300x200?text=Dessert+Delight",
  },
  {
    id: 6,
    name: "Green Bowl",
    cuisine: "Veg • Healthy",
    rating: 4.4,
    deliveryTime: "25-30 min",
    deliveryFee: "₹20",
    discount: "15% OFF",
    emoji: "🥗",
    image: "https://via.placeholder.com/300x200?text=Green+Bowl",
  },
];

const PROMOTIONS = [
  { id: 1, title: "🔥 Flat 30% OFF", subtitle: "On orders above ₹399", color: "#FF6B6B" },
  { id: 2, title: "🎉 Free Delivery", subtitle: "On orders above ₹500", color: "#4ECDC4" },
  { id: 3, title: "💰 Cashback 50%", subtitle: "Up to ₹200", color: "#FFD93D" },
];

export default function Home({ onLogout, onViewCart, onViewFoodDetails, onViewOrders, cartItems, onAddToCart }) {
  const [userData, setUserData] = useState()
  const pincode = userData?.address?.pincode || 224001;
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchText, setSearchText] = useState("");
  // const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [cartItemsLocal, setCartItemsLocal] = useState(cartItems || {});
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [page, setPage] = useState(1)
  const [pageData, setPageData] = useState([])
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const didInitialFetch = useRef(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user/profile`)
        if (!res.ok) throw new Error()
        const resData = await res.json()
        await AsyncStorage.setItem("userData", JSON.stringify(resData.data))
      } catch (error) {
        console.log(error)
      }
    }
    const getUserData = async () => {
      const data = await AsyncStorage.getItem("userData")
      setUserData(JSON.parse(data))
    }
    getUserData()
    getProfile()
  }, [])

  const fetchFoodsByPincode = async (reset = false) => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const response = await fetch(
      `${BASE_URL}/foods/discover?pincode=${pincode}&page=${page}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );

    const resData = await response.json();

    if (resData.data.length === 0) {
      setHasMore(false);
    } else {
      setPageData(prev =>
        reset ? resData.data : [...prev, ...resData.data]
      );
    }

    setLoadingMore(false);
  };

  useEffect(() => {
    if (!pincode) return;
    if (didInitialFetch.current) return;

    didInitialFetch.current = true;
    setPage(1);
    setHasMore(true);
    fetchFoodsByPincode(true);
  }, [pincode]);


  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchFoodsByPincode();
    }
  }, [page]);

  // Calculate total items in cart
  const cartCount = Object.values(cartItemsLocal).reduce((sum, qty) => sum + qty, 0);

  const handleLogout = async () => {
    console.log("Logout button pressed");
    await AsyncStorage.clear()
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userData");
    navigation.replace("Login")
    setProfileModalVisible(false);
    if (onLogout) onLogout();
  };

  const filteredRestaurants =
    selectedCategory === 1
      ? RESTAURANTS
      : RESTAURANTS.filter((r) => {
        const category = CATEGORIES.find((c) => c.id === selectedCategory);
        return r.cuisine.toLowerCase().includes(category.name.toLowerCase());
      });

  const searchedRestaurants = filteredRestaurants.filter((r) =>
    r.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const searchRestaurantsAndFoods = async (query, reset = false) => {
    const res = await fetch(
      `${BASE_URL}/restaurant/search?q=${query}&page=${page}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );

    const json = await res.json();

    const foods = json.data.flatMap(r =>
      r.foods.map(f => ({ ...f, restaurant: r }))
    );

    if (foods.length === 0) setHasMore(false);

    // setPageData(prev => (reset ? foods : [...prev, ...foods]));
    setPageData(prev => {
      const map = new Map(prev.map(i => [i._id, i]));
      foods.forEach(f => map.set(f._id, f));
      return Array.from(map.values());
    });
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);

    if (searchText.trim().length > 0) {
      searchRestaurantsAndFoods(searchText, true);
    } else {
      fetchFoodsByPincode(true);
    }
  }, [searchText]);

  const addToCart = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/user/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
        },
        body: JSON.stringify({ foodId: id })
      })
      const resData = await res.json()

      if (!res.ok) {
        throw new Error(resData.message)
      }
    } catch (error) {
      console.log(error)
    }
  };

  const removeFromCart = (restaurantId) => {
    const newCart = { ...cartItemsLocal };
    if (newCart[restaurantId] > 1) {
      newCart[restaurantId] -= 1;
    } else {
      delete newCart[restaurantId];
    }
    setCartItemsLocal(newCart);
  };

  const FoodImage = ({ image }) => {
    const [error, setError] = useState(false);

    return (
      <Image
        source={
          !error && image
            ? { uri: image }
            : require("../../assets/fallbackFoodImage.jpg")
        }
        style={styles.placeholderImage}
        resizeMode="cover"
        onError={() => setError(true)}
      />
    );
  };

  const renderRestaurantCard = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.restaurantCard} onPress={() => onViewFoodDetails?.(item._id)}>
      {/* Image Section */}
      <View style={styles.cardImageContainer}>
        <View style={styles.placeholderImage}>
          {/* <Text style={styles.placeholderEmoji}>{item.image[0] }</Text> */}
          <FoodImage image={item.image?.[0]} />

        </View>
        {item?.discount && <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount || ""}</Text>
        </View>}
      </View>

      {/* Content Section */}
      <View style={styles.cardContent}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.cuisineType}>From: {item.restaurant.name}</Text>

        {/* Rating and Delivery Info */}
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating || 4.3}</Text>
          </View>
          <Text style={styles.deliveryTime}>{item?.restaurant?.deliveryTime} min</Text>
          <Text style={styles.deliveryFee}>₹{item?.restaurant?.deliveryCharge}</Text>
        </View>

        {/* Add to Cart Button */}
        <View style={styles.cartControls}>
          {cartItemsLocal[item._id] ? (
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => removeFromCart(item._id)}
              >
                <Text style={styles.counterText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{cartItemsLocal[item._id]}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => addToCart(item._id)}
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item._id)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  console.log("userData", userData)
  return (
    <>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeftSection}>
              {/* <TouchableOpacity
                style={styles.menuToggle}
                onPress={() => {
                  console.log("Menu toggle pressed");
                  setSidebarVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>☰</Text>
              </TouchableOpacity> */}
              <View>
                <Text style={styles.greeting}>{userData?.address?.label || "Home"}</Text>
                <Text style={styles.location}>📍 {userData?.address?.pincode || "Enter Pincode"}</Text>
              </View>
            </View>
            <View style={styles.headerRightSection}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => {
                  console.log("Cart icon pressed, onViewCart:", typeof onViewCart);
                  navigation.push("Cart");
                  if (onViewCart) onViewCart();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cartIcon}>🛒</Text>
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ordersButton}
                onPress={() => {
                  console.log("Orders icon pressed, onViewOrders:", typeof onViewOrders);
                  if (onViewOrders) onViewOrders();
                  navigation.push("MyOrders")
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.ordersIcon}>📋</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setProfileModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutIcon}>👤</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for restaurants..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Promotions Carousel */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.promotionsScroll}
        >
          {PROMOTIONS.map((promo) => (
            <TouchableOpacity
              key={promo.id}
              style={[styles.promotionBanner, { backgroundColor: promo.color }]}
              activeOpacity={0.8}
            >
              <Text style={styles.promoTitle}>{promo.title}</Text>
              <Text style={styles.promoSubtitle}>{promo.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        {/* Categories */}
        {/* <View style={styles.categoriesSection}>
          <Text style={styles.sectionLabel}>Browse Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View> */}

        {/* Restaurants List */}
        <FlatList
          data={pageData}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item._id.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.restaurantsList}

          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.header}>
                {/* KEEP YOUR EXISTING HEADER JSX HERE */}
              </View>

              {/* Section Title */}
              <View style={styles.restaurantsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionLabel}>Top Foods</Text>
                </View>
              </View>
            </>
          }

          ListFooterComponent={
            loadingMore ? (
              <Text style={{ textAlign: "center", padding: 16 }}>
                Loading more...
              </Text>
            ) : null
          }

          ListEmptyComponent={
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No Food Items found</Text>
            </View>
          }
        />


        {/* Footer */}
        {/* <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutFooterButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutFooterText} onPress={async () => {
              await AsyncStorage.clear()
            }}>🚪 Logout</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setProfileModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>My Profile</Text>
            <View style={{ width: 50 }} />
          </View>

          {/* Profile Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Profile Avatar */}
            <View style={styles.profileAvatarContainer}>
              <View style={styles.profileAvatar}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
              <Text style={styles.profilePhone}>📱 +91 9876543210</Text>
            </View>

            {/* Profile Options */}
            <View style={styles.profileOptionsContainer}>
              {/* <TouchableOpacity style={styles.profileOption} activeOpacity={0.7}>
                <Text style={styles.optionIcon}>❤️</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Favorites</Text>
                  <Text style={styles.optionSubtitle}>Your favorite restaurants</Text>
                </View>
              </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.profileOption} activeOpacity={0.7}>
                <Text style={styles.optionIcon}>📋</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Orders</Text>
                  <Text style={styles.optionSubtitle}>View order history</Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.profileOption} activeOpacity={0.7}
                onPress={() => {
                  console.log("Address pressed");
                  setProfileModalVisible(false);
                  setTimeout(() => navigation.push("AddressList"), 100);
                }}>
                <Text style={styles.optionIcon}>📍</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Addresses</Text>
                  <Text style={styles.optionSubtitle}>Manage delivery addresses</Text>
                </View>
              </TouchableOpacity>

              {userData?.role === "restaurant_admin" && <TouchableOpacity style={styles.profileOption} activeOpacity={0.7}
                onPress={() => {
                  setProfileModalVisible(false);
                  setTimeout(() => navigation.push("Restaurant"), 100);
                }}>
                <Text style={styles.optionIcon}>⚙️</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>My Restaurant</Text>
                  <Text style={styles.optionSubtitle}>Manage Your Foods </Text>
                </View>
              </TouchableOpacity>}
              {userData?.role === "admin" && <TouchableOpacity style={styles.profileOption} activeOpacity={0.7}
                onPress={() => {
                  setProfileModalVisible(false);
                  setTimeout(() => navigation.push("ApproveRestaurants"), 100);
                }}>
                <Text style={styles.optionIcon}>🛡️</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Restaurants List</Text>
                  <Text style={styles.optionSubtitle}>Approve restaurants</Text>
                </View>
              </TouchableOpacity>}

              {/* <TouchableOpacity style={styles.profileOption} activeOpacity={0.7}>
                <Text style={styles.optionIcon}>💳</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Payment Methods</Text>
                  <Text style={styles.optionSubtitle}>Manage payment options</Text>
                </View>
              </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.profileOption} activeOpacity={0.7}>
                <Text style={styles.optionIcon}>⚙️</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Settings</Text>
                  <Text style={styles.optionSubtitle}>Preferences and notifications</Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.profileOption} activeOpacity={0.7}>
                <Text style={styles.optionIcon}>🆘</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Help & Support</Text>
                  <Text style={styles.optionSubtitle}>Contact us or get help</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutModalButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutModalText}>🚪 Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.sidebarOverlay}>
          {/* Sidebar Panel */}
          <View style={styles.sidebarPanel}>
            {/* Sidebar Header */}
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>🍔 Foodie</Text>
              <TouchableOpacity
                onPress={() => setSidebarVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Sidebar Menu Items */}
            <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.sidebarMenuItem}
                onPress={() => setSidebarVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarItemIcon}>🏠</Text>
                <Text style={styles.sidebarItemText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sidebarMenuItem}
                onPress={() => {
                  console.log("Sidebar: Cart clicked");
                  setSidebarVisible(false);
                  if (onViewCart) {
                    console.log("Navigating to cart");
                    onViewCart();
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarItemIcon}>🛒</Text>
                <Text style={styles.sidebarItemText}>Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sidebarMenuItem}
                onPress={() => {
                  console.log("Sidebar: Food Menu clicked");
                  setSidebarVisible(false);
                  if (onViewFoodDetails) {
                    console.log("Navigating to food details");
                    onViewFoodDetails(1);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarItemIcon}>🍽️</Text>
                <Text style={styles.sidebarItemText}>Food Menu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sidebarMenuItem}
                onPress={() => {
                  console.log("Sidebar: Orders clicked");
                  setSidebarVisible(false);
                  if (onViewOrders) {
                    console.log("Navigating to orders");
                    onViewOrders();
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarItemIcon}>📋</Text>
                <Text style={styles.sidebarItemText}>Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sidebarMenuItem}
                onPress={() => {
                  console.log("Sidebar: Payment clicked");
                  setSidebarVisible(false);
                  if (onViewCart) {
                    console.log("Navigating to payment (via cart)");
                    onViewCart();
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarItemIcon}>💳</Text>
                <Text style={styles.sidebarItemText}>Payment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sidebarMenuItem}
                onPress={() => {
                  setProfileModalVisible(true);
                  setSidebarVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarItemIcon}>👤</Text>
                <Text style={styles.sidebarItemText}>Account</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Sidebar Footer */}
            <View style={styles.sidebarFooter}>
              <View style={styles.sidebarDivider} />
              <TouchableOpacity
                style={styles.sidebarLogoutItem}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.sidebarLogoutIcon}>🚪</Text>
                <Text style={styles.sidebarLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Backdrop */}
          <TouchableOpacity
            style={styles.sidebarBackdrop}
            onPress={() => setSidebarVisible(false)}
            activeOpacity={1}
          />
        </View>
      </Modal>
    </>
  );
}




const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* ===== HEADER ===== */
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F1F1F",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIcon: {
    fontSize: 22,
  },

  /* ===== HEADER RIGHT SECTION ===== */
  headerRightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartIcon: {
    fontSize: 22,
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  ordersButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  ordersIcon: {
    fontSize: 22,
  },

  /* ===== SEARCH BAR ===== */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F1F1F",
  },

  /* ===== PROMOTIONS ===== */
  promotionsScroll: {
    marginTop: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  promotionBanner: {
    width: width - 50,
    marginRight: 12,
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  promoSubtitle: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
  },

  /* ===== CATEGORIES ===== */
  categoriesSection: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonActive: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FF9800",
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  categoryTextActive: {
    color: "#FF9800",
  },

  /* ===== RESTAURANTS SECTION ===== */
  restaurantsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FF9800",
  },
  restaurantsList: {
    paddingBottom: 16,
  },

  /* ===== RESTAURANT CARD ===== */
  restaurantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 5,
    shadowColor: "#FF9800",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    transform: [{ scale: 1 }],
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
    backgroundColor: "#F5F5F5",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  cardContent: {
    padding: 14,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 4,
  },
  cuisineType: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
    opacity: 0.75,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF9800",
  },
  deliveryTime: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginRight: 12,
  },
  deliveryFee: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },

  /* ===== CART CONTROLS ===== */
  cartControls: {
    width: "100%",
  },
  addButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  counterValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF9800",
  },

  /* ===== NO RESULTS ===== */
  noResults: {
    paddingVertical: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
  noResultsText2: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    opacity: 0.75
  },

  /* ===== FOOTER ===== */
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  logoutFooterButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#FFE0B2",
    alignItems: "center",
  },
  logoutFooterText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF6F00",
  },

  /* ===== PROFILE MODAL ===== */
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF9800",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F1F1F",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  /* ===== PROFILE AVATAR ===== */
  profileAvatarContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F1F1F",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: "#FF9800",
    fontWeight: "600",
  },

  /* ===== PROFILE OPTIONS ===== */
  profileOptionsContainer: {
    marginBottom: 20,
  },
  profileOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#999",
  },

  /* ===== LOGOUT MODAL BUTTON ===== */
  logoutModalButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#FF6B6B",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoutModalText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* ===== HEADER LEFT SECTION ===== */
  headerLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 22,
    color: "#1F1F1F",
    fontWeight: "700",
  },

  /* ===== SIDEBAR ===== */
  sidebarOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  sidebarPanel: {
    flex: 0,
    width: width * 0.75,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 2, height: 0 },
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FF9800",
  },
  closeIcon: {
    fontSize: 24,
    color: "#999",
    fontWeight: "700",
  },
  sidebarContent: {
    flex: 1,
    paddingVertical: 16,
  },
  sidebarMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 10,
  },
  sidebarItemIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  sidebarFooter: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  sidebarLogoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#FFE0B2",
  },
  sidebarLogoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sidebarLogoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF6F00",
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});


