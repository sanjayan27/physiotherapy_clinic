export interface Slot {
  id: string;
  slot: string;
  time: string;
  isBooked: boolean;
  patientName: string;
  date: string;
}

export type ModalMode = "edit" | "delete" | "create";
