import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface CardProps {
  // You can add props here if needed for dynamic data
}

const Card: React.FC<CardProps> = () => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.dateSection}>
          <Text style={styles.dayText}>Fri, 26</Text>
          <Text style={styles.shiftText}>General Shift (12:11 PM - 09:11 PM)</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>ON TIME</Text>
        </View>
      </View>

      {/* Clock In/Out Section */}
      <View style={styles.clockSection}>
        <View style={styles.clockItem}>
          <Text style={styles.clockLabel}>Clock In</Text>
          <Text style={styles.clockTime}>12:11 PM</Text>
        </View>
        <View style={styles.clockItem}>
          <Text style={styles.clockLabel}>Clock Out</Text>
          <Text style={styles.clockTimeRed}>04:22 PM</Text>
        </View>
      </View>

      {/* Hours Section */}
      <View style={styles.hoursSection}>
        <View style={styles.hoursItem}>
          <Text style={styles.hoursLabel}>Effective hours</Text>
          <Text style={styles.hoursValue}>3h 50m</Text>
        </View>
        <View style={styles.hoursItem}>
          <Text style={styles.hoursLabel}>Gross hours</Text>
          <Text style={styles.hoursValue}>4h 11m</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dateSection: {
    flex: 1,
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  shiftText: {
    color: '#BDC3C7',
    fontSize: 12,
    fontWeight: '400',
  },
  statusBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  clockSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  clockItem: {
    flex: 1,
  },
  clockLabel: {
    color: '#BDC3C7',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
  },
  clockTime: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clockTimeRed: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '600',
  },
  hoursSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hoursItem: {
    flex: 1,
  },
  hoursLabel: {
    color: '#BDC3C7',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
  },
  hoursValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Card;
