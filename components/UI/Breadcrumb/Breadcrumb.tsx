import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight, Home } from 'lucide-react-native';

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  home?: { label?: string; onPress: () => void };
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, home }) => {
  return (
    <View style={styles.container}>
      {home && (
        <View style={styles.item}>
          <TouchableOpacity
            onPress={home.onPress}
            style={styles.button}
          >
            <Home width={16} height={16} color="#1D4ED8" style={styles.icon} />
            <Text style={styles.homeText}>{home.label ?? 'Home'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          {(index > 0 || home) && (
            <ChevronRight width={16} height={16} color="#9CA3AF" style={styles.chevron} />
          )}
          {item.onPress ? (
            <TouchableOpacity onPress={item.onPress}>
              <Text style={styles.linkText}>{item.label}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.labelText}>{item.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  item: { flexDirection: 'row', alignItems: 'center' },
  button: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 4 },
  chevron: { marginHorizontal: 4 },
  homeText: { color: '#1D4ED8', fontSize: 14 },
  linkText: { color: '#1D4ED8', fontSize: 14 },
  labelText: { color: '#6B7280', fontSize: 14 },
});

export default Breadcrumb;
