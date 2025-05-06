import {
  BackHandler,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Icons from "@expo/vector-icons/Feather";
import Menu from "@/components/menu";
import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "@/context/user.context";
import { IOrder } from "@/interface/IOrder";
import { IOrderItem } from "@/interface/IOrderItem";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { IApiResponse } from "@/interface/IApiResponse";
import { OrderEndpoint } from "@/fuctions/order.endpoint";
import ButtonToAction from "@/components/buttonToAction";
import Popup from "@/components/popup";
import PageContext from "@/context/page.context";

export default function FinishOrder() {
  const userContext = useContext(UserContext);
  const pageContext = useContext(PageContext);
  const orderEndpoint: OrderEndpoint = new OrderEndpoint();

  const [order, setOrder] =
    useState<
      Pick<IOrder, "uuid" | "createdAt" | "modifiedAt" | "finishedAt">
    >();

  const [itemList, setItemList] = useState<IOrderItem[]>([]);
  const [itemsToRemove, setItemsToRemove] = useState<IOrderItem[]>([]);
  const [bill, setBill] = useState<number>(0);

  BackHandler.addEventListener("hardwareBackPress", () => {
    router.back();
    return true;
  });

  const { tableID, tableName } = useLocalSearchParams<{
    tableID: string;
    tableName: string;
  }>();

  async function orderByTableID() {
    try {
      const refreshToken: string | null = await userContext.getRefreshToken();
      const token = await userContext.generateJwtToken(refreshToken);
      const apiResponse: IApiResponse = await orderEndpoint.getByTableID(
        Number(tableID),
        token
      );
      if (apiResponse.statusCode !== 200) {
        console.log(
          `getByTableID endpoint failed | err: ${JSON.stringify(
            apiResponse.data
          )}`
        );
        return;
      } else {
        setOrder(apiResponse.data);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getOrderItemsByOrderID() {
    try {
      if (order) {
        const refreshToken: string | null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        const apiResponse: IApiResponse =
          await orderEndpoint.getSpecificOrderItems(order.uuid, token);
        if (apiResponse.statusCode !== 200) {
          console.log(
            `get order's items endpoint failed | err: ${JSON.stringify(
              apiResponse.data
            )}`
          );
          return;
        } else {
          setItemList(apiResponse.data);
        }
      } else {
        console.log("No order to fetch!");
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function printOrder() {
    try {
      if (order !== undefined) {
        const refreshToken: string | null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        const apiResponse: IApiResponse = await orderEndpoint.printOrder(
          order.uuid,
          token
        );
        if (apiResponse.statusCode !== 200) {
          console.log(
            `print order's items endpoint failed | err: ${JSON.stringify(
              apiResponse.data
            )}`
          );
          return;
        }
      } else {
        console.log("No order to fetch!");
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function finishOrderFunction() {
    try {
      if (order !== undefined) {
        const refreshToken: string | null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        const apiResponse: IApiResponse = await orderEndpoint.finishOrder(
          order.uuid,
          token
        );
        if (apiResponse.statusCode !== 200) {
          console.log(`finish order's items endpoint failed | err: ${ JSON.stringify(apiResponse.data) }`
          );
          return;
        }
        router.replace("/(tabs)/(tables)");
      } else {
        console.log("No order to fetch!");
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function finalBill() {
    let subTotal: number = 0;
    itemList.forEach((orderItem) => {
      subTotal += orderItem.item.price * orderItem.quantity;
    });

    setBill(subTotal);
  }

  useFocusEffect(
    useCallback(() => {
      orderByTableID();
    }, [])
  );

  useEffect(() => {
    if (order) {
      getOrderItemsByOrderID();
    }
  }, [order]);

  useEffect(() => {
    finalBill();
  }, [itemList]);

  useEffect(() => {
    if (pageContext?.isPositive) {
      finishOrderFunction();
    }
  }, [pageContext?.isPositive]);

  return (
    <SafeAreaView style={finishOrder.container}>
      <View style={finishOrder.menuComponent}>
        <View style={{ maxHeight: "60%" }}>
          <Menu
            orderItemList={itemList}
            setOrderItemList={setItemList}
            posActionItemList={itemsToRemove}
            showHeader={false}
            goBackFunction={() => router.back()}
            title="FINALIZAR MESA"
            subtitle={`MESA ${tableName}`}
            isQuantityChangeable={false}
            bottomButton={[]}
          />
        </View>

        <View
          style={{ position: "relative", marginTop: -20, paddingInline: 40 }}
        >
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              SOMATÓRIA:
            </Text>

            <Text style={{ color: "151515", fontSize: 18, textAlign: "right" }}>
              {bill.toFixed(2)}
            </Text>
            <Text style={{ color: "151515", fontSize: 18, textAlign: "right" }}>
              <Text style={{ fontSize: 15 }}>10%</Text> +{" "}
              {(bill * 0.1).toFixed(2)}
            </Text>
            <Text style={{ textAlign: "right", marginTop: -15 }}>
              _________
            </Text>
            <Text style={{ color: "151515", fontSize: 20, textAlign: "right" }}>
              TOTAL: R${(bill + bill * 0.1).toFixed(2)}
            </Text>
          </View>

          <View style={{ height: "30%", marginTop: 10, padding: 20 }}>
            <ButtonToAction
              onPress={() => {
                printOrder(),
                  pageContext?.setShowPopup(true),
                  pageContext?.setPopupSettings({
                    title: "A impressão foi concluída com sucesso?",
                    buttonTitle: "sim",
                  });
              }}
              buttonTitle="Fechar Conta"
              textStyle={{
                color: "#C1C1C1",
                fontSize: 13,
              }}
              buttonStyle={{
                backgroundColor: "#255247",
              }}
              isDisabled={false}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const finishOrder = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",

    backgroundColor: "#181818",

    margin: "auto",
  },

  menuComponent: {
    margin: "auto",

    backgroundColor: "#C1C1C1",

    width: "90%",
    height: "90%",
  },
});
