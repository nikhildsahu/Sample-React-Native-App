import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
  Modal,
  TouchableHighlight,
  TextInput,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Card,
  CardItem,
  Form,
  Item,
  Input,
  Label,
  Toast,
} from "native-base";
import { LineChart, XAxis, Grid } from "react-native-svg-charts";
import database from "@react-native-firebase/database";

const reference = database().ref("/users/123");

import LottieView from "lottie-react-native";
import { Component } from "react";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: [50, 10],
      graphDate: ["16/12", "17/12"],
      money: "",
      modalVisible: false,
      inpDate: "",
      inpCost: "",
      inpCon: "",
      error: "",
    };
  }
  // handler , components funtions
  handleModal = (val) => {
    this.setState({ modalVisible: !val });
    console.log("SS");
  };
  handleData = () => {
    if (
      this.state.inpCon.length > 0 &&
      this.state.inpCost.length > 0 &&
      this.state.inpDate.length > 0
    ) {
      var array = [];
      var array2 = [];
      this.handleModal(this.state.modalVisible);
      // set
      database()
        .ref()
        .child("cost")
        .set(parseInt(this.state.money) + parseInt(this.state.inpCost));

      database()
        .ref()
        .child("dailyReadings")
        .child(this.state.inpDate)
        .set(parseInt(this.state.inpCon));
      // new data
      database()
        .ref("/dailyReadings")
        .once("value")
        .then((snapshot) => {
          snapshot.forEach((data) => {
            console.log(data.val());
            array.push(data.val());
            array2.push(data.key);
            this.setState({ graphData: array });
            this.setState({ graphDate: array2 });
            // console.log(this.state.graphData);
          });
        });

      this.setState({ inpDate: "" });
      this.setState({ inpCon: "" });
      this.setState({ inpCost: "" });
      this.setState({ error: "" });
    } else {
      this.setState({ error: "Fill All!" });
    }
  };
  clearData = () => {
    // clear db
    var array = [];
    var array2 = [];
    database().ref().child("cost").set(100);
    var sample = {
      "10-12": 10,
      "11-12": 20,
      "12-12": 30,
    };
    database().ref().child("dailyReadings").set(sample);

    database()
      .ref("/dailyReadings")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((data) => {
          console.log(data.val());
          array.push(data.val());
          array2.push(data.key);
          this.setState({ graphData: array });
          this.setState({ graphDate: array2 });
          // console.log(this.state.graphData);
        });
      });
  };
  componentDidMount() {
    var array = [];
    var array2 = [];
    // get data
    database()
      .ref("/name")
      .on("value", (snapshot) => {
        console.log("User data: ", snapshot.val());
      });
    console.log("Hi,from component did mount !!");
    database()
      .ref("/cost")
      .on("value", (snapshot) => {
        // console.log("User data: ", snapshot.val());
        this.setState({ money: snapshot.val() });
      });

    database()
      .ref("/dailyReadings")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((data) => {
          console.log(data.val());
          array.push(data.val());
          array2.push(data.key);
          this.setState({ graphData: array });
          this.setState({ graphDate: array2 });
          // console.log(this.state.graphData);
        });
      });
  }

  render() {
    return (
      <Container>
        {/* header */}
        <Header
          style={{
            backgroundColor: "white",
          }}
        >
          <Left>
            <Button transparent>
              <Icon type="AntDesign" name="setting" style={styles.basecolor} />
            </Button>
          </Left>
          <Body>
            <Title style={styles.headertitle}>Diary</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon type="AntDesign" name="user" style={styles.basecolor} />
            </Button>
          </Right>
        </Header>
        {/* content */}
        <Content>
          <ScrollView>
            {/* section 1 */}
            <LottieView
              style={styles.clock}
              source={require("./assets/clock2.json")}
              autoPlay
              loop
            />
            {/* section 2 */}
            <Card style={styles.sec1card}>
              <ImageBackground
                source={require("./assets/budget.png")}
                style={{ width: "100%", height: "100%" }}
                imageStyle={{ borderRadius: 6 }}
              >
                <Text style={styles.boldtext}>Saved Money</Text>
                <Text style={styles.basetext}>This Year</Text>
                <Text style={styles.basetext}>{this.state.money + "/-"}</Text>
              </ImageBackground>
            </Card>
            {/* section 3 */}
            <Card style={styles.sec3card}>
              <ImageBackground
                source={require("./assets/health.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ marginTop: 55 }}
                  source={require("./assets/hospital.png")}
                />
                <Image
                  style={{ marginTop: 55 }}
                  source={require("./assets/heart.png")}
                />
              </ImageBackground>
            </Card>
            {/* section 4 */}
            <Card style={styles.sec4card}>
              <CardItem
                style={{
                  borderRadius: 10,
                }}
              >
                <Body style={{ alignItems: "center" }}>
                  <Text style={styles.sec4title}>Daily Notes</Text>
                </Body>
              </CardItem>
              <View style={styles.sec4graph}>
                {/* Graph */}
                <LineChart
                  style={{ flex: 1 }}
                  data={this.state.graphData}
                  gridMin={0}
                  contentInset={{ top: 10, bottom: 10 }}
                  svg={{ stroke: "rgb(134, 65, 244)" }}
                >
                  <Grid />
                </LineChart>
                <XAxis
                  style={{ marginHorizontal: -10 }}
                  data={this.state.graphData}
                  formatLabel={(value, index) => this.state.graphDate[index]}
                  contentInset={{ left: 10, right: 10 }}
                  svg={{ fontSize: 10, fill: "black" }}
                />
              </View>
            </Card>
            {/* section 5 */}
            <Card style={styles.sec4card}>
              <ImageBackground
                source={require("./assets/awards.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                }}
              ></ImageBackground>
            </Card>
          </ScrollView>
        </Content>
        {/* Data Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.modalview}>
            <View style={styles.modalview2}>
              <Text style={{ marginBottom: 15, textAlign: "center" }}>
                Daily Reading
              </Text>
              {this.state.error.length > 0 ? (
                <Text
                  style={{
                    marginBottom: 15,
                    textAlign: "center",
                    color: "red",
                  }}
                >
                  {this.state.error}
                </Text>
              ) : null}
              <Text style={{ marginBottom: 15, textAlign: "center" }}>
                Date
              </Text>
              <TextInput
                style={styles.modalinput}
                keyboardType={"numeric"}
                value={this.state.inpDate}
                onChangeText={(text) => {
                  this.setState({ inpDate: text });
                }}
              />
              <Text style={{ marginBottom: 15, textAlign: "center" }}>
                Consumption
              </Text>
              <TextInput
                style={styles.modalinput}
                keyboardType={"numeric"}
                value={this.state.inpCon}
                onChangeText={(text) => {
                  this.setState({ inpCon: text });
                }}
              />
              <Text style={{ marginBottom: 15, textAlign: "center" }}>
                Cost
              </Text>
              <TextInput
                style={styles.modalinput}
                keyboardType={"numeric"}
                value={this.state.inpCost}
                onChangeText={(text) => {
                  this.setState({ inpCost: text });
                }}
              />
              <Button
                rounded
                style={{
                  width: 100,
                  alignSelf: "center",
                  marginTop: 15,
                }}
                onPress={() => {
                  this.handleData();
                  console.log(
                    this.state.inpDate + this.state.inpCost + this.state.inpCon
                  );
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    marginLeft: 35,
                  }}
                >
                  Add
                </Text>
              </Button>
              <Button
                rounded
                dark
                style={{
                  width: 100,
                  alignSelf: "center",
                  marginTop: 15,
                }}
                onPress={() => {
                  this.handleModal(this.state.modalVisible);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    marginLeft: 35,
                  }}
                >
                  Close
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
        {/* Bottom Tabs*/}
        <Footer
          style={{
            backgroundColor: "#fffff",
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          <FooterTab
            style={{
              backgroundColor: "white",
              tabActiveBgColor: "white",
              tabBarTextColor: "#000000",
              flex: 1,
              elevation: 3,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                this.handleModal(this.state.modalVisible);
              }}
            >
              <Button>
                <Icon
                  type="AntDesign"
                  name="pluscircleo"
                  style={{ color: "#0A8AFF" }}
                />
                <Text>Add</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                this.clearData();
              }}
            >
              <Button>
                <Icon
                  type="AntDesign"
                  name="minuscircleo"
                  style={{ color: "#0A8AFF" }}
                />
                <Text>Clear</Text>
              </Button>
            </TouchableOpacity>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  basecolor: {
    color: "#0A8AFF",
  },
  headertitle: {
    alignSelf: "center",
    marginLeft: 75,
    color: "#0A8AFF",
  },
  clock: { width: "55%", alignSelf: "center", marginTop: 20 },
  sec1card: {
    marginTop: 45,
    borderRadius: 10,
    marginLeft: 25,
    marginRight: 25,
    height: 170,
    backgroundColor: "#6F64D6",
    //  box-shadow: 0px 12px 13px -5px rgba(0, 0, 0, 0.285637),
  },
  boldtext: {
    color: "white",
    marginLeft: 25,
    marginTop: 35,
    fontWeight: "bold",
    fontSize: 16,
  },
  basetext: {
    color: "white",
    marginLeft: 30,
    fontWeight: "bold",
    marginTop: 15,
    fontSize: 18,
  },
  sec3card: {
    marginTop: 45,
    elevation: 0,
    height: 350,

    //  box-shadow: 0px 12px 13px -5px rgba(0, 0, 0, 0.285637),
  },
  sec4card: {
    elevation: 0,
    height: 350,

    //  box-shadow: 0px 12px 13px -5px rgba(0, 0, 0, 0.285637),
  },
  sec4title: {
    color: "black",

    fontWeight: "bold",
    marginTop: 15,
    fontSize: 18,
  },
  sec4graph: {
    height: 200,
    paddingRight: 20,
    paddingLeft: 20,
    margin: 10,
  },
  modalview: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalview2: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    textAlign: "center",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalinput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: 150,
    borderRadius: 10,
  },
});
