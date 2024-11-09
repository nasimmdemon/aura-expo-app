import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill out all the forms");
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <ScrollView>
        <View className="justify-center min-h-[75vh] px-4">
          <Image
            source={images.logo}
            resizeMethod="contain"
            className="h-[35px] w-[115px]"
          />
          <Text className="text-white text-2xl font-psemibold mt-10">
            Sign Up to Aura
          </Text>
          <FormField
            title="User Name"
            value={form.username}
            handleChange={(e) => {
              setForm({ ...form, username: e });
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChange={(e) => {
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChange={(e) => {
              setForm({ ...form, password: e });
            }}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            containerStyles={`mt-4 `}
            isLoading={isSubmitting}
            handlePress={() => {
              submit();
            }}
          />
        </View>

        <View className="flex items-center mt-2">
          <Text className="text-white">
            Already have an account?{" "}
            <Link href="/sign-in">
              <Text className="text-secondary ">Sign In</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
