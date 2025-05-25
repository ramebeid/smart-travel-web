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
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [error, setError] = useState("");

  const getPlan = async () => {
    setError("");
    setItinerary([]);
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

      if (data.itinerary) {
        setItinerary(data.itinerary);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Unexpected response from backend.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Network error. Is your backend running?");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Smart Travel Planner</Text>

      <Text style={styles.label}>🌍 Which city are you visiting?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Paris"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>📅 Number of days:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2"
        keyboardType="numeric"
        value={days}
        onChangeText={setDays}
      />

      <Text style={styles.label}>🎯 Interests (comma-separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. food, history"
        value={interests}
        onChangeText={setInterests}
      />

      <View style={styles.switchRow}>
        <Text>🚶 Avoid Crowds?</Text>
        <Switch value={avoidCrowds} onValueChange={setAvoidCrowds} />
      </View>

      <Button title="🧠 Generate Itinerary" onPress={getPlan} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {itinerary.length > 0 &&
        itinerary.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.time}>{item.start_time}</Text>
            <Text style={styles.name}>
              {item.name} ({item.duration_min} mins)
            </Text>
            <Text style={styles.address}>📍 {item.location}</Text>
            {item.cuisine && (
              <Text style={styles.cuisine}>🍽️ {item.cuisine}</Text>
            )}
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  error: { color: "red", marginTop: 10 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  time: { fontSize: 16, fontWeight: "600" },
  name: { fontSize: 16, marginTop: 5 },
  address: { fontSize: 14, color: "#555", marginTop: 3 },
  cuisine: { fontSize: 14, color: "#333", marginTop: 3 },
});
