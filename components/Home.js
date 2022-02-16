import { StyleSheet, Text, SafeAreaView, Image, Dimensions, View, Pressable, FlatList} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "../utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "../utils/constants";
import Colors from "../Themes/colors";
import images from "../Themes/images";
import React, { Component } from 'react';
import { useNavigation } from "@react-navigation/native";
import millisToMinutesAndSeconds from "../utils/millisToMinuteSeconds.js";
import { Ionicons } from '@expo/vector-icons';
import { WebView } from "react-native-webview";


const deviceWidth = Dimensions.get('window').width;
// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

export default function Home( {item, navigation} ) {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  const SpotifyAuthButton = () => {
    return (
        <View style={styles.spotifyContainer}>
        <Pressable onPress={promptAsync}>
        <Text style={styles.buttonTextStyle}>CONNECT WITH SPOTIFY</Text>
        </Pressable>
        <Image
              style={{width:30, height:30}}
              source={images.spotify}
              resizeMode='contain'
              />
        </View>
    );
};
 

const SongList = () => {

    const navigation = useNavigation();

    return (  
      <>
      <View style={styles.TopContainer}>
        <View style={styles.TracksContainer}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require("../assets/spotify-logo.png")}
          ></Image>
          <Text style={styles.headerText}> My Spotify Tracks</Text>
        </View>
        </View>

        <View style={styles.bigView}>

      <FlatList
        data={tracks}
        renderItem={({item}) => (
            <Pressable onPress={
                () => {
                    navigation.navigate('Detailed', {url:item.external_urls.spotify});
                }
            }>
            <View style={styles.item}>
              <Pressable onPress={
                  () => {
                      navigation.navigate('Preview', {url:item.preview_url});
                  }
              }>
              <Ionicons name="caret-forward-circle" size={20} color= "#1DB954" style={{paddingTop:25, paddingLeft:15}}></Ionicons>
              </Pressable>
            <Image
            style={{width:65, height:55, margin: 12}}
            source={{uri:item.album.images[0].url}}
            resizeMode='contain'
            />
            <View style={styles.artist}>
              <Text style={styles.artistText} numberOfLines={1}>{item.artists[0].name}</Text>
              <Text style={styles.artistText2} numberOfLines={1}>{item.name}</Text>
            </View>
            <Text style={styles.title2} numberOfLines={1}>{item.album.name} </Text>
            <Text style={styles.title3}>{millisToMinutesAndSeconds(item.duration_ms)}</Text>
          </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id} />
        </View>

      </>
    )
};

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      // TODO: Select which option you want: Top Tracks or Album Tracks

      // Comment out the one you are not using
      myTopTracks(setTracks, token);
      //albumTracks(ALBUM_ID, setTracks, token);
    }
  }, [token]);

  let contentDisplayed = null;
  
  return (

    <SafeAreaView style={styles.container}>
      {token ? <SongList/> : <SpotifyAuthButton/>}
    </SafeAreaView>
    
  );

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 1,
  },
  spotifyContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: 'row-reverse',
    width: deviceWidth * 0.6,
    backgroundColor: Colors.spotify,
    borderRadius: 99999,
    height: '6%',
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 12,    
  },
 
  bigView: {
    flex:1,
    flexDirection: 'column',
    color: 'green',
    justifyContent: "space-around",
    alignContent: "space-between"
  },
  item: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    height: 65,
    width: "100%",
    flex:1,
  },
  title: {
    fontSize: 10,
    color: Colors.gray,
    paddingLeft: 16,
    marginTop: 34
  
  },
  title2: {
    fontSize: 9,
    color: 'white', 
    flexBasis: 100,
    paddingTop: 31
  },
  title3: {
    fontSize: 11,
    color: Colors.gray, 
    flexBasis: 115,
    paddingTop: 31
  },
  artist: {
    color: Colors.gray,
    flexDirection: "column-reverse",
    flexGrow: 1,
    paddingBottom: 10,
    flexBasis:115
  },
  artistText: {
    fontSize: 10,
    color: Colors.gray,
  },
  artistText2: {
    fontSize: 12,
    color: 'white',
  },
  headerText: {
    color: "white",
    fontSize: 20,
  },
  TopContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  TracksContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 15
  },
});
