import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import pizza from "../assets/pizza.png";

const products = [
  {
    id: "1",
    category: "CATEGORY",
    name: "The Catalyzer",
    price: "$16.00",
    image: pizza,
  },
  {
    id: "2",
    category: "CATEGORY",
    name: "Shooting Stars",
    price: "$21.15",
    image: pizza,
  },
  {
    id: "3",
    category: "CATEGORY",
    name: "Neptune",
    price: "$12.00",
    image: pizza,
  },
  {
    id: "4",
    category: "CATEGORY",
    name: "The 400 Blows",
    price: "$18.40",
    image: pizza,
  },
  {
    id: "5",
    category: "CATEGORY",
    name: "The Catalyzer",
    price: "$16.00",
    image: pizza,
  },
  {
    id: "6",
    category: "CATEGORY",
    name: "Shooting Stars",
    price: "$21.15",
    image: pizza,
  },
  {
    id: "7",
    category: "CATEGORY",
    name: "Neptune",
    price: "$12.00",
    image: pizza,
  },
  {
    id: "8",
    category: "CATEGORY",
    name: "The 400 Blows",
    price: "$18.40",
    image: pizza,
  },
];

export default function CatalogScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-10">
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-evenly" }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="w-[48%] mb-6 rounded-xl shadow-sm bg-red-500">
            {/* Image */}
            <View className="relative">
              <Image
                source={item.image}
                resizeMode="contain"
                style={{ width: 200, height: 200 }}
              />

              {/* 🛒 Add to Cart */}
              <TouchableOpacity className="absolute bottom-2 right-2 bg-green-500 p-2 rounded-full">
                <Ionicons name="add" size={22} color="white" />
              </TouchableOpacity>
            </View>

            {/* Details */}
            <View className="p-3">
              <Text
                className="text-gray-900 font-semibold text-base"
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text className="text-gray-700 mt-1 text-sm">{item.price}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
