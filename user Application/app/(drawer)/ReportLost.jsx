// import { useUser } from "@clerk/clerk-expo";
// import { BlurView } from "expo-blur";
// import * as ImagePicker from "expo-image-picker";
// import LottieView from "lottie-react-native";
// import { useState } from "react";
// import {
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// const API_URL = "https://krish09bha-dhruvai.hf.space";

// const InputField = ({ placeholder, value, onChangeText, ...props }) => (
//   <TextInput
//     style={styles.input}
//     placeholder={placeholder}
//     value={value}
//     onChangeText={onChangeText}
//     {...props}
//   />
// );

// export default function ReportLost() {
//   const { user } = useUser();

//   const [form, setForm] = useState({
//     name: "",
//     gender: "",
//     age: "",
//     whereLost: "",
//     relation: "",
//     mobile: "",
//   });

//   const [step, setStep] = useState(0);
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [showCheck, setShowCheck] = useState(false);

//   const userId = user?.id;

//   const handleInput = (field, value) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [3, 4],
//       quality: 0.8,
//     });
//     if (!result.canceled) setImage(result.assets[0].uri);
//   };

//   const validateStep = () => {
//     if (step === 0 && (!form.name || !form.age || !form.gender)) {
//       Alert.alert("⚠️ Missing Info", "Please fill name, age and select gender.");
//       return false;
//     }
//     if (step === 1 && (!form.whereLost || !form.relation)) {
//       Alert.alert("⚠️ Missing Info", "Please enter where lost and relation.");
//       return false;
//     }
//     if (step === 2 && (!form.mobile || !image)) {
//       Alert.alert("⚠️ Missing Info", "Please enter mobile and upload photo.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     const { name, gender, age, whereLost, relation, mobile } = form;

//     if (!name || !gender || !age || !whereLost || !relation || !mobile || !image) {
//       Alert.alert("⚠️ Missing Info", "Please fill all fields and upload a photo.");
//       return;
//     }

//     setUploading(true);
//     setShowCheck(false);

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("gender", gender);
//       formData.append("age", parseInt(age));
//       formData.append("where_lost", whereLost);
//       formData.append("relation_with_lost", relation);
//       formData.append("mobile_no", mobile);

//       formData.append("your_name", user?.fullName || "");
//       formData.append("email_id", user?.primaryEmailAddress?.emailAddress || "");
//       formData.append("user_id", userId);

//       formData.append("file", {
//         uri: image,
//         name: "lost_person.jpg",
//         type: "image/jpeg",
//       });

//       const resp = await fetch(`${API_URL}/upload_lost`, {
//         method: "POST",
//         body: formData,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (resp.ok) {
//         setShowCheck(true);
//         setTimeout(() => {
//           Alert.alert("✅ Success", "Report Registered Successfully");
//           setForm({
//             name: "",
//             gender: "",
//             age: "",
//             whereLost: "",
//             relation: "",
//             mobile: "",
//           });
//           setImage(null);
//           setShowCheck(false);
//           setStep(0);
//         }, 2500);
//       } else {
//         const data = await resp.json();
//         Alert.alert("❌ Error", data.detail || "Something went wrong.");
//       }
//     } catch (err) {
//       console.error("Upload error", err);
//       Alert.alert("❌ Error", "Network/server issue while reporting.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const steps = ["Lost Info", "Details", "Contact & Photo", "Submit"];

//   const StepIndicator = () => (
//     <View style={{ marginVertical: 12, marginLeft: 10 }}>
//       {steps.map((lbl, idx) => {
//         const isActive = idx === step;
//         const isCompleted = idx < step;
//         return (
//           <View key={lbl} style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
//             <View
//               style={{
//                 width: 26,
//                 height: 26,
//                 borderRadius: 13,
//                 backgroundColor: isCompleted || isActive ? "#5D5FEF" : "#e5e7eb",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
//                 {isCompleted ? "✓" : idx + 1}
//               </Text>
//             </View>
//             <Text
//               style={{
//                 marginLeft: 10,
//                 fontSize: 15,
//                 fontWeight: "600",
//                 color: isActive || isCompleted ? "#111" : "#aaa",
//               }}
//             >
//               {lbl}
//             </Text>
//           </View>
//         );
//       })}
//     </View>
//   );

