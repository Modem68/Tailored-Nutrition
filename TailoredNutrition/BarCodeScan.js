import React, { Component }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { BarCodeScanner, Permissions } from 'expo';
import ScanResults from './ScanResults';

const searchAPI = 'https://trackapi.nutritionix.com/v2/search/item?upc=';

// The app page responsible for the bar code scanner of food.
export default class BarCodeScan extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      item: [],
      itemNate: '',
      alreadyScanned: false,
    };
    this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
  }
  
  async componentWillMount() {



    //REMOVE WHEN DONE

    //Used for testing, don't remove until we're done with logging.
  //   fetch (searchAPI+"06827465", {
  //     method: 'GET',
  //     headers: new Headers( {
  //       'x-app-id': 'beeef40f',
  //       'x-app-key': 'cb4cbe72b287f9c795ac894f3ef544fd',
  //       'x-remote-user-id' : 0
  //     })
  //   }).then(response => {
  //     //console.log("Response", response);
  //     return response.json();
  // }).then(responseData => {
  //     ///console.log("Response Data", responseData);
  //     this._handleResponse(responseData);
  //     this.setState({alreadyScanned: true})
  //     return responseData;
  // })














    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    console.log("State",this.state.hasCameraPermission)
    }

    _handleBarCodeRead = ({ type, data,props }) => {
    if (this.state.alreadyScanned === false){
      
      var self = this;

      fetch (searchAPI+data, {
        method: 'GET',
        headers: new Headers( {
          'x-app-id': 'beeef40f',
          'x-app-key': 'cb4cbe72b287f9c795ac894f3ef544fd',
          'x-remote-user-id' : 0
        })
      }).then(response => {
        //console.log("Response", response);
        return response.json();
    }).then(responseData => {
        ///console.log("Response Data", responseData);
        this._handleResponse(responseData);
        this.setState({alreadyScanned: true})
        return responseData;
    })
      .catch((error) => {
        console.error(error);
      });
    }
    }
    _handleResponse = (response) => {
        
      //console.log("Response Handler", response);
      this.setState({item: response});
      console.log(this.state.item);
      alert(this.state.item.foods[0].brand_name+" "+this.state.item.foods[0].food_name);
      return this.props.navigation.navigate('ScanResult',{item: this.state.item.foods[0]});
  };
  render() {
	  // This will make sure that the app has permission from the camera on the phone before it is able to read barcodes.
    const { hasCameraPermission } = this.state;
    console.log("State", this.state.item)
    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style = {{flex: 1}}>
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={StyleSheet.absoluteFill}
            />

        </View>
        
          
      );
    }
  }

  
}