import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Celebration from "./components/Celebration";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import { Category, Priority, Task } from "./types";

const categories: ("All" | Category)[] = ["All", "School", "Home", "Personal"];

const categoryColors: Record<Category, string> = {
  School: "#375df4",
  Home: "#f18b25",
  Personal: "#2ddc16",
};

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [time, setTime] = useState(new Date());
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTask = (
    title: string,
    description: string,
    category: Category,
    priority: Priority,
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      category,
      priority,
      completed: false,
      date: new Date().toLocaleString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2500);
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesCategory = filter === "All" || task.category === filter;

      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [tasks, filter, search]);

  const theme = isDark ? dark : light;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.scrollView}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>My Tasks</Text>
            <Text style={{ color: theme.subText, fontSize: 13 }}>
              {time.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setIsDark(!isDark)}
            style={styles.iconButton}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={22}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search..."
          placeholderTextColor={theme.subText}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.search,
            { backgroundColor: theme.card, color: theme.text },
          ]}
        />

        <View style={styles.filterRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setFilter(cat)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    filter === cat && cat !== "All"
                      ? categoryColors[cat]
                      : filter === cat && cat === "All"
                        ? theme.card
                        : isDark
                          ? "#374151"
                          : "#E5E7EB",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color:
                    filter === cat
                      ? cat === "All"
                        ? theme.text
                        : "white"
                      : theme.text,
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredTasks.length > 0 ? (
          <ScrollView horizontal style={styles.boardRow}>
            {(["doNow", "doNextWeek", "doLater"] as Priority[]).map((prio) => {
              let columnTasks = filteredTasks.filter(
                (t) => t.priority === prio,
              );
              // sort newest tasks first
              columnTasks.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              );
              const header =
                prio === "doNow"
                  ? "Do Now"
                  : prio === "doNextWeek"
                    ? "Do Next Week"
                    : "Do Later";
              return (
                <View key={prio} style={styles.column}>
                  <Text style={[styles.columnHeader, { color: theme.text }]}>
                    {header}
                  </Text>
                  {columnTasks.length > 0 ? (
                    columnTasks.map((item) => (
                      <TaskCard
                        key={item.id}
                        task={item}
                        onToggle={() => toggleComplete(item.id)}
                        onDelete={() => deleteTask(item.id)}
                        categoryColor={categoryColors[item.category]}
                        theme={theme}
                        isDark={isDark}
                      />
                    ))
                  ) : (
                    <Text style={{ color: theme.subText, marginTop: 8 }}>
                      (none)
                    </Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: theme.subText }]}>
              No tasks found
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
        <Ionicons name="add" size={26} color="white" />
      </TouchableOpacity>

      <TaskForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        onAdd={addTask}
        isDark={isDark}
      />

      <Celebration show={celebrating} />
    </View>
  );
}

const light = {
  bg: "#F8F9FA",
  text: "#111",
  subText: "#6B7280",
  card: "#FFFFFF",
};

const dark = {
  bg: "#111827",
  text: "#FFFFFF",
  subText: "#9CA3AF",
  card: "#1F2937",
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
    marginHorizontal: 10,
  },
  title: { fontSize: 22, fontWeight: "600" },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  search: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 5,
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 6,
    backgroundColor: "#E5E7EB",
  },
  emptyState: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
  },
  bottomSpacing: {
    height: 80,
  },
  boardRow: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  column: {
    width: 260,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 8,
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#4C6EF5",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
});
