import { StyleSheet, Text, SafeAreaView, Image, Dimensions, View, Pressable, FlatList} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors";
import images from "./Themes/images";
import React, { Component } from 'react';
import millisToMinSec from "./utils/millisToMinuteSeconds.js"
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds.js";

const deviceWidth = Dimensions.get('window').width;
// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

export default function App() {
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

const Song = ({ trackNumber, imageFile, title, artist, album, duration }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{trackNumber}</Text>
    <Image
    style={{width:65, height:65, flex:1}}
    source={{uri:imageFile}}
    resizeMode='contain'
    />
    <View style={styles.artist}>
      <Text style={styles.artistText} numberOfLines={1}>{artist}</Text>
      <Text style={styles.artistText} numberOfLines={1}>{title}</Text>
    </View>
    <Text style={styles.title} numberOfLines={1}>{album} </Text>
    <Text style={styles.title}>{duration}</Text>
    
  </View>
  
);

const renderItem = ({ item, index }) => (
  <>
  <Song trackNumber={index+1}/>
  <Song imageFile={item.album.images[0].url}/>
  <Song title={item.name} />
  <Song artist={item.artists[0].name} />
  <Song album={item.album.name}/>
  <Song duration={millisToMinutesAndSeconds(item.duration_ms)}/>
  </>
);
 
const SongList = () => {
{
    return (  
      <>
      <View style={styles.TopContainer}>
        <View style={styles.TracksContainer}>
          <Image
            style={{ width: 30, height: 30 }}
            source={require("./assets/spotify-logo.png")}
          ></Image>
          <Text style={styles.headerText}> My Spotify Tracks</Text>
        </View>
        </View>
      <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item, index) => item['id']} />
      </>
    )
  };
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
  
  if (token) {
    contentDisplayed = <SongList/>
    
  }
  else {
    contentDisplayed = <SpotifyAuthButton/>
  }

  return (
    
    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
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
    height: '6%'
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 12,    
  },
 
  item: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    justifyContent: "space-around",
    alignItems: "flex-start",
    height: 40,
    width: "100%",

  },
  title: {
    fontSize: 10,
    color: 'white',
    flex: 1,
    padding:10
  },
  artist: {
    color: Colors.gray,
    flexDirection: "column",
    flex:1
  },
  artistText: {
    fontSize: 10,
    color: Colors.gray,
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
  },
});
