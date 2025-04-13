import { BackHandler, FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";

import UserContext from "@/context/user.context";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";
import { router, useFocusEffect } from "expo-router";
import { UserEndpoint } from "@/fuctions/user.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";

import Icons from '@expo/vector-icons/Feather'

const blackboardBG = require('../../../assets/images/blackboard_bg.png')

export default function EditUser() {

  const [userList, setUserList] = useState<{email: string}[]>([]);

  const userContext = useContext(UserContext);

  const authEndpoint: AuthEndpoint = new AuthEndpoint();
  const userEndpoint: UserEndpoint = new UserEndpoint();

  async function getAllUsers() {

    let jwtToken: string|undefined = userContext.jwtToken;

    const isThisTokenValid = await authEndpoint.verifyJWTToken(jwtToken as string);
    if(!isThisTokenValid) {

      const refreshToken: string|null = await userContext.getRefreshToken();
      if(!refreshToken) {
        return router.replace('/(authentication)/login');
      };
      const newJwtToken: string|null = await userContext.generateJwtToken(refreshToken);
      if(!newJwtToken) {
        return router.replace('/(authentication)/login')
      };
      jwtToken = newJwtToken;
      
    }

    const allUsers: IApiResponse = await userEndpoint.getAll(jwtToken as string);
    if(allUsers.statusCode !== 200) {
      return console.log("Error while trying to fetch users: " + allUsers.data);
    }

    return setUserList([{email: "email@email.com"}, {email: "emailB@email.com"}]);

  }


  useFocusEffect(
      useCallback(() => {
        getAllUsers()
          return(() => {
              true
          }) 
      }, [])
  )
  

  BackHandler.addEventListener('hardwareBackPress', () => {
    router.back()
    return true
  })

  return(

    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

        <ImageBackground source={blackboardBG} style={ [{flex: 1, justifyContent: 'center', alignContent: 'center', width: '100%', height: '110%'}]} >

          <ScrollView style={editUserStyles.scrollViewContainer}>

          <View style={editUserStyles.columnContainer}>
            <Text style={editUserStyles.columnText}>Email</Text>
          </View>

            {userList.map((element) => (
              <View>

                <View style={editUserStyles.lineContainer}>
                  <Text style={editUserStyles.lineText}>{element.email.substring(0, 10)}...</Text>

                  <TouchableOpacity>
                    <Icons name="edit" size={23} style={{marginTop: 10}}/>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Icons name="trash" size={23} style={{marginTop: 10}}/>
                  </TouchableOpacity>
                </View>

              </View>
            ))}

          </ScrollView>

        </ImageBackground>

    </SafeAreaView>

  )
}

const editUserStyles = StyleSheet.create({

  scrollViewContainer: {
    flexGrow: 1,
    alignContent: 'center',
    backgroundColor: '#C1C1C1',

    width: '90%',
    margin: 'auto',
    marginTop: 90,
    marginBottom: 200
  },

  columnContainer: {  
    marginLeft: 62,
  },

  columnText: {
    fontFamily: 'inknutAntiqua-regular',
    
    marginTop: 10
  },
  
  lineContainer: {  
    flexDirection: 'row',
    justifyContent: 'space-around',

    alignItems: 'center'
  },

  lineText: {
    fontFamily: 'inknutAntiqua-regular',

    minWidth: 150,

    marginLeft: 20,
    marginTop: 10
  },
  

})