//   const OptionItem = ({ label, icon, field }) => {
//     const isSelected = form[field] === label;
//     return (
//       <TouchableOpacity
//         style={[
//           styles.optionRow,
//           { borderColor: isSelected ? "#5D5FEF" : "#ccc", borderWidth: 1, borderRadius: 10 },
//         ]}
//         onPress={() => handleInput(field, label)}
//       >
//         <Ionicons name={icon} size={22} color={isSelected ? "#5D5FEF" : "#555"} />
//         <Text style={[styles.optionLabel, { color: isSelected ? "#5D5FEF" : "#333" }]}>{label}</Text>
//         {isSelected && <Ionicons name="checkmark" size={20} color="#5D5FEF" style={{ marginLeft: "auto" }} />}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View className="flex-1 bg-gray-50">
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           {/* Header */}
//           <View className="bg-[#5D5FEF] rounded-b-[80px] px-6 pt-16 pb-20 items-center shadow-lg">
//             <LottieView
//               source={require("../../assets/Workwithartificialintelligence.json")}
//               autoPlay
//               loop
//               style={{ width: 330, height: 180 }}
//             />
//             <Text className="text-white font-extrabold text-3xl w-full text-right">
//               Report a Lost Person
//             </Text>
//           </View>

//           {/* Form */}
//           <View className="px-6 py-6 -mt-20">
//             <View className="bg-white rounded-3xl px-6 py-6 shadow-2xl">
//               <StepIndicator />

//               {step === 0 && (
//                 <>
//                   <InputField placeholder="Full Name of Lost Person" value={form.name} onChangeText={(t) => handleInput("name", t)} />
//                   <InputField placeholder="Age" value={form.age} keyboardType="numeric" onChangeText={(t) => handleInput("age", t)} />
//                   <Text style={{ fontWeight: "600", marginBottom: 6 }}>Select Gender</Text>
//                   <OptionItem label="Male" icon="male" field="gender" />
//                   <OptionItem label="Female" icon="female" field="gender" />
//                   <OptionItem label="Transgender" icon="transgender" field="gender" />
//                   <OptionItem label="Other" icon="help-circle" field="gender" />
//                 </>
//               )}

//               {step === 1 && (
//                 <>
//                   <InputField placeholder="Where was the person lost?" value={form.whereLost} onChangeText={(t) => handleInput("whereLost", t)} />
//                   <Text style={{ fontWeight: "600", marginBottom: 6 }}>Relation with Lost Person</Text>
//                   <OptionItem label="Father" icon="man" field="relation" />
//                   <OptionItem label="Mother" icon="woman" field="relation" />
//                   <OptionItem label="Brother" icon="man" field="relation" />
//                   <OptionItem label="Sister" icon="woman" field="relation" />
//                   <OptionItem label="Uncle" icon="man" field="relation" />
//                   <OptionItem label="Aunty" icon="woman" field="relation" />
//                 </>
//               )}

//               {step === 2 && (
//                 <>
//                   <InputField placeholder="Mobile Number" value={form.mobile} keyboardType="phone-pad" onChangeText={(t) => handleInput("mobile", t)} />
//                   <TouchableOpacity
//                     onPress={pickImage}
//                     className="w-48 h-48 border-2 border-dashed border-[#7879F1] rounded-2xl mb-6 bg-[#FAFAFF] shadow-md self-center items-center justify-center"
//                   >
//                     {image ? (
//                       <Image source={{ uri: image }} className="w-full h-full rounded-2xl" />
//                     ) : (
//                       <View className="items-center">
//                         <Ionicons name="cloud-upload-outline" size={40} color="#A5A6F6" />
//                         <Text className="text-[#7879F1] mt-2">Select Image</Text>
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 </>
//               )}

//               {step === 3 && <Text style={{ textAlign: "center", fontSize: 16, color: "#444", marginBottom: 20 }}>Review your details and Submit ✅</Text>}

//               {/* Navigation */}
//               <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
//                 {step > 0 && (
//                   <TouchableOpacity onPress={() => setStep(step - 1)} className="bg-gray-300 px-6 py-3 rounded-xl">
//                     <Text>⬅ Previous</Text>
//                   </TouchableOpacity>
//                 )}

//                 {step < 3 ? (
//                   <TouchableOpacity
//                     onPress={() => {
//                       if (validateStep()) setStep(step + 1);
//                     }}
//                     className="bg-[#5D5FEF] px-6 py-3 rounded-xl"
//                   >
//                     <Text className="text-white font-bold">Next ➡</Text>
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity disabled={uploading} onPress={handleSubmit} className={`px-6 py-3 rounded-xl ${uploading ? "bg-gray-400" : "bg-[#28a745]"}`}>
//                     <Text className="text-white font-bold">Submit Report</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {(uploading || showCheck) && (
//         <Modal transparent animationType="fade">
//           <BlurView intensity={50} tint="dark" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             {uploading && !showCheck && <LottieView source={require("../../assets/LoadingSpinner(Dots).json")} autoPlay loop style={{ width: 250, height: 250 }} />}
//             {showCheck && <LottieView source={require("../../assets/Checked.json")} autoPlay loop={false} style={{ width: "90%", height: "90%" }} />}
//           </BlurView>
//         </Modal>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 16,
//     backgroundColor: "#f9fafb",
//     fontSize: 16,
//     color: "#1f2937",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 16,
//   },
//   optionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     marginVertical: 4,
//   },
//   optionLabel: {
//     marginLeft: 12,
//     fontSize: 16,
//   },
// });





import { useUser } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const API_URL = "https://krish09bha-dhruvai.hf.space";

const InputField = ({ placeholder, value, onChangeText, ...props }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#9CA3AF" // 👈 Added for visibility (nice gray)
    value={value}
    onChangeText={onChangeText}
    {...props}
  />
);

export default function ReportLost() {
  const { user } = useUser();

  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    whereLost: "",
    relation: "",
    mobile: "",
  });

  const [step, setStep] = useState(0);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const userId = user?.id;

  const handleInput = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const validateStep = () => {
    if (step === 0 && (!form.name || !form.age || !form.gender)) {
      Alert.alert("⚠️ Missing Info", "Please fill name, age and select gender.");
      return false;
    }
    if (step === 1 && (!form.whereLost || !form.relation)) {
      Alert.alert("⚠️ Missing Info", "Please enter where lost and relation.");
      return false;
    }
    if (step === 2 && (!form.mobile || !image)) {
      Alert.alert("⚠️ Missing Info", "Please enter mobile and upload photo.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const { name, gender, age, whereLost, relation, mobile } = form;

    if (!name || !gender || !age || !whereLost || !relation || !mobile || !image) {
      Alert.alert("⚠️ Missing Info", "Please fill all fields and upload a photo.");
      return;
    }

    setUploading(true);
    setShowCheck(false);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("gender", gender);
      formData.append("age", parseInt(age));
      formData.append("where_lost", whereLost);
      formData.append("relation_with_lost", relation);
      formData.append("mobile_no", mobile);

      formData.append("your_name", user?.fullName || "");
      formData.append("email_id", user?.primaryEmailAddress?.emailAddress || "");
      formData.append("user_id", userId);

      formData.append("file", {
        uri: image,
        name: "lost_person.jpg",
        type: "image/jpeg",
      });

      const resp = await fetch(`${API_URL}/upload_lost`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (resp.ok) {
        setShowCheck(true);
        setTimeout(() => {
          Alert.alert("✅ Success", "Report Registered Successfully");
          setForm({
            name: "",
            gender: "",
            age: "",
            whereLost: "",
            relation: "",
            mobile: "",
          });
          setImage(null);
          setShowCheck(false);
          setStep(0);
        }, 2500);
      } else {
        const data = await resp.json();
        Alert.alert("❌ Error", data.detail || "Something went wrong.");
      }
    } catch (err) {
      console.error("Upload error", err);
      Alert.alert("❌ Error", "Network/server issue while reporting.");
    } finally {
      setUploading(false);
    }
  };

  const steps = ["Lost Info", "Details", "Contact & Photo", "Submit"];

  const StepIndicator = () => (
    <View style={{ marginVertical: 12, marginLeft: 10 }}>
      {steps.map((lbl, idx) => {
        const isActive = idx === step;
        const isCompleted = idx < step;
        return (
          <View key={lbl} style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: isCompleted || isActive ? "#5D5FEF" : "#e5e7eb",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                {isCompleted ? "✓" : idx + 1}
              </Text>
            </View>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 15,
                fontWeight: "600",
                color: isActive || isCompleted ? "#111" : "#aaa",
              }}
            >
              {lbl}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const OptionItem = ({ label, icon, field }) => {
    const isSelected = form[field] === label;
    return (
      <TouchableOpacity
        style={[
          styles.optionRow,
          { borderColor: isSelected ? "#5D5FEF" : "#ccc", borderWidth: 1, borderRadius: 10 },
        ]}
        onPress={() => handleInput(field, label)}
      >
        <Ionicons name={icon} size={22} color={isSelected ? "#5D5FEF" : "#555"} />
        <Text style={[styles.optionLabel, { color: isSelected ? "#5D5FEF" : "#333" }]}>{label}</Text>
        {isSelected && <Ionicons name="checkmark" size={20} color="#5D5FEF" style={{ marginLeft: "auto" }} />}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View className="bg-[#5D5FEF] rounded-b-[80px] px-6 pt-16 pb-20 items-center shadow-lg">
            <LottieView
              source={require("../../assets/Workwithartificialintelligence.json")}
              autoPlay
              loop
              style={{ width: 330, height: 180 }}
            />
            <Text className="text-white font-extrabold text-3xl w-full text-right">
              Report a Lost Person
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 py-6 -mt-20">
            <View className="bg-white rounded-3xl px-6 py-6 shadow-2xl">
              <StepIndicator />

              {step === 0 && (
                <>
                  <InputField placeholder="Full Name of Lost Person" value={form.name} onChangeText={(t) => handleInput("name", t)} />
                  <InputField placeholder="Age" value={form.age} keyboardType="numeric" onChangeText={(t) => handleInput("age", t)} />
                  <Text style={{ fontWeight: "600", marginBottom: 6 }}>Select Gender</Text>
                  <OptionItem label="Male" icon="male" field="gender" />
                  <OptionItem label="Female" icon="female" field="gender" />
                  <OptionItem label="Transgender" icon="transgender" field="gender" />
                  <OptionItem label="Other" icon="help-circle" field="gender" />
                </>
              )}

              {step === 1 && (
                <>
                  <InputField placeholder="Where was the person lost?" value={form.whereLost} onChangeText={(t) => handleInput("whereLost", t)} />
                  <Text style={{ fontWeight: "600", marginBottom: 6 }}>Relation with Lost Person</Text>
                  <OptionItem label="Father" icon="man" field="relation" />
                  <OptionItem label="Mother" icon="woman" field="relation" />
                  <OptionItem label="Brother" icon="man" field="relation" />
                  <OptionItem label="Sister" icon="woman" field="relation" />
                  <OptionItem label="Uncle" icon="man" field="relation" />
                  <OptionItem label="Aunty" icon="woman" field="relation" />
                </>
              )}

              {step === 2 && (
                <>
                  <InputField placeholder="Mobile Number" value={form.mobile} keyboardType="phone-pad" onChangeText={(t) => handleInput("mobile", t)} />
                  <TouchableOpacity
                    onPress={pickImage}
                    className="w-48 h-48 border-2 border-dashed border-[#7879F1] rounded-2xl mb-6 bg-[#FAFAFF] shadow-md self-center items-center justify-center"
                  >
                    {image ? (
                      <Image source={{ uri: image }} className="w-full h-full rounded-2xl" />
                    ) : (
                      <View className="items-center">
                        <Ionicons name="cloud-upload-outline" size={40} color="#A5A6F6" />
                        <Text className="text-[#7879F1] mt-2">Select Image</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {step === 3 && <Text style={{ textAlign: "center", fontSize: 16, color: "#444", marginBottom: 20 }}>Review your details and Submit ✅</Text>}

              {/* Navigation */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                {step > 0 && (
                  <TouchableOpacity onPress={() => setStep(step - 1)} className="bg-gray-300 px-6 py-3 rounded-xl">
                    <Text>⬅ Previous</Text>
                  </TouchableOpacity>
                )}

                {step < 3 ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (validateStep()) setStep(step + 1);
                    }}
                    className="bg-[#5D5FEF] px-6 py-3 rounded-xl"
                  >
                    <Text className="text-white font-bold">Next ➡</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity disabled={uploading} onPress={handleSubmit} className={`px-6 py-3 rounded-xl ${uploading ? "bg-gray-400" : "bg-[#28a745]"}`}>
                    <Text className="text-white font-bold">Submit Report</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {(uploading || showCheck) && (
        <Modal transparent animationType="fade">
          <BlurView intensity={50} tint="dark" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {uploading && !showCheck && <LottieView source={require("../../assets/LoadingSpinner(Dots).json")} autoPlay loop style={{ width: 250, height: 250 }} />}
            {showCheck && <LottieView source={require("../../assets/Checked.json")} autoPlay loop={false} style={{ width: "90%", height: "90%" }} />}
          </BlurView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    fontSize: 16,
    color: "#1f2937",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 4,
  },
  optionLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
});