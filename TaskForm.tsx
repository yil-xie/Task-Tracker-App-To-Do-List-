import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Category, Priority } from "../types";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    description: string,
    category: Category,
    priority: Priority,
  ) => void;
  isDark: boolean;
};

const defaultCategories: Category[] = ["School", "Home", "Personal"];

const lightTheme = {
  bg: "#F8F9FA",
  card: "#FFFFFF",
  text: "#111827",
  subText: "#6B7280",
  input: "#F3F4F6",
  inputText: "#111827",
  inputPlaceholder: "#9CA3AF",
  modalBg: "rgba(0,0,0,0.5)",
  categoryInactive: "#E5E7EB",
  categoryInactiveText: "#374151",
  buttonCancel: "#FEE2E2",
  buttonCancelText: "#DC2626",
};

const darkTheme = {
  bg: "#111827",
  card: "#1F2937",
  text: "#FFFFFF",
  subText: "#D1D5DB",
  input: "#111827",
  inputText: "#FFFFFF",
  inputPlaceholder: "#6B7280",
  modalBg: "rgba(0,0,0,0.7)",
  categoryInactive: "#374151",
  categoryInactiveText: "#D1D5DB",
  buttonCancel: "#7F1D1D",
  buttonCancelText: "#FECACA",
};

export default function TaskForm({ visible, onClose, onAdd, isDark }: Props) {
  const theme = isDark ? darkTheme : lightTheme;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("School");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("doNow");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  const handleAddTask = () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    const category =
      showCustomInput && customCategory.trim()
        ? customCategory
        : selectedCategory;

    onAdd(title.trim(), description.trim(), category, selectedPriority);

    setTitle("");
    setDescription("");
    setCustomCategory("");
    setShowCustomInput(false);
    setSelectedCategory(categories[0]);
    setSelectedPriority("doNow");
    onClose();
  };

  const handleAddCustomCategory = () => {
    if (
      customCategory.trim() &&
      !categories.includes(customCategory as Category)
    ) {
      setCategories([...categories, customCategory as Category]);
      setSelectedCategory(customCategory as Category);
      setCustomCategory("");
      setShowCustomInput(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.container, { backgroundColor: theme.modalBg }]}>
        <ScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>New Task</Text>

            <TextInput
              placeholder="Task title"
              placeholderTextColor={theme.inputPlaceholder}
              value={title}
              onChangeText={setTitle}
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  color: theme.inputText,
                  borderColor: isDark ? "#374151" : "#E5E7EB",
                  borderWidth: 1,
                },
              ]}
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor={theme.inputPlaceholder}
              value={description}
              onChangeText={setDescription}
              style={[
                styles.input,
                {
                  height: 100,
                  backgroundColor: theme.input,
                  color: theme.inputText,
                  borderColor: isDark ? "#374151" : "#E5E7EB",
                  borderWidth: 1,
                },
              ]}
              multiline
            />

            <Text style={[styles.label, { color: theme.text }]}>Category</Text>

            <View style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setShowCustomInput(false);
                  }}
                  style={[
                    styles.categoryBtn,
                    {
                      backgroundColor:
                        selectedCategory === cat
                          ? "#4C6EF5"
                          : theme.categoryInactive,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryBtnText,
                      {
                        color:
                          selectedCategory === cat
                            ? "white"
                            : theme.categoryInactiveText,
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowCustomInput(!showCustomInput)}
              style={[
                styles.customBtn,
                {
                  backgroundColor: isDark ? "#374151" : "#E5E7EB",
                  borderColor: isDark ? "#4B5563" : "#D1D5DB",
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.customBtnText,
                  { color: isDark ? "#60A5FA" : "#2563EB" },
                ]}
              >
                {showCustomInput ? "Cancel Custom" : "+ Add Custom Category"}
              </Text>
            </TouchableOpacity>

            {showCustomInput && (
              <View style={styles.customInputContainer}>
                <TextInput
                  placeholder="Enter custom category"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.input,
                      color: theme.inputText,
                      borderColor: isDark ? "#374151" : "#E5E7EB",
                      borderWidth: 1,
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={handleAddCustomCategory}
                  style={styles.addCustomBtn}
                >
                  <Text style={styles.addCustomBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={[styles.label, { color: theme.text }]}>
              When do you need to complete this?
            </Text>

            <View style={styles.priorityRow}>
              <TouchableOpacity
                onPress={() => setSelectedPriority("doNow")}
                style={[
                  styles.priorityBtn,
                  {
                    backgroundColor:
                      selectedPriority === "doNow"
                        ? "#EF4444"
                        : theme.categoryInactive,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityBtnText,
                    {
                      color:
                        selectedPriority === "doNow"
                          ? "white"
                          : theme.categoryInactiveText,
                    },
                  ]}
                >
                  Do Now
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedPriority("doNextWeek")}
                style={[
                  styles.priorityBtn,
                  {
                    backgroundColor:
                      selectedPriority === "doNextWeek"
                        ? "#F59E0B"
                        : theme.categoryInactive,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityBtnText,
                    {
                      color:
                        selectedPriority === "doNextWeek"
                          ? "white"
                          : theme.categoryInactiveText,
                    },
                  ]}
                >
                  Do Next Week
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedPriority("doLater")}
                style={[
                  styles.priorityBtn,
                  {
                    backgroundColor:
                      selectedPriority === "doLater"
                        ? "#6366F1"
                        : theme.categoryInactive,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityBtnText,
                    {
                      color:
                        selectedPriority === "doLater"
                          ? "white"
                          : theme.categoryInactiveText,
                    },
                  ]}
                >
                  Do Later
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.btn,
                  {
                    backgroundColor: theme.buttonCancel,
                    borderColor: theme.buttonCancelText,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[styles.btnText, { color: theme.buttonCancelText }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddTask}
                style={[styles.btn, styles.addBtn]}
              >
                <Text style={[styles.btnText, { color: "white" }]}>
                  Add Task
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollContainer: {
    flex: 1,
    maxHeight: "100%",
  },
  formContainer: {
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    ...Platform.select({
      web: {
        maxWidth: 1500,
        alignSelf: "center",
        padding: 50,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  categoryScroll: {
    flexDirection: "row",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  categoryBtnText: {
    fontSize: 12,
    fontWeight: "500",
  },
  customBtn: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  customBtnText: {
    fontWeight: "600",
    fontSize: 14,
  },
  customInputContainer: {
    marginBottom: 15,
  },
  priorityRow: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
    flexWrap: "wrap",
  },
  priorityBtn: {
    flex: 1,
    minWidth: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  priorityBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  addCustomBtn: {
    backgroundColor: "#22C55E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  addCustomBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  addBtn: {
    backgroundColor: "#4C6EF5",
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
