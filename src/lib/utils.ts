import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string, format: "short" | "long") {
  return moment(date).format(format === "short" ? "HH:mm" : "MMM D, YYYY, h:mm A");
}