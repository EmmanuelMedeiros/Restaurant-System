import { BackHandler, FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";

import UserContext from "@/context/user.context";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";
import { router, useFocusEffect } from "expo-router";
import { UserEndpoint } from "@/fuctions/user.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";

import Icons from '@expo/vector-icons/Feather'
import { IUser } from "@/interface/IUser";
import UserComponent from "@/components/userComponent";

const blackboardBG = require('../../../assets/images/blackboard_bg.png')

export default function EditUser() {

  const [userList, setUserList] = useState<IUser[]>([]);

  const userContext = useContext(UserContext);

  const authEndpoint: AuthEndpoint = new AuthEndpoint();
  const userEndpoint: UserEndpoint = new UserEndpoint();

  const [isEditing, setIsEditing] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<IUser>();

  async function getAllUsers(): Promise<void> {

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
    setUserList(allUsers.data);
  }

  const deleteUserOnHandle = async (user: IUser) => {
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

    const response: IApiResponse = await userEndpoint.delete(user.uuid, jwtToken!);
    getAllUsers();
    if (response.statusCode !== 200) {
      return console.log("Error while trying to delete user: " + response.data);
    }
  };

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

          {isEditing
            ?
              <UserComponent
                screenCategory="edit"
                userToEdit={currentUserToEdit}
              />
            :
              <>
                <ScrollView style={editUserStyles.scrollViewContainer}>

                <View style={editUserStyles.columnContainer}>
                  <Text style={editUserStyles.columnText}>User</Text>
                </View>

                  {userList.map((element, index) => (
                    <View
                      key={index}
                    >
                    
                      <View 
                        style={editUserStyles.lineContainer}
                        key={index.toString()}
                      >
                        <Text style={editUserStyles.lineText}>{element.email.split('@')[0]}</Text>
                  
                        <TouchableOpacity
                          onPress={() => { setCurrentUserToEdit(element), setIsEditing(true) } }
                        >
                          <Icons 
                            name="edit" 
                            size={23} 
                            style={{marginTop: 10}}
                          />
                        </TouchableOpacity>
                  
                        <TouchableOpacity
                          onPress={() => deleteUserOnHandle(element)}
                        >
                          <Icons 
                            name="trash" 
                            size={23} 
                            style={{marginTop: 10}}
                          />
                        </TouchableOpacity>
                      </View>
                  
                    </View>
                  ))}

                </ScrollView>
              </>
          }


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

    textAlign: 'center',
    paddingRight: 32,
    marginTop: 10
  },
  

})