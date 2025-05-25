import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Switch,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function TabOneScreen() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState("2");
  const [interests, setInterests] = useState("");
  const [avoidCrowds, setAvoidCrowds] = useState(false);
  const [itinerary, setItinerary] = useState([]);

  const getPlan = async () => {
    try {
      const response = await fetch(
        "https://smart-travel-backend.onrender.com/plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city,
            days: parseInt(days),
            interests: interests.split(",").map((i) => i.trim()),
            avoid_crowds: avoidCrowds,
          }),
        },
      );

      const data = await response.json();
      setItinerary(data.itinerary || []);
    } catch (error) {
      console.error(error);
      setItinerary([{ name: "⚠️ Network error. Is your backend running?" }]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Smart Travel Planner</Text>

      <Text style={styles.label}>🌍 Which city are you visiting?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Cairo"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>📅 How many days is your trip?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2"
        keyboardType="numeric"
        value={days}
        onChangeText={setDays}
      />

      <Text style={styles.label}>🎯 What are your interests?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. history, food, culture"
        value={interests}
        onChangeText={setInterests}
      />

      <View style={styles.switchRow}>
        <Text>🚶‍♂️ Avoid Crowds?</Text>
        <Switch value={avoidCrowds} onValueChange={setAvoidCrowds} />
      </View>

      <Button title="🧠 Generate Itinerary" onPress={getPlan} />

      <View style={styles.result}>
        {Array.isArray(itinerary) ? (
          itinerary.map((item, idx) => (
            <View key={idx} style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                ⏰ {item.start_time || "???"} – {item.name || "Unnamed place"}
              </Text>
              {item.location && <Text>📍 {item.location}</Text>}
              {item.duration_min && <Text>🕐 {item.duration_min} minutes</Text>}
              {item.cuisine && <Text>🍽 {item.cuisine}</Text>}
              <Text>—</Text>
            </View>
          ))
        ) : (
          <Text>{itinerary}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 50, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 5, marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  result: {
    marginTop: 30,
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
});
