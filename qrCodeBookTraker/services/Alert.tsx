import { Vibration } from "react-native";

export const handleLoginEmptyFields = (email: string, password: string) => {
    if (!password || !email) {
      alert("Fill required fields!");
      Vibration.vibrate(2000);
      return true;
    }
    return false;
};
  
export const handleSignUpEmptyFields = (email: string, password: string, confirmPassword: string) => {
  if (password.length <= 0 || email.length <= 0) {
    alert("Fill required fields!");
    Vibration.vibrate(2000);
    return true;
  }
  return false;
};

export const handleSignUpEqualPasswords = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    alert("Password didn't match!");
    Vibration.vibrate(2000);
    return true;
  }
  return false;
};