// Example usage for different card types

import React from 'react';
import { View, StyleSheet } from 'react-native';
import DynamicKekaCard from './DynamicCard';

const ExampleCards = () => {
  // Shift Card Example (original)
  const shiftCardData = {
    title: "Fri, 26",
    subtitle: "General Shift (12:11 PM - 09:11 PM)",
    status: {
      text: "ON TIME",
      color: "#27AE60"
    },
    sections: [
      {
        items: [
          { label: "Clock In", value: "12:11 PM", isHighlighted: true },
          { label: "Clock Out", value: "04:22 PM", valueColor: "#E74C3C", isHighlighted: true }
        ],
        showDivider: true
      },
      {
        items: [
          { label: "Effective hours", value: "3h 50m", isHighlighted: true },
          { label: "Gross hours", value: "4h 11m", isHighlighted: true }
        ]
      }
    ]
  };

  // Client Card Example
  const clientCardData = {
    title: "TechCorp Solutions",
    subtitle: "Enterprise Client - Technology Sector",
    status: {
      text: "ACTIVE",
      color: "#27AE60"
    },
    sections: [
      {
        items: [
          { label: "Contact Person", value: "John Smith" },
          { label: "Email", value: "john.smith@techcorp.com" },
          { label: "Phone", value: "+1 (555) 123-4567" }
        ],
        showDivider: true
      },
      {
        items: [
          { label: "Projects Active", value: "5", isHighlighted: true },
          { label: "Contract Value", value: "$250,000", isHighlighted: true, valueColor: "#27AE60" },
          { label: "Next Review", value: "Dec 15, 2025" }
        ]
      }
    ]
  };

  // Job Card Example
  const jobCardData = {
    title: "Senior React Developer",
    subtitle: "Full-time • Remote • TechCorp Solutions",
    status: {
      text: "OPEN",
      color: "#3498DB"
    },
    sections: [
      {
        items: [
          { label: "Department", value: "Engineering" },
          { label: "Experience Required", value: "5+ years" },
          { label: "Skills", value: "React, TypeScript, Node.js" }
        ],
        showDivider: true
      },
      {
        items: [
          { label: "Salary Range", value: "$90K - $120K", isHighlighted: true, valueColor: "#27AE60" },
          { label: "Applications", value: "24", isHighlighted: true },
          { label: "Posted Date", value: "Sep 20, 2025" }
        ]
      }
    ]
  };

  // Vendor Card Example
  const vendorCardData = {
    title: "CloudServe Technologies",
    subtitle: "IT Infrastructure & Cloud Services",
    status: {
      text: "VERIFIED",
      color: "#8E44AD"
    },
    sections: [
      {
        items: [
          { label: "Service Type", value: "Cloud Infrastructure" },
          { label: "Contract Duration", value: "2 years" },
          { label: "Primary Contact", value: "Sarah Johnson" }
        ],
        showDivider: true
      },
      {
        items: [
          { label: "Monthly Cost", value: "$15,000", isHighlighted: true, valueColor: "#E67E22" },
          { label: "Performance Rating", value: "4.8/5", isHighlighted: true, valueColor: "#27AE60" },
          { label: "Next Renewal", value: "Mar 2026" }
        ]
      }
    ]
  };

  // Role Assigned Card Example
  const roleCardData = {
    title: "Project Manager",
    subtitle: "Mobile App Development Project",
    status: {
      text: "ASSIGNED",
      color: "#E74C3C"
    },
    sections: [
      {
        items: [
          { label: "Assigned To", value: "Alice Williams" },
          { label: "Team Size", value: "8 members" },
          { label: "Start Date", value: "Oct 1, 2025" }
        ],
        showDivider: true
      },
      {
        items: [
          { label: "Project Duration", value: "6 months", isHighlighted: true },
          { label: "Budget Allocated", value: "$180,000", isHighlighted: true, valueColor: "#27AE60" },
          { label: "Deadline", value: "Mar 31, 2026", valueColor: "#E74C3C" }
        ]
      }
    ]
  };

  return (
    <View style={styles.container}>
      <DynamicKekaCard {...shiftCardData} />
      <DynamicKekaCard {...clientCardData} />
      <DynamicKekaCard {...jobCardData} />
      <DynamicKekaCard {...vendorCardData} />
      <DynamicKekaCard {...roleCardData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingVertical: 10,
  },
});

export default ExampleCards;