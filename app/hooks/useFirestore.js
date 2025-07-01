import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'profile', 'mJyPcUbj5SMQ4Q0zfofl');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, []);

  return profile;
};

export const useSkills = () => {
  const [skillsFire, setSkillsFire] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const querySnapshot = await getDocs(collection(db, 'skills'));
      setSkillsFire(querySnapshot.docs.map(doc => doc.data().name));
    };
    fetchSkills();
  }, []);

  return skillsFire;
};