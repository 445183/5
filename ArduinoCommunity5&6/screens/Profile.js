import React, { Component } from "react";
import { StyleSheet, Text,Image, View ,Switch} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from 'firebase';

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      user:'',
      profile:'',
      currentheme:'',
      isLightTheme:false,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
  fetchUser=async()=>{
    let user,currentheme,profilePic
    await firebase.database().ref('/users/'+firebase.auth().currentUser.uid).on('value',function(snapshot){
      user=snapshot.val().first_name +' '+snapshot.val().last_name
      currentheme=snapshot.val().current_theme
      profilePic=snapshot.val().profile_picture
    })
    this.setState({
      user:user,
      profile:profilePic,
      currentheme:currentheme,
      isLightTheme:currentheme==='dark'?false:true,
    })
  }
  toggleSwitch=async()=>{
    await firebase.database().ref('/users/'+firebase.auth().currentUser.uid).update({
      current_theme:this.state.currentheme==='dark'?'light':'dark'
    })
    this.setState({currentheme:this.state.currentheme==='dark'?'light':'dark',isLightTheme:this.state.currentheme==='dark'?true:false})
  }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />
    } else {
      return (
        <View style={styles.container}>
          <Image source={{uri:this.state.profile}} style={{width:RFValue(175),height:RFValue(175),borderRadius:225}}/>
          <Text>Name :{this.state.user}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={this.state.isLightTheme ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={()=>{
              this.toggleSwitch();
            }}
            value={this.state.isLightTheme}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
