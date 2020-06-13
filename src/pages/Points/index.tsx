import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'
import { RectButton } from 'react-native-gesture-handler'
import api from '../../services/api'

interface Item {
  id: number;
  value: number;
}
interface Point {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}


const types = [
  {
    id: 1,
    name: "Descanso",
    image: "descanso.png"
  },
  {
    id: 2,
    name: "Banho",
    image: "banho.png"
  },
]

function Points() {
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<number[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
  const [offset] = useState(new Animated.ValueXY({ x: 0, y: 90 }));
  const [opacity] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    if (!optionsVisible) {
      Animated.parallel([
        Animated.spring(offset.y, {
          toValue: 0,
          speed: 5,
          bounciness: 10,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(offset.y, {
          toValue: -100,
          speed: 3,
          bounciness: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
        }),
      ]).start();
    }
  }, [optionsVisible]);


  useEffect(() => {
    handleLoadPosition();
  }, [])


  const handleShowOptions = () => setOptionsVisible(!optionsVisible)

  function handleSelectType(id: number) {
    const alreadySelected = selectedTypes.findIndex(type => type === id)

    if (alreadySelected >= 0) {
      const filteredTypes = selectedTypes.filter(item => item !== id);
      setSelectedTypes(filteredTypes)
    } else {
      setSelectedTypes([...selectedTypes, id])
    }
  }


  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }


  function handleNavigateToProfile() {
    navigation.navigate('Profile');
  }

  async function handleLoadPosition() {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ooops..', 'Precisamos de sua permissão para obter sua localização')
      return;
    }

    const location = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = location.coords;

    setInitialPosition([
      latitude,
      longitude
    ])
  }


  function handleNavigateBack() {
    navigation.goBack();
  }


  return (

    <>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (<MapView
            style={styles.map}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            <Marker
              onPress={() => { }}
              coordinate={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
              }}
            >
              <Image
                source={require("../../assets/marker.png")}
              />
            </Marker>
          </MapView>)}
        </View>
      </View>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleNavigateToProfile} style={styles.headerIcon}>
          <Image source={require("../../assets/user.png")} width={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.itemsContainer}>
        <Text style={styles.titleItems}>Pesquisar por:</Text>
        <View style={styles.itemsSubContainer}>
          <TouchableOpacity
            style={[
              styles.itemG,
              selectedTypes.includes(1) ? styles.selectedItem : {}
            ]}
            activeOpacity={0.6}
            onPress={() => handleSelectType(1)}
          >
            <View style={styles.itemContent}>
              <Image source={require("../../assets/descanso.png")} width={50} height={46} />
              <Text style={styles.itemSubtitle}>Descanso</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.itemG,
              selectedTypes.includes(2) ? styles.selectedItem : {}
            ]}
            onPress={() => handleSelectType(2)}
            activeOpacity={0.6}
          >
            <View style={styles.itemContent}>
              <Image source={require("../../assets/banho.png")} width={50} height={46} />
              <Text style={styles.itemSubtitle}>Banho</Text>
            </View>
          </TouchableOpacity>
        </View>





        <View style={styles.itemsSubContainer}>
          <TouchableOpacity
            style={[
              styles.item,
              selectedItems.includes(20) ? styles.selectedItem : {}
            ]}
            onPress={() => handleSelectItem(20)}
            activeOpacity={0.6}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>20</Text>
              <Text style={styles.itemSubtitle}>km</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.item,
              selectedItems.includes(50) ? styles.selectedItem : {}
            ]}
            onPress={() => handleSelectItem(50)}
            activeOpacity={0.6}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>50</Text>
              <Text style={styles.itemSubtitle}>km</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.item,
              selectedItems.includes(100) ? styles.selectedItem : {}
            ]}
            onPress={() => handleSelectItem(100)}
            activeOpacity={0.6}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>100</Text>
              <Text style={styles.itemSubtitle}>km</Text>
            </View>
          </TouchableOpacity>
        </View>


        {optionsVisible ? (
          <>
            <View style={styles.itemsSubContainer}>
              <TouchableOpacity
                style={[
                  styles.item,
                  selectedItems.includes(200) ? styles.selectedItem : {}
                ]}
                onPress={() => handleSelectItem(200)}
                activeOpacity={0.6}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>200</Text>
                  <Text style={styles.itemSubtitle}>km</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.item,
                  selectedItems.includes(250) ? styles.selectedItem : {}
                ]}
                onPress={() => handleSelectItem(250)}
                activeOpacity={0.6}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>250</Text>
                  <Text style={styles.itemSubtitle}>km</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.item,
                  selectedItems.includes(500) ? styles.selectedItem : {}
                ]}
                onPress={() => handleSelectItem(500)}
                activeOpacity={0.6}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>500</Text>
                  <Text style={styles.itemSubtitle}>km</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.titleItems}>Pesquisar no trajeto:</Text>
            <View style={styles.trajetoContent}>
              <View style={styles.trajetoItem}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFB92D' }} />
                <View style={{ marginLeft: 20 }}>
                  <Text style={styles.trajetoTxt}>Saindo</Text>
                  <Text style={styles.city}>Rio de Janeiro</Text>
                </View>
              </View>
              <View style={styles.trajetoItem}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2D2ABF' }} />
                <View style={{ marginLeft: 20 }}>
                  <Text style={styles.trajetoTxt}>Destino</Text>
                  <Text style={styles.city}>Digite aqui</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}
        <TouchableOpacity onPress={handleShowOptions}>
          <Text style={styles.showOptionsText}>
            {optionsVisible ? "Ocultar opções" : "Ver mais opções"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  containerTrajeto: {
    flex: 1,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  trajetoContent: {
    padding: 5,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 120,
  },
  trajetoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  trajetoTxt: {
    fontSize: 14,
    color: "#959DAD",
  },
  city: {
    fontSize: 19,
    color: "#454F63",
    fontFamily: "Ubuntu_700Bold",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: 70,
    height: 70,
    top: 20 + Constants.statusBarHeight,
    position: "absolute",
    right: 20,
    borderRadius: 35,
    backgroundColor: "#fff",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 20
  },
  headerIcon: {
    flexDirection: "column-reverse",
    backgroundColor: "#ffb92d",
    borderRadius: 50,
    padding: 8,
  },
  headerText: {
    alignContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: 'Ubuntu_700Bold',
  },

  description: {
    color: '#3331DD',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  itemsSubContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },

  itemsContainer: {
    marginBottom: 0,
    backgroundColor: "#3331DD",
    padding: 18,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
  },

  item: {
    backgroundColor: '#2D2ABF',
    height: 80,
    width: 100,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },
  itemG: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: '#2D2ABF',
    height: 100,
    width: 159,
    borderRadius: 8,
  },

  selectedItem: {
    backgroundColor: '#dd6163',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontFamily: 'Ubuntu_700Bold',
    textAlign: 'center',
    fontSize: 28,
    color: "#fff",
  },
  titleItems: {
    fontFamily: 'Ubuntu_300Light',
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
    color: "#fff",
  },
  itemSubtitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 15,
    color: "#fff",
    marginTop: 5,
  },
  showOptionsText: {
    paddingTop: 20,
    textAlign: 'center',
    color: '#55ADFA',
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 22,
  }
});

export default Points;