import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { Organization, Need, Donation, DonationStatus } from '../types';

export const dataService = {
  // Organizations
  subscribeToOrganizations: (callback: (orgs: Organization[]) => void) => {
    const q = query(collection(db, 'organizations'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Organization));
      callback(orgs);
    });
  },

  // Needs
  subscribeToNeeds: (orgId: string, callback: (needs: Need[]) => void) => {
    const q = query(collection(db, `organizations/${orgId}/needs`), where('status', '==', 'active'));
    return onSnapshot(q, (snapshot) => {
      const needs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Need));
      callback(needs);
    });
  },

  // Donations
  subscribeToUserDonations: (userId: string, callback: (donations: Donation[]) => void) => {
    const q = query(
      collection(db, 'donations'), 
      where('donorId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const donations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
      callback(donations);
    });
  },

  // Create Donation
  createDonation: async (donation: Omit<Donation, 'id' | 'timestamp'>) => {
    return await addDoc(collection(db, 'donations'), {
      ...donation,
      timestamp: serverTimestamp()
    });
  },

  // Admin: Add Organization
  addOrganization: async (org: Omit<Organization, 'id' | 'createdAt'>) => {
    return await addDoc(collection(db, 'organizations'), {
      ...org,
      createdAt: serverTimestamp()
    });
  },

  // Admin: Add Need
  addNeed: async (orgId: string, need: Omit<Need, 'id' | 'orgId'>) => {
    return await addDoc(collection(db, `organizations/${orgId}/needs`), {
      ...need,
      orgId
    });
  }
};
