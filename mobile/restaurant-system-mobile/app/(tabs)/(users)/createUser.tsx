import InputComponent from "@/components/inputComponent";
import { useContext, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Icons from "@expo/vector-icons/Feather";
import UserContext from "@/context/user.context";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";
import { router } from "expo-router";
import { IApiResponse } from "@/interface/IApiResponse";
import { UserEndpoint } from "@/fuctions/user.endpoint";
import ProjectSelectInput from "@/components/projectSelectInput";
import { UserRole } from "@/enum/UserRole";
import CreateUserDTO from "@/dto/createUser.dto";
import UserComponent from "@/components/userComponent";

const blackboardBG = require("../../../assets/images/blackboard_bg.png");

export default function CreateUser() {
  return(
  <UserComponent
    screenCategory="create"
  />
)

}