import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <ScrollView>
        <View className="min-h-[75vh]">
          <Text className="text-white text-4xl font-pbold">Home</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
