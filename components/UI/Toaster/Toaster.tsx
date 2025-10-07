import React, { JSX, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  XCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react-native"; // Use RN version
import { removeToast } from "../../../store/slices/toastSlice";
import { RootState } from "../../../store";

const Toaster = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);
  const dispatch = useDispatch();

  return (
    <View className="absolute top-4 right-4 space-y-2 w-full px-4">
      {toasts.map((toast) => {
        const typeStyles: Record<string, string> = {
          success: "bg-green-500",
          error: "bg-red-600",
          info: "bg-blue-500",
          warning: "bg-yellow-500",
        };

        const textStyles: Record<string, string> = {
          success: "text-white",
          error: "text-white",
          info: "text-white",
          warning: "text-black",
        };

        const typeIcons: Record<string, JSX.Element> = {
          success: <CheckCircle2 className="w-5 h-5 mr-2" />,
          error: <XCircle className="w-5 h-5 mr-2" />,
          info: <Info className="w-5 h-5 mr-2" />,
          warning: <AlertTriangle className="w-5 h-5 mr-2" />,
        };

        return (
          <View
            key={toast.id}
            className={`flex-row items-center px-4 py-3 rounded-lg shadow-lg ${typeStyles[toast.type]}`}
          >
            {typeIcons[toast.type]}
            <Text className={`flex-1 ${textStyles[toast.type]}`}>
              {toast.message}
            </Text>
            <TouchableOpacity
              onPress={() => dispatch(removeToast(toast.id))}
              className="ml-2"
            >
              <Text className={`${textStyles[toast.type]}`}>✕</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default Toaster;
