import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { LanguageProvider } from "./LanguageContext";
import { FrappeProvider } from "./FrappeContext";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";
import Navigation from "./navigation";
import Toast from "react-native-toast-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import RFIDWithUHFA8 from "./mockup";

export default function App() {
  useEffect(() => {
    const init = async () => {
      try {
        const success = await RFIDWithUHFA8.initRFID();
        if (success) {
          await RFIDWithUHFA8.setInventoryCallback();
        }
      } catch (error) {
        console.error("Init error", error);
      }
      console.log("start app!!!");
    };

    init();

    return () => {
      console.log("remove app!!!");
      RFIDWithUHFA8.freeRFID();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <FrappeProvider>
        <LanguageProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <PaperProvider theme={MD3LightTheme}>
              <Navigation />
              <Toast />
              <StatusBar style="auto" />
            </PaperProvider>
          </SafeAreaView>
        </LanguageProvider>
      </FrappeProvider>
    </SafeAreaProvider>
  );
}
