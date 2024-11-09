import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../components/FormField";
import { Link, router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { signIn, signOut, getCurrentUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLogged } = useGlobalContext();
  const submit = async () => {
    if (!form.email || !form.password) {
      await signOut();

      Alert.alert("Error", "Please fill out all the forms");
    }

    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      //set it to global state using context...
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
      throw new Error(error);
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
            Login to Aura
          </Text>

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
            title="Sign In"
            containerStyles="mt-4"
            handlePress={() => {
              submit();
            }}
            isLoading={isSubmitting}
          />
        </View>

        <View className="flex items-center mt-2">
          <Text className="text-white">
            Don't have an account?{" "}
            <Link href="/sign-up">
              <Text className="text-secondary ">Create One</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
