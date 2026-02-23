import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchLatestPlan } from "../api/plan";
import { cachePlan, getCachedPlan } from "../storage/planCache";
import { logout } from "../api/auth";
import { PlanResponse, Workout, WorkoutStep } from "../types/plan";

interface PlanScreenProps {
  onLogout: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs === 0 ? `${mins}:00` : `${mins}:${secs.toString().padStart(2, "0")}`;
}

function StepItem({ step }: { step: WorkoutStep }) {
  return (
    <View style={styles.stepRow}>
      <Text style={styles.stepType}>{step.type}</Text>
      {step.durationSec != null && (
        <Text style={styles.stepDuration}>{formatDuration(step.durationSec)}</Text>
      )}
      {step.note && <Text style={styles.stepNote}>{step.note}</Text>}
    </View>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{workout.title}</Text>
        <Text style={styles.cardDate}>{workout.scheduledFor}</Text>
      </View>
      <Text style={styles.cardSport}>{workout.sportType}</Text>
      {workout.steps.length > 0 && (
        <Text style={styles.cardStepCount}>
          {workout.steps.length} step{workout.steps.length !== 1 ? "s" : ""}
          {expanded ? " ▲" : " ▼"}
        </Text>
      )}
      {expanded &&
        workout.steps.map((step) => (
          <StepItem key={step.stepIndex} step={step} />
        ))}
    </TouchableOpacity>
  );
}

export default function PlanScreen({ onLogout }: PlanScreenProps) {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlan = async () => {
    setLoading(true);
    setError(null);

    // Try cache first
    const cached = await getCachedPlan();
    if (cached) {
      setPlan(cached);
      setLoading(false);
    }

    // Then fetch fresh
    try {
      const freshPlan = await fetchLatestPlan();
      setPlan(freshPlan);
      await cachePlan(freshPlan);
    } catch (err) {
      if (!cached) {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  if (loading && !plan) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (error && !plan) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPlan}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Plan</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {plan && (
        <Text style={styles.versionText}>Version {plan.planVersion}</Text>
      )}
      <ScrollView style={styles.list}>
        {plan?.workouts.map((workout) => (
          <WorkoutCard key={workout.workoutId} workout={workout} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logoutText: {
    color: "#a0a0b0",
    fontSize: 14,
  },
  versionText: {
    color: "#666",
    fontSize: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#2a2a3e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cardDate: {
    fontSize: 14,
    color: "#a0a0b0",
  },
  cardSport: {
    fontSize: 12,
    color: "#4ade80",
    marginTop: 4,
  },
  cardStepCount: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#4ade80",
    marginTop: 8,
  },
  stepType: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
    minWidth: 80,
  },
  stepDuration: {
    fontSize: 13,
    color: "#a0a0b0",
    marginLeft: 8,
  },
  stepNote: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4ade80",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: "#1a1a2e",
    fontWeight: "bold",
  },
});
