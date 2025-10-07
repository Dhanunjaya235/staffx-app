import React, { FC } from "react";
import { Text, View } from "react-native";

export interface StatusChipProps {
  status: string;
}

const StatusChip: FC<StatusChipProps> = ({ status }) => {
  let bgColor = "bg-slate-100";
  let textColor = "text-slate-700";

  if (
    status === "Not Started" ||
    status === "On Hold" ||
    status === "New" ||
    status === "Not Submitted" ||
    status === "Scheduled"
  ) {
    bgColor = "bg-gray-100";
    textColor = "text-gray-800";
  } else if (
    status === "In Progress" ||
    status === "Submitted" ||
    status === "Open" ||
    status === "Interviews Progress"
  ) {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
  } else if (
    status === "Completed" ||
    status === "Passed" ||
    status === "Fulfilled" ||
    status === "Selected"
  ) {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
  } else if (
    status === "Closed" ||
    status === "Failed" ||
    status === "Cancelled" ||
    status === "Not Selected"
  ) {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
  }

  return (
    <View
      className={`px-2 py-1 rounded-[5px] justify-center items-center`}
    >
      <Text className={`text-sm font-semibold ${textColor}`}>{status}</Text>
    </View>
  );
};

export default StatusChip;
