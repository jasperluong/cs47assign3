import { useEffect } from "react";
import WebView from "react-native-webview";
import {Text} from 'react-native';

const LinkWebView = ({route, navigation}) => {
  const { url } = route.params;

  useEffect(() => {
    console.log('here');
    console.log(url);
  });
  

  return (
    <WebView
      source={{
        uri: url,
      }}
    />
  );
};

export default LinkWebView;