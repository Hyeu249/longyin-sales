import React from "react";
import { StatusBar } from "expo-status-bar";
import { LanguageProvider } from "./LanguageContext";
import { FrappeProvider } from "./FrappeContext";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";
import Navigation from "./navigation";

export default function App() {
  console.log("App started with theme:", MD3DarkTheme);
  return (
    <FrappeProvider>
      <LanguageProvider>
        <PaperProvider theme={MD3LightTheme}>
          <Navigation />
        </PaperProvider>
        <StatusBar style="auto" />
      </LanguageProvider>
    </FrappeProvider>
  );
}
