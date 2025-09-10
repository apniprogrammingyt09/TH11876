import { useUser } from "@clerk/clerk-expo";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "https://krish09bha-dhruvai.hf.space";

export default function MyReportTab() {
  const { user } = useUser();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [retryCount, setRetryCount] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // For pulsing loading text ✨
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Fetch user reports
  const fetchUserReports = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      const url = `${API_URL}/get_records_by_user/${user.id}`;
      console.log("Fetching:", url);

      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      setRecords(data.records || []);

      // derive stats if backend didn’t provide
      if (data.stats) {
        setStats(data.stats);
      } else {
        const lostCount = data.records.filter((r) => r.source === "lost_people").length;
        const matchCount = data.records.filter((r) => r.source === "match_records").length;
        setStats({ lost: lostCount, matches: matchCount });
      }

      setRetryCount(0);
    } catch (err) {
      console.error("Fetch error:", err.message);
      if (err.message.includes("502") && retryCount < 3) {
        setTimeout(() => setRetryCount((prev) => prev + 1), 5000);
      } else setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserReports();
  }, [user, retryCount]);

  // ---------------- Loading UI ----------------
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require("../../../assets/LoadingFiles.json")}
          autoPlay
          loop
          style={styles.loader}
        />
        <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
          Loading your reports…
        </Animated.Text>
        <Text style={styles.subText}>Fetching safely • Please hold tight 🕵️‍♂️</Text>
      </View>
    );
  }

  // ---------------- Error State ----------------
  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          Failed to load reports 🚧
        </Text>
        <Text style={{ marginTop: 8, color: "#777", textAlign: "center" }}>
          {errorMsg.includes("502")
            ? "Our server might be waking up… please wait a moment."
            : errorMsg}
        </Text>
      </View>
    );
  }

  // ---------------- Empty State ----------------
  if (!records.length) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#555" }}>
          No reports found 👀
        </Text>
        <Text style={{ marginTop: 4, color: "#777" }}>
          Try uploading a lost report first.
        </Text>
      </View>
    );
  }

  // ---------------- Compact Record Card ----------------
  const renderRecord = ({ item }) => {
    const person = item.data;

    if (item.source === "match_records") {
      return (
        <TouchableOpacity
          style={[styles.cardCompact, { borderLeftColor: "#28a745" }]}
          onPress={() => setSelectedRecord(item)}
        >
          <Text style={styles.matchTitle}>🎉 Match Found!</Text>
          <Text style={styles.cardSub}>
            Lost: {person.lost_person?.name} ({person.lost_person?.age} yrs)
          </Text>
          <Text style={styles.cardSub}>
            Found: {person.found_person?.name} ({person.found_person?.age} yrs)
          </Text>
        </TouchableOpacity>
      );
    }

    const isLost = item.source === "lost_people";
    const borderColor = isLost ? "#4facfe" : "#5d5fef";
    const thumbnail = person?.face_blob
      ? { uri: `data:image/jpeg;base64,${person.face_blob}` }
      : null;

    return (
      <TouchableOpacity
        style={[styles.cardCompact, { borderLeftColor: borderColor }]}
        onPress={() => setSelectedRecord(item)}
      >
        {thumbnail ? (
          <Image source={thumbnail} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.noImage]}>
            <Text style={{ color: "#999", fontSize: 12 }}>No Photo</Text>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.cardName}>{person?.name || "Unknown"}</Text>
          <Text style={styles.cardSub}>
            {person?.age} yrs • {person?.gender}
          </Text>
          <View style={styles.statusPill}>
            <Text style={{ color: isLost ? "#4facfe" : "#5d5fef", fontWeight: "600" }}>
              {person?.status || "pending"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ---------------- Main UI ----------------
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Stats Section */}
      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.lost}</Text>
            <Text style={styles.statLabel}>My Lost Reports</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.matches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>
      )}

      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item, idx) =>
          item.data?.face_id || item.data?.match_id || idx.toString()
        }
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }} // ✅ added paddingBottom for tab bar
      />

      {/* Modal Detail */}
      <Modal
        visible={!!selectedRecord}
        animationType="slide"
        onRequestClose={() => setSelectedRecord(null)}
      >
        {selectedRecord && (
          <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Hero Image */}
            <Image
              source={
                selectedRecord.data?.face_blob
                  ? { uri: `data:image/jpeg;base64,${selectedRecord.data.face_blob}` }
                  : null
              }
              style={styles.heroImage}
            />
            <View style={styles.detailsPanel}>
              <Text style={styles.modalName}>
                {selectedRecord.data?.name || "Unknown"}
              </Text>
              <View style={[styles.statusPill, { marginVertical: 8 }]}>
                <Text style={{ color: "#4facfe", fontWeight: "600" }}>
                  {selectedRecord.data?.status || "pending"}
                </Text>
              </View>

              <Text style={styles.modalInfo}>Age: {selectedRecord.data?.age}</Text>
              <Text style={styles.modalInfo}>Gender: {selectedRecord.data?.gender}</Text>
              <Text style={styles.modalInfo}>
                Location:{" "}
                {selectedRecord.source === "lost_people"
                  ? selectedRecord.data?.where_lost
                  : selectedRecord.data?.location_found}
              </Text>
              <Text style={styles.modalInfo}>
                Reporter: {selectedRecord.data?.reporter_name || "Unknown"}
              </Text>
              <Text style={styles.modalInfo}>
                Contact: {selectedRecord.data?.contact_details?.mobile_no || "N/A"}
              </Text>
              <Text style={styles.modalInfo}>
                Date: {new Date(selectedRecord.data?.upload_time).toLocaleDateString()}
              </Text>
              {selectedRecord.data?.status_updated_time && (
                <Text style={styles.modalInfo}>
                  Status Updated:{" "}
                  {new Date(selectedRecord.data?.status_updated_time).toLocaleDateString()}
                </Text>
              )}

              <Pressable style={styles.closeBtn} onPress={() => setSelectedRecord(null)}>
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Close</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Loading Screen
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loader: {
    width: 320,
    height: 320,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    opacity: 0.8,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },

  statsRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  statCard: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#4facfe" },
  statLabel: { fontSize: 13, color: "#666", marginTop: 4 },

  // Compact Card
  cardCompact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderLeftWidth: 5,
  },
  thumbnail: { width: 65, height: 65, borderRadius: 8, backgroundColor: "#eee" },
  noImage: { justifyContent: "center", alignItems: "center" },
  cardName: { fontWeight: "bold", fontSize: 16, color: "#222" },
  cardSub: { fontSize: 13, color: "#555", marginTop: 2 },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    backgroundColor: "#4facfe22",
  },

  // Modal
  heroImage: {
    width: "100%",
    height: 320,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#eee",
  },
  detailsPanel: { padding: 16, backgroundColor: "#fff" },
  modalName: { fontSize: 24, fontWeight: "bold", color: "#111" },
  modalInfo: { fontSize: 16, color: "#444", marginTop: 6 },
  closeBtn: {
    backgroundColor: "#4facfe",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  matchTitle: { fontSize: 16, fontWeight: "bold", color: "#28a745", marginBottom: 6 },
}); 