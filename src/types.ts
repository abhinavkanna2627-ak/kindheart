export type OrganizationType = 'old_age_home' | 'orphanage';
export type NeedCategory = 'food' | 'clothing' | 'medical' | 'education' | 'funds' | 'other';
export type NeedPriority = 'high' | 'medium' | 'low';
export type NeedStatus = 'active' | 'fulfilled';
export type DonationStatus = 'pending' | 'completed' | 'cancelled';
export type UserRole = 'donor' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string;
  photoURL: string | null;
  role: UserRole;
  createdAt: any; // Firestore Timestamp
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  description: string;
  address: string;
  contact: string;
  image_url?: string;
  verified: boolean;
  createdAt: any;
}

export interface Need {
  id: string;
  orgId: string;
  title: string;
  description?: string;
  category: NeedCategory;
  targetAmount?: number;
  currentAmount?: number;
  unit?: string;
  priority: NeedPriority;
  status: NeedStatus;
}

export interface DonationItem {
  name: string;
  quantity: number;
}

export interface Donation {
  id: string;
  donorId: string;
  orgId: string;
  needId?: string;
  amount?: number;
  items?: DonationItem[];
  status: DonationStatus;
  timestamp: any;
}
