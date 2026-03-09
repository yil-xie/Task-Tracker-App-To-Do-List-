import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface Confetti {
  id: number;
  x: number;
  y: number;
  vx: number;
  emoji: string;
  anim: Animated.Value;
  rotation: number;
}

export default function Celebration({ show }: { show: boolean }) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!show) {
      setConfetti([]);
      celebrationAnim.setValue(0);
      return;
    }

    const emojis = ["🎉", "🎊", "⭐", "✨", "🌟"];
    const pieces = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 300,
      y: Math.random() * 100 - 100,
      vx: (Math.random() - 0.5) * 500,
      emoji: emojis[i % emojis.length],
      anim: new Animated.Value(0),
      rotation: Math.random() * 360,
    }));

    setConfetti(pieces);

    // Animate celebration message
    Animated.sequence([
      Animated.timing(celebrationAnim, {
        toValue: 10,
        duration: 100000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(celebrationAnim, {
        toValue: 10,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate confetti falling with random scatter
    pieces.forEach((piece) => {
      Animated.timing(piece.anim, {
        toValue: 800,
        duration: 2500 + Math.random() * 1000,
        useNativeDriver: true,
      }).start();
    });
  }, [show, celebrationAnim]);

  if (!show || confetti.length === 0) return null;

  const celebrationScale = celebrationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const celebrationOpacity = celebrationAnim;

  return (
    <View style={styles.container} pointerEvents="none">
      {confetti.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confetti,
            {
              left: "50%",
              transform: [
                {
                  translateX: piece.x,
                },
                {
                  translateY: piece.anim,
                },
                {
                  translateX: Animated.multiply(piece.anim, piece.vx / 800),
                },
                {
                  rotate: `${piece.rotation}deg`,
                },
              ],
            },
          ]}
        >
          <Text style={styles.emoji}>{piece.emoji}</Text>
        </Animated.View>
      ))}

      <Animated.View
        style={[
          styles.celebration,
          {
            transform: [{ scale: celebrationScale }],
            opacity: celebrationOpacity,
          },
        ]}
      >
        <Text style={styles.celebrationText}>🎉yippiee 🎉</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  confetti: {
    position: "absolute",
    top: -50,
  },
  emoji: {
    fontSize: 35,
  },
  celebration: {
    position: "absolute",
    top: "65%",
    alignSelf: "center",
    backgroundColor: "rgba(76, 110, 245, 0.95)",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 35,
  },
  celebrationText: {
    fontSize: 150,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
