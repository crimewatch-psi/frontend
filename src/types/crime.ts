export type CrimeRateLevel = "Highest" | "High" | "Medium" | "Low" | "Lowest";

export const crimeCategories = [
  "Arson",
  "Homicide",
  "Car break ins",
  "Assault",
  "Drug offenses",
  "Theft",
] as const;

export type CrimeCategory = (typeof crimeCategories)[number];

export interface CrimeData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  crimeRate: CrimeRateLevel;
  category?: CrimeCategory;
  date?: Date;
}

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
