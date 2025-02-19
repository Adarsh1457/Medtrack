import { ref, set, get, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '@/lib/firebase';

export interface Medication {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timings: string[];
  remarks: string;
  frequency: string;
  userId: string;
  createdAt: number;
}

export const addMedication = async (medication: Omit<Medication, 'id' | 'createdAt'>) => {
  const newMedicationRef = ref(database, `medications/${medication.userId}/${Date.now()}`);
  const newMedication: Medication = {
    ...medication,
    id: newMedicationRef.key || Date.now().toString(),
    createdAt: Date.now(),
  };
  
  await set(newMedicationRef, newMedication);
  console.log('Added new medication:', newMedication);
  return newMedication;
};

export const getMedications = async (userId: string): Promise<Medication[]> => {
  const medicationsRef = ref(database, `medications/${userId}`);
  const snapshot = await get(medicationsRef);
  
  if (!snapshot.exists()) {
    console.log('No medications found for user:', userId);
    return [];
  }
  
  const medications = Object.values(snapshot.val()) as Medication[];
  console.log('Retrieved medications:', medications);
  return medications;
};

export const deleteMedication = async (userId: string, medicationId: string) => {
  const medicationRef = ref(database, `medications/${userId}/${medicationId}`);
  await remove(medicationRef);
  console.log('Deleted medication:', medicationId);
};

export const updateMedication = async (
  userId: string,
  medicationId: string,
  updates: Partial<Medication>
) => {
  const medicationRef = ref(database, `medications/${userId}/${medicationId}`);
  await set(medicationRef, updates);
  console.log('Updated medication:', medicationId, updates);
};