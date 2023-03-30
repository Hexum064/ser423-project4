
import React, { Component } from 'react';
import { Picker } from '@react-native-picker/picker'; // You'll need this for the exercise
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  OptionBox
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


const key1 = '@MyApp:option1key';
const key2 = '@MyApp:option2key';
const key3 = '@MyApp:option3key';

const pickerOptions = ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"];

export default class App extends Component {
  state = {
    option1: '',
    option2: '',
    option3: ''
  };

  componentDidMount() {
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const option1 = (await AsyncStorage.getItem(key1)) ?? 'na';
      const option2 = (await AsyncStorage.getItem(key2)) ?? 'na';
      const option3 = (await AsyncStorage.getItem(key3)) ?? 'na';

      this.setState({ option1, option2, option3 });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {
    try {
      await AsyncStorage.setItem(key1, this.state.option1);
      await AsyncStorage.setItem(key2, this.state.option2);
      await AsyncStorage.setItem(key3, this.state.option3);
      Alert.alert('Saved', 'Successfully saved on device');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'There was an error while saving the data');

    }
  }

  onChange = (text) => {
    this.setState({ text });
  }

  render() {


    return (
      <View style={styles.container}>
        <Text style={styles.preview}>Option 1: {this.state.option1}, Option 2: {this.state.option2}, Option 3: {this.state.option3}</Text>
        <View style={styles.input}>
          <View style={{ flexDirection: 'row' }}>
            <Picker style={{ flex: 1 }} mode='dropdown'
              selectedValue={this.state.option1}
              onValueChange={(value) => { this.setState({ option1: value }); }}>
              {pickerOptions.map((option) => {
                return <Picker.Item key={option} label={option} value={option} />;
              })}
            </Picker>
            <Picker style={{ flex: 1 }}
              selectedValue={this.state.option2}
              onValueChange={(value) => { this.setState({ option2: value }); }}>
              {pickerOptions.map((option) => {
                return <Picker.Item key={option} label={option} value={option} />;
              })}
            </Picker>
            <Picker style={{ flex: 1 }}
              selectedValue={this.state.option3}
              onValueChange={(value) => { this.setState({ option3: value }); }}>
              {pickerOptions.map((option) => {
                return <Picker.Item key={option} label={option} value={option} />;
              })}
            </Picker>
          </View>
          <TouchableOpacity onPress={this.onSave} style=
            {styles.button}>
            <Text>Save locally</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onLoad} style=
            {styles.button}>
            <Text>Load data</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }, preview: {
    backgroundColor: '#bdc3c7',
    width: 300,
    height: 80,
    padding: 10,
    borderRadius: 5,
    color: '#333',
    marginBottom: 50,
  }, input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    width: 400,
    padding: 5,
  },
  button: {
    backgroundColor: '#f39c12',
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
  },
});