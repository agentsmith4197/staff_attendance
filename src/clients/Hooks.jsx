import { useEffect, useState } from "react";
import { auth, db, doc, getDoc, getDocs, deleteDoc, updateDoc, collection, query, where, addDoc } from '../clients/firebase';

// Hook to fetch and manage user profile
export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      }
    };

    fetchUserProfile();
  }, []);

  return userProfile;
};

// Get the currently authenticated user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Fetch students from Firestore
export const fetchStaffs = async () => {
  try {
    const staffsCollection = collection(db, 'staffs');
    const staffsSnapshot = await getDocs(staffsCollection);
    const staffsList = staffsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort Staffs by registration number
    staffsList.sort((a, b) => a.staffID.localeCompare(b.staffID));

    return staffsList;
  } catch (error) {
    console.error('Error fetching staffs:', error);
    throw error;
  }
};

// Fetch a specific Staff by ID
export const fetchStaffById = async (id) => {
  try {
    const staffDoc = await getDoc(doc(db, 'staffs', id));
    if (staffDoc.exists()) {
      return { id: staffDoc.id, ...staffDoc.data() };
    } else {
      throw new Error('staff not found');
    }
  } catch (error) {
    console.error('Error fetching staff by ID:', error);
    throw error;
  }
};

// Delete a Staff from Firestore
export const deleteStaff = async (id) => {
  try {
    const staffDoc = doc(db, 'staffs', id);
    await deleteDoc(staffDoc);
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};

// Update a Staff in Firestore
export const updateStaff = async (id, updatedData) => {
  try {
    const staffDoc = doc(db, 'staffs', id);
    await updateDoc(staffDoc, updatedData);
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

// Fetch attendance records
export const fetchAttendanceRecords = async () => {
  try {
    const attendanceCollection = collection(db, 'attendance');
    const attendanceSnapshot = await getDocs(attendanceCollection);
    const attendanceData = attendanceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return attendanceData;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return [];
  }
};


// Fetch attendance records for a specific date
export const fetchAttendanceByDate = async (date) => {
  try {
    const attendanceCollection = collection(db, 'attendance');
    const q = query(attendanceCollection, where('date', '==', date));
    const attendanceSnapshot = await getDocs(q);
    const attendanceData = attendanceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return attendanceData;
  } catch (error) {
    console.error('Error fetching attendance by date:', error);
    return [];
  }
};

// Delete an attendance record
export const deleteAttendanceRecord = async (id) => {
  try {
    const recordDoc = doc(db, 'attendance', id);
    await deleteDoc(recordDoc);
    console.log('Record deleted successfully');
  } catch (error) {
    console.error('Error deleting attendance record:', error);
  }
};

// Update an attendance record
export const updateAttendanceRecord = async (id, updatedData) => {
  try {
    const recordDoc = doc(db, 'attendance', id);
    await updateDoc(recordDoc, updatedData);
    console.log('Record updated successfully');
  } catch (error) {
    console.error('Error updating attendance record:', error);
  }
};

// Fetch attendance statistics
export const fetchAttendanceStats = async () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const attendanceCollection = collection(db, 'attendance');
  const q = query(attendanceCollection, where('date', '==', today));
  const attendanceSnapshot = await getDocs(q);

  let present = 0;
  let absent = 0;

  attendanceSnapshot.docs.forEach(doc => {
    if (doc.data().status === 'present') {
      present++;
    } else if (doc.data().status === 'absent') {
      absent++;
    }
  });

  const total = present + absent;
  const average = total ? (present / total) * 100 : 0;

  return { present, absent, average: average.toFixed(2) };
};

// Fetch recent activities
export const fetchRecentActivities = async () => {
  try {
    const activitiesCollection = collection(db, 'activities');
    const activitiesSnapshot = await getDocs(activitiesCollection);
    return activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

// Save attendance data
export const saveAttendance = async (attendanceData) => {
  try {
    const attendanceCollection = collection(db, 'attendance');
    await addDoc(attendanceCollection, { attendance: attendanceData, date: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving attendance:', error);
  }
};
