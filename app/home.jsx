import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function Home({ onLogout }) {
  const handleLogout = () => {
    console.log("Logout button pressed");
    if (onLogout) onLogout();
  };

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>

        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍔 Foodie</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuTabs}>
          <Text style={[styles.tab, styles.activeTab]}>All</Text>
          <Text style={styles.tab}>Pizza</Text>
          <Text style={styles.tab}>Burger</Text>
          <Text style={styles.tab}>Biryani</Text>
          <Text style={styles.tab}>Chinese</Text>
          <Text style={styles.tab}>Desserts</Text>
        </ScrollView>

        {/* Offer Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>🔥 Flat 30% OFF</Text>
          <Text style={styles.bannerSub}>On your first order</Text>
        </View>

        {/* Section */}
        <Text style={styles.sectionTitle}>Popular Near You</Text>

        {/* Food Cards */}
        <View style={styles.foodCard}>
          <View>
            <Text style={styles.foodName}>🍱 Chicken Biryani</Text>
            <Text style={styles.foodDesc}>Spicy • Bestseller</Text>
            <Text style={styles.foodPrice}>₹199</Text>
          </View>
        </View>

        <View style={styles.foodCard}>
          <View>
            <Text style={styles.foodName}>🍔 Cheese Burger</Text>
            <Text style={styles.foodDesc}>Juicy • Loaded Cheese</Text>
            <Text style={styles.foodPrice}>₹149</Text>
          </View>
        </View>

        <View style={styles.foodCard}>
          <View>
            <Text style={styles.foodName}>🍕 Margherita Pizza</Text>
            <Text style={styles.foodDesc}>Classic • Fresh Cheese</Text>
            <Text style={styles.foodPrice}>₹249</Text>
          </View>
        </View>

        <View style={styles.foodCard}>
          <View>
            <Text style={styles.foodName}>🍜 Veg Hakka Noodles</Text>
            <Text style={styles.foodDesc}>Chinese • Medium Spicy</Text>
            <Text style={styles.foodPrice}>₹129</Text>
          </View>
        </View>

        <View style={styles.foodCard}>
          <View>
            <Text style={styles.foodName}>🍗 Fried Chicken</Text>
            <Text style={styles.foodDesc}>Crispy • Hot</Text>
            <Text style={styles.foodPrice}>₹179</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}




const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  container: {
    padding: 16,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E53935",
  },
  logout: {
    fontSize: 14,
    color: "#E53935",
    fontWeight: "600",
  },

  /* Menu Tabs */
  menuTabs: {
    marginBottom: 20,
  },
  tab: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 14,
    color: "#555",
  },
  activeTab: {
    backgroundColor: "#E53935",
    color: "#fff",
  },

  /* Banner */
  banner: {
    backgroundColor: "#E53935",
    borderRadius: 14,
    padding: 20,
    marginBottom: 25,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  bannerSub: {
    fontSize: 14,
    color: "#FFECEC",
    marginTop: 6,
  },

  /* Section */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  /* Food Card */
  foodCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  foodDesc: {
    fontSize: 12,
    color: "#777",
    marginVertical: 6,
  },
  foodPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#E53935",
  },
});


