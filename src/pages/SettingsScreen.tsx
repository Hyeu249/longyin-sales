import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import {
  successNotification,
  errorNotification,
} from "../utilities/notification";
import RFIDWithUHFA8, {
  RFIDTagPayload,
  EVENT_RFID_READ,
  powerPayload,
  EventSubscription,
} from "../../mockup";

export default function App() {
  const [rfidData, setRfidData] = useState<RFIDTagPayload | null>(null);
  const [rfidVersion, setRfidVersion] = useState<string>("");
  const [workingMode, setWorkingMode] = useState<string>("");
  const [rfidDatas, setRfidDatas] = useState<RFIDTagPayload[]>([]); // đổi từ number -> array
  const [antennaPowers, setAntennaPowers] = useState<powerPayload[]>([]); // đổi từ number -> array
  const [inputPower, setInputPower] = useState<string>(""); // mặc định là '26'

  let subscription: EventSubscription;

  const handleReadSingleTag = async () => {
    try {
      const tag = await RFIDWithUHFA8.readSingleTag();
      setRfidData(tag);
    } catch (err: any) {
      errorNotification(`Lỗi khi đọc thẻ", ${err.message}`);
    }
  };

  const handleStartReading = async () => {
    try {
      subscription = RFIDWithUHFA8.addListener(
        EVENT_RFID_READ,
        (payload: RFIDTagPayload) => {
          setRfidDatas((prev) => {
            if (prev.some((item) => item.tid === payload.tid)) return prev;
            return [...prev, payload];
          });
        }
      );
      const started = await RFIDWithUHFA8.startReadingRFID();
      Alert.alert(started ? "Đang đọc liên tục..." : "Không thể bắt đầu");
    } catch (err: any) {
      Alert.alert("Lỗi khi start", err.message || "Không rõ lỗi");
    }
  };

  const handleStopReading = () => {
    try {
      const stopped = RFIDWithUHFA8.stopReadingRFID();
      subscription?.remove();

      Alert.alert(stopped ? "Đã dừng đọc" : "Không thể dừng");
    } catch (err: any) {
      Alert.alert("Lỗi khi stop", err.message || "Không rõ lỗi");
    }
  };

  const handleStart = async () => {
    const success = await RFIDWithUHFA8.initRFID();
    if (success) {
      await RFIDWithUHFA8.setInventoryCallback();
      const version = await RFIDWithUHFA8.getRFIDVersion();
      const mode = await RFIDWithUHFA8.getWorkingMode();
      handleGetPower();
      setRfidVersion(version);
      setWorkingMode(mode);
    }
    Alert.alert(success ? "Đã khởi động máy" : "Lỗi khi khởi động");
  };

  const handleFree = () => {
    const result = RFIDWithUHFA8.freeRFID();
    Alert.alert(result ? "Đã giải phóng RFID" : "Lỗi khi giải phóng");
  };

  const handleGetPower = async () => {
    try {
      const result: powerPayload[] = await RFIDWithUHFA8.getPower();
      setAntennaPowers(result); // lưu cả mảng
    } catch (err: any) {
      Alert.alert("Lỗi khi lấy công suất", err.message || "Không rõ lỗi");
    }
  };

  const handleSetPower = () => {
    try {
      const success = RFIDWithUHFA8.setAntenna1Power(parseInt(inputPower, 10));
      Alert.alert(
        success
          ? `Đã đặt công suất ANT1 về ${inputPower}`
          : "Không thể đặt công suất"
      );
      setInputPower(inputPower);
    } catch (err: any) {
      Alert.alert("Lỗi khi đặt công suất", err.message || "Không rõ lỗi");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RFID Demo App</Text>
      <Text style={styles.version}>
        RFID Version: {rfidVersion || "Đang tải..."}
      </Text>
      <Text style={styles.version}>
        Working Mode: {workingMode || "Đang tải..."}
      </Text>

      <View style={{ marginVertical: 8 }}>
        <Text>Nhập công suất ANT1 (5 - 30):</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            marginTop: 5,
            backgroundColor: "#fff",
          }}
          value={inputPower}
          onChangeText={setInputPower}
          keyboardType="numeric"
          placeholder="Ví dụ: 26"
        />
      </View>

      {/* Danh sách công suất các ANT */}
      {antennaPowers.length > 0 && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Danh sách công suất antenna:</Text>
          {antennaPowers.map((item, index) => (
            <Text key={index}>
              {item.antenna}: {item.power}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.button}>
        <Button title="Read Single Tag" onPress={handleReadSingleTag} />
      </View>
      <View style={styles.button}>
        <Button title="Start Reading" onPress={handleStartReading} />
      </View>
      <View style={styles.button}>
        <Button title="Stop Reading" onPress={handleStopReading} />
      </View>
      <View style={styles.button}>
        <Button title="Start RFID" onPress={handleStart} color="#4f9bd9ff" />
      </View>
      <View style={styles.button}>
        <Button title="Free RFID" onPress={handleFree} color="#d9534f" />
      </View>

      <View style={styles.button}>
        <Button title=" Lấy công suất antenna" onPress={handleGetPower} />
      </View>
      <View style={styles.button}>
        <Button title="⚙️ Đặt công suất ANT1" onPress={handleSetPower} />
      </View>

      {rfidData && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Tag Info:</Text>
          <Text>EPC: {rfidData.epc}</Text>
          <Text>TID: {rfidData.tid}</Text>
          <Text>User: {rfidData.user}</Text>
          <Text>RSSI: {rfidData.rssi}</Text>
          <Text>ANT: {rfidData.ant}</Text>
          <Text>Message: {rfidData.message}</Text>
        </View>
      )}

      {rfidDatas.length > 0 && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Danh sách RFIDs TID:</Text>
          {rfidDatas.map((item, index) => (
            <Text key={index}>
              <Text key={index}>
                TID: {item.tid} | RSSI: {item.rssi}
              </Text>
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  version: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    marginVertical: 8,
  },
  result: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 16,
  },
});
