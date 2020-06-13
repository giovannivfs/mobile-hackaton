import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'
import api from '../../services/api'
import * as  MailComposer from 'expo-mail-composer'

interface Params {
  point_id: number;
}

interface Detail {
  point: {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  },
  items: {
    title: string;
  }[];
}

function Detail() {
  const [detail, setDetail] = useState<Detail>({} as Detail)

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=+5544998335215&text=Tenho interesse no seu ponto`)
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse no ponto',
      recipients: [detail.point.email],
    })
  }

  useEffect(() => {
    handleGetDetail();
  }, [])

  async function handleGetDetail() {
    try {
      const response = await api.get(`points/${routeParams.point_id}`)
      setDetail(response.data)
    } catch (err) {
      //
    }
  }

  if (!detail.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{ uri: detail.point.image }}
        />
        <Text style={styles.pointName}> {detail.point.name} </Text>
        <Text style={styles.pointItems}> {detail.items.map(item => item.title).join(', ')} </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}> {detail.point.city} </Text>
          <Text style={styles.addressContent}> {detail.point.uf} </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 40
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;