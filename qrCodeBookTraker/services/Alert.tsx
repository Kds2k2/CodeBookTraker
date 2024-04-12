import { Vibration } from "react-native";

export const handleLoginEmptyFields = (email: any, password: any) => {
    if (!password || !email) {
      alert("Fill required fields!");
      Vibration.vibrate(2000);
      return true;
    }
    return false;
};
  
export const handleSignUpEmptyFields = (email: any, password: any, confirmPassword: any) => {
  if (!password || !email) {
    alert("Fill required fields!");
    Vibration.vibrate(2000);
    return true;
  }
  return false;
};

export const handleSignUpEqualPasswords = (password: any, confirmPassword: any) => {
  if (password !== confirmPassword) {
    alert("Password didn't match!");
    Vibration.vibrate(2000);
    return true;
  }
  return false;
};