import React, { useState,useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet ,Alert} from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NavigationProp } from '@react-navigation/native';
import { validateOTP } from "../../../services/otpService";
import {RootParamList}  from "../../../navigation/type";

interface OTPVerificationProps {
  navigation: NavigationProp<any>;
}

const OTPVerification = () => {
  const [otp, setOTP] = useState("");
  const route =
    useRoute<RouteProp<RootParamList, "OTPVerification">>();
  const navigation = useNavigation();
  const { login } = useAuth();

  const phoneNumber = route.params?.phoneNumber;

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    try {
      // Validate OTP and get the user object
      const user = await validateOTP(phoneNumber, otp);
      if (user) {
        login(user); // Call login with the user object
        Alert.alert("Success", "OTP Verified!");
        // Redirect based on the user role
        // navigation.reset({
        //   index: 0,
        //   routes: [
        //     { name: user.role === "admin" ? "AdminNavigator" as never : "DriverNavigator" as never },
        //   ],
        // });
      }
    } catch (error) {
      Alert.alert(
        "Invalid OTP",
        "The OTP entered is incorrect. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOTP}
      />
      <Button title="Verify OTP" onPress={handleVerifyOTP} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default OTPVerification;
