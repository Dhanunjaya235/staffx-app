import { useSelector } from "react-redux";
import { selectEmployeePermissions } from "../store/slices/employeeSlice";

export const useEmployeeRoles = () =>
  useSelector(selectEmployeePermissions);