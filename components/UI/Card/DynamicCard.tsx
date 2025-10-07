import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

// Define types for different card data
export interface CardDataItem {
  label: ReactNode;
  value: ReactNode;
  valueColor?: ReactNode;
  isHighlighted?: boolean;
}

export interface CardSection {
  items: CardDataItem[];
  showDivider?: boolean;
}

export interface DynamicCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  status?: {
    text: ReactNode;
    color: ReactNode;
  };
  sections: CardSection[];
  backgroundColor?: ReactNode;
  containerStyle?: object;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  title,
  subtitle,
  status,
  sections,
  backgroundColor = '#2C3E50',
  containerStyle,
}) => {
  const renderSection = (section: CardSection, sectionIndex: number) => {
    const isLastSection = sectionIndex === sections.length - 1;
    
    return (
      <View key={sectionIndex}>
        <View style={styles.section}>
          {section.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.dataItem}>
              <Text style={styles.dataLabel}>{item.label}</Text>
              <Text>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
        {section.showDivider && !isLastSection && (
          <View style={styles.divider} />
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }, containerStyle]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitleText}>{subtitle}</Text>
          )}
        </View>
        {status && (
          <View style={[styles.statusBadge]}>
            <Text style={styles.statusText}>{status.text}</Text>
          </View>
        )}
      </View>

      {/* Dynamic Sections */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {sections.map((section, index) => renderSection(section, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    minHeight: 120,
    maxHeight: Dimensions.get('window').height * 0.7, // Prevent cards from being too tall
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    paddingRight: 12,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  subtitleText: {
    color: '#BDC3C7',
    fontSize: 12,
    fontWeight: '400',
    flexWrap: 'wrap',
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 12,
  },
  dataItem: {
    marginBottom: 8,
  },
  dataLabel: {
    color: '#BDC3C7',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  dataValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flexWrap: 'wrap',
    lineHeight: 18,
  },
  highlightedValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#34495E',
    marginVertical: 12,
  },
});

export default DynamicCard;
