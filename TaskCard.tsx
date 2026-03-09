import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Task } from "../types";

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  categoryColor: string;
  theme: {
    bg: string;
    text: string;
    subText: string;
    card: string;
  };
  isDark: boolean;
};

export default function TaskCard({
  task,
  onToggle,
  onDelete,
  categoryColor,
  theme,
  isDark,
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
        <Text style={[styles.description, { color: theme.subText }]}>
          {task.description}
        </Text>

        <View style={styles.badgesContainer}>
          <View
            style={[styles.categoryBadge, { backgroundColor: categoryColor }]}
          >
            <Text style={styles.categoryText}>{task.category}</Text>
          </View>

          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor:
                  task.priority === "doNow"
                    ? "#EF4444"
                    : task.priority === "doNextWeek"
                      ? "#F59E0B"
                      : "#6366F1",
              },
            ]}
          >
            <Text style={styles.priorityText}>
              {task.priority === "doNow"
                ? "Now"
                : task.priority === "doNextWeek"
                  ? "Next Week"
                  : "Later"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.circle,
            {
              borderColor: isDark ? "white" : "#111827",
            },
            task.completed && styles.completedCircle,
          ]}
          onPress={onToggle}
        />
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteBtnText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    flexDirection: "row",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
  },
  description: {
    fontSize: 13,
    marginTop: 6,
  },
  badgesContainer: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
    gap: 8,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  completedCircle: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  deleteBtnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
