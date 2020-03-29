import React, { Component, useState,useEffect  } from 'react';
import GlobalStyles from './componente/GlobalStyles';
import { Platform, StyleSheet, Text, View, Button,FlatList,TextInput,ActivityIndicator  } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
//const BACKSERVER = "http://192.168.1.9:3001/api/contacto";
const BACKSERVER = "https://contactoh.herokuapp.com/api/contacto";

function HomeScreen({ scene, previous, navigation,route }) {
  const [load,setLoad] = useState(false);
  const [lista, setLista] = useState([]);

  async function ldata() {
    await fetch(`${BACKSERVER}/lista`).then(res => res.json()).then(data => setLista(data.c));
    setLoad(false);
  }

  if (route.params) {
    if (route.params.up) {
      setLoad(true);      
      ldata();
      route.params.up = false;
    }
  }
  
  useEffect(() => {
    setLoad(true);
    ldata();
  },[]);

  const eliminar = async function (item) {
    setLoad(true);
    var da = await fetch(`${BACKSERVER}/del/${item._id}`,{method:'DELETE'}).then(res => res.json());
    ldata();
  }
  return (
    <SafeAreaView style={styles.seguro}>
      {load ? <ActivityIndicator size="large" color="#ffffff" />:<Text>X</Text>}
      <View style={styles.fondo}>
        <FlatList
            data={lista}
            renderItem={({item}) => 
              <View style={styles.item}>
                <Text>{item.nombre}</Text>
                <Text>{item.telefono}</Text>
                <View style={styles.botons}>
                  <Button title="Edit" onPress={() => navigation.navigate('Details',{data:item})} />
                  <Button title="Delete" onPress={eliminar.bind(this,item)} />
                </View>
              </View>
            }
          />
        <Button title="Add" onPress={() => navigation.navigate('Details',{data:{nombre:'',telefono:'',_id:0}})} />
      </View>
    </SafeAreaView>
  );
}

function DetalleScren({ scene, previous, navigation,route }) {

  const [nombre, setNombre] = useState(route.params.data.nombre);
  const [telefono, setTelfono] = useState(route.params.data.telefono);
  const [_id, set_id] = useState(route.params.data._id);
  const [load,setLoad] = useState(false);

  const aceptar = async function () {
    if (nombre === '' || telefono === '') {
      alert("Lo campos son Obligatorios");
      return false;
    }
    setLoad(true);
    if(_id !== 0){
      var da = await fetch(`${BACKSERVER}/up/${_id}`,{method:'PUT',
        body:JSON.stringify({
          nombre:nombre,
          telefono:telefono
        }),
        headers:{'Accept':'application/json','Content-Type':'application/json'}
      }).then(res => res.json());
      //alert(da.msg);
      navigation.navigate('Home',{up:true});
    }else{
      await fetch(`${BACKSERVER}/save`,{method:'POST',
        body:JSON.stringify({nombre:nombre,telefono:telefono}),
        headers:{'Accept':'application/json','Content-Type':'application/json'}
      });
      navigation.navigate('Home',{up:true});
    }
  }

  return (
      <SafeAreaView style={styles.seguro}>
        {load ? <ActivityIndicator size="large" color="#ffffff" />:<Text></Text>}
        <View style={styles.fondo}>
          <Text>Nombre</Text>
          <TextInput placeholder="nombre de contacto" style={styles.item} value={nombre} onChangeText={(text)=>setNombre(text)} />
          <Text>Telefono</Text>
          <TextInput placeholder="telefono de contacto" style={styles.item} value={telefono} onChangeText={(text)=>setTelfono(text)} />
          <Button style={styles.item} title="Aceptar" onPress={aceptar.bind()} />
          <Text></Text>
          <View style={styles.button}>          
            <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
            <Button title="Go back" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </SafeAreaView>
    );
}

export default class App extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetalleScren} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  button:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  item: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop: 15,
    marginBottom: 15,
    borderBottomColor: 'gray',
    borderBottomWidth: 2
  },
  fondo:{ 
    backgroundColor: '#ffffff',
    padding: 20,
  },
  botons:{
    flexDirection:'row'
  },
});

/*
class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      scene: this.props.scene,
      previous: this.props.previous,
      navigation: this.props.navigation,
      load: false,
      lista: []
    }
  }
  componentWillMount(){
    this.listar();
  }
  
  async listar(){
    this.setState({load:true});
    await fetch(`${BACKSERVER}/lista`).then(res => res.json()).then(data => this.setState({lista:data.c,load:false}));
  }
  async eliminar(item) {
    this.setState({load:true});
    await fetch(`${BACKSERVER}/del/${item._id}`,{method:'DELETE'});
    this.listar();
  }
  render () {
    return (
      <SafeAreaView style={styles.seguro}>
        {this.state.load ? <ActivityIndicator size="large" color="#ffffff" />:<Text>X</Text>}
        <View style={styles.fondo}>
          <FlatList
              data={this.state.lista}
              renderItem={({item}) => 
                <View style={styles.item}>
                  <Text>{item.nombre}</Text>
                  <Text>{item.telefono}</Text>
                  <View style={styles.botons}>
                    <Button title="Edit" onPress={() => this.state.navigation.navigate('Details',{data:item})} />
                    <Button title="Delete" onPress={this.eliminar.bind(this,item)} />
                  </View>
                </View>
              }
            />
          <Button title="Add" onPress={() => this.state.navigation.navigate('Details',{data:{nombre:'',telefono:'',_id:0}})} />
        </View>
      </SafeAreaView>
    );
  }
}
*/