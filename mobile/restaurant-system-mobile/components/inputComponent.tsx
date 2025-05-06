import { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

import Icons from "@expo/vector-icons/Feather";

interface InputElement {
  inputBgColor: string;
  inputTextColor: string;
  placeholderText: string;
  isPassword: boolean;
  isNumeric: boolean;
  setInputValue: React.Dispatch<React.SetStateAction<any>>;
  customFontSize?: number;
  onFocusFunction?: () => void;
  defaultValue?: string
}

export default function InputComponent({
  inputBgColor,
  inputTextColor,
  placeholderText,
  isPassword,
  setInputValue,
  isNumeric,
  customFontSize,
  onFocusFunction,
  defaultValue
}: InputElement) {
  const [seePassword, setSeePassword] = useState(isPassword);

  return (
    <View>
      <TextInput
        keyboardType={isNumeric ? "numeric" : "default"}
        pointerEvents="box-none"
        style={[
          inputStyle.input,
          {
            backgroundColor: inputBgColor,
            color: inputTextColor,
            fontSize: customFontSize || 15,
          },
        ]}
        placeholder={placeholderText}
        placeholderTextColor={"grey"}
        secureTextEntry={seePassword}
        autoCapitalize="none"
        onChangeText={(ev) => setInputValue(ev.valueOf())}
        onFocus={onFocusFunction}
        defaultValue={defaultValue}
      />

      {isPassword && seePassword ? (
        <Icons
          style={{
            position: "absolute",
            right: 0,
            marginRight: 20,
            marginTop: 2,
            padding: 10,
            zIndex: 100,
          }}
          name="eye"
          size={25}
          onPress={() =>
            setSeePassword((prev) => {
              return !prev;
            })
          }
        />
      ) : isPassword && !seePassword ? (
        <Icons
          style={{
            position: "absolute",
            right: 0,
            marginRight: 20,
            marginTop: 2,
            padding: 10,
            zIndex: 100,
          }}
          name="eye-off"
          size={25}
          onPress={() =>
            setSeePassword((prev) => {
              return !prev;
            })
          }
        />
      ) : null}
    </View>
  );
}

const inputStyle = StyleSheet.create({
  input: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    padding: 15,
  },
});
