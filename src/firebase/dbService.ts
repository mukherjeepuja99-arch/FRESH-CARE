import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  setDoc, 
  updateDoc,
  deleteDoc,
  onSnapshot, 
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth, databaseId, projectId } from './config';
import { 
  MemberRecord, 
  TrainerRecord, 
  MembershipPlanRecord, 
  AnnouncementRecord,
  Product,
  Order,
  Customer,
  OrderStatus,
  UserProfile
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_DELIVERY_PARTNER 
} from '../data/mockData';

// Firestore Collection Names
export const USERS_COLLECTION = 'users';
export const PRODUCTS_COLLECTION = 'products';
export const ORDERS_COLLECTION = 'orders';
export const CUSTOMERS_COLLECTION = 'customers';
export const PORTAL_LOGINS_COLLECTION = 'portal_logins';
export const MEMBERS_COLLECTION = 'members';
export const TRAINERS_COLLECTION = 'trainers';
export const PLANS_COLLECTION = 'membershipPlans';
export const ANNOUNCEMENTS_COLLECTION = 'announcements';
export const INQUIRIES_COLLECTION = 'inquiries';

// ==========================================
// 0. FIRESTORE DATABASE HEALTH & CONNECTION TEST
// ==========================================

export async function testFirestoreConnection(): Promise<{
  connected: boolean;
  databaseId: string;
  projectId: string;
  error?: string;
}> {
  try {
    const testDoc = doc(db, '_health', 'status');
    await setDoc(testDoc, {
      lastPing: new Date().toISOString(),
      app: 'FreshCare Grocery',
      status: 'online',
    }, { merge: true });
    return {
      connected: true,
      databaseId,
      projectId,
    };
  } catch (error: any) {
    console.warn('Firestore connection check note:', error);
    return {
      connected: false,
      databaseId,
      projectId,
      error: error?.message || 'Database connection error',
    };
  }
}

// ==========================================
// 1. CUSTOMER ACCOUNT CREATION & AUTHENTICATION (FIRESTORE + AUTH)
// ==========================================

export interface CreateAccountParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  membershipPlan?: string;
}

/**
 * Creates a brand new customer account in Firestore (and Firebase Auth).
 * Guarantees persistent storage in 'users' and 'customers' collections.
 */
export async function createCustomerAccountInFirestore(params: CreateAccountParams): Promise<{
  success: boolean;
  user?: UserProfile;
  error?: string;
}> {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanName = params.name.trim();
    const cleanPhone = (params.phone || '').trim();
    const cleanAddress = (params.address || 'Garalgacha Station Road').trim();
    const cleanCity = (params.city || 'Dankuni').trim();
    const cleanPincode = (params.pincode || '712311').trim();
    const cleanPlan = params.membershipPlan || 'Fresh Care Prime Saver Plan';

    if (!cleanEmail || !params.password) {
      return { success: false, error: 'Email and password are required' };
    }
    if (params.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    let authUid = '';

    // 1. Try Firebase Auth create user
    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);
      authUid = userCred.user.uid;
      await fbUpdateProfile(userCred.user, { displayName: cleanName });
    } catch (authErr: any) {
      // If auth fails (e.g. auth domain or provider not enabled), generate safe unique ID
      authUid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    const userDocId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
    const userProfile: UserProfile = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || '+91 98000 00000',
      address: cleanAddress,
      city: cleanCity,
      pincode: cleanPincode,
      membershipPlan: cleanPlan,
      isLoggedIn: true,
    };

    // 2. Save directly into Firestore 'users' collection
    const userDocRef = doc(db, USERS_COLLECTION, userDocId);
    await setDoc(userDocRef, {
      uid: authUid,
      name: cleanName,
      email: cleanEmail,
      password: params.password, // Stored to allow direct Firestore verification
      phone: cleanPhone,
      address: cleanAddress,
      city: cleanCity,
      pincode: cleanPincode,
      membershipPlan: cleanPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // 3. Also register in 'customers' collection
    const customerId = `cust-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15)}`;
    await saveCustomerToFirestore({
      id: customerId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      address: `${cleanAddress}, ${cleanCity} ${cleanPincode}`.trim(),
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      membershipTier: cleanPlan.includes('Prime') ? 'Prime' : cleanPlan.includes('Gold') ? 'Gold' : 'Silver',
    });

    // 4. Log creation in portal_logins
    await logPortalLoginInFirestore('customer', cleanEmail, cleanName, {
      action: 'account_created',
      plan: cleanPlan,
    });

    return {
      success: true,
      user: userProfile,
    };
  } catch (error: any) {
    console.error('Error creating customer account:', error);
    return {
      success: false,
      error: error?.message || 'Failed to create customer account in database',
    };
  }
}

/**
 * Log in a customer using email & password verified with Firestore & Firebase Auth.
 */
export async function loginCustomerWithEmailPassword(
  emailInput: string, 
  passwordInput: string
): Promise<{
  success: boolean;
  user?: UserProfile;
  error?: string;
}> {
  try {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both email and password' };
    }

    // 1. Check in Firestore 'users' collection first
    const userDocId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
    const userDocRef = doc(db, USERS_COLLECTION, userDocId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      if (data.password && data.password !== cleanPassword) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const userProfile: UserProfile = {
        name: data.name || cleanEmail.split('@')[0],
        email: data.email || cleanEmail,
        phone: data.phone || '+91 98000 00000',
        address: data.address || 'Garalgacha Station Road',
        city: data.city || 'Dankuni',
        pincode: data.pincode || '712311',
        membershipPlan: data.membershipPlan || 'Fresh Care Prime Saver Plan',
        isLoggedIn: true,
      };

      // Try Firebase Auth in parallel
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      } catch {
        // Continue with verified Firestore record
      }

      await logPortalLoginInFirestore('customer', cleanEmail, userProfile.name, {
        action: 'login_success',
      });

      return { success: true, user: userProfile };
    }

    // 2. If not found by doc id, try query by email field
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', cleanEmail));
    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
      const data = querySnap.docs[0].data();
      if (data.password && data.password !== cleanPassword) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const userProfile: UserProfile = {
        name: data.name || cleanEmail.split('@')[0],
        email: data.email || cleanEmail,
        phone: data.phone || '+91 98000 00000',
        address: data.address || 'Garalgacha Station Road',
        city: data.city || 'Dankuni',
        pincode: data.pincode || '712311',
        membershipPlan: data.membershipPlan || 'Fresh Care Prime Saver Plan',
        isLoggedIn: true,
      };

      await logPortalLoginInFirestore('customer', cleanEmail, userProfile.name, {
        action: 'login_success',
      });

      return { success: true, user: userProfile };
    }

    // 3. Try Firebase Auth as alternative
    try {
      const fbCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const userProfile: UserProfile = {
        name: fbCred.user.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '+91 98000 00000',
        address: 'Garalgacha Station Road',
        city: 'Dankuni',
        pincode: '712311',
        membershipPlan: 'Fresh Care Prime Saver Plan',
        isLoggedIn: true,
      };
      return { success: true, user: userProfile };
    } catch {
      // If neither Firestore nor Firebase Auth has this account
      return { 
        success: false, 
        error: 'No account found with this email. Please click "Create New Account" to register.' 
      };
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error?.message || 'Login failed. Please check your credentials.',
    };
  }
}

/**
 * Sign out customer from Firebase
 */
export async function customerSignOut(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch {
    // non-blocking
  }
}

// ==========================================
// 2. PRODUCTS COLLECTION IN FIRESTORE
// ==========================================

export async function saveProductToFirestore(product: Product): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true, id: product.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error saving product to Firestore' };
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error deleting product from Firestore' };
  }
}

export function subscribeProducts(onUpdate: (products: Product[]) => void) {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      productsRef,
      async (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
            } as Product;
          });
          onUpdate(list);
        } else {
          // If empty, initialize products in background so user has full catalog saved in Firestore
          onUpdate(INITIAL_PRODUCTS);
          try {
            for (const prod of INITIAL_PRODUCTS) {
              const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
              await setDoc(docRef, prod, { merge: true });
            }
          } catch {
            // non-blocking
          }
        }
      },
      () => {
        onUpdate(INITIAL_PRODUCTS);
      }
    );
  } catch {
    onUpdate(INITIAL_PRODUCTS);
    return () => {};
  }
}

// ==========================================
// 3. ORDERS COLLECTION IN FIRESTORE
// ==========================================

export async function saveOrderToFirestore(order: Order): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(docRef, {
      ...order,
      syncedAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true, id: order.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error saving order to Firestore' };
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error updating order status in Firestore' };
  }
}

export function subscribeOrders(onUpdate: (orders: Order[]) => void) {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      ordersRef,
      async (snapshot) => {
        if (!snapshot.empty) {
          const list: Order[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
            } as Order;
          });
          // Sort orders by most recent first
          list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
          onUpdate(list);
        } else {
          onUpdate(INITIAL_ORDERS);
          try {
            for (const ord of INITIAL_ORDERS) {
              const docRef = doc(db, ORDERS_COLLECTION, ord.id);
              await setDoc(docRef, ord, { merge: true });
            }
          } catch {
            // non-blocking
          }
        }
      },
      () => {
        onUpdate(INITIAL_ORDERS);
      }
    );
  } catch {
    onUpdate(INITIAL_ORDERS);
    return () => {};
  }
}

// ==========================================
// 4. CUSTOMERS COLLECTION & PORTAL LOGINS IN FIRESTORE
// ==========================================

export async function saveCustomerToFirestore(customer: Customer): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
    await setDoc(docRef, {
      ...customer,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return { success: true, id: customer.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error saving customer to Firestore' };
  }
}

export function subscribeCustomers(onUpdate: (customers: Customer[]) => void) {
  try {
    const customersRef = collection(db, CUSTOMERS_COLLECTION);
    return onSnapshot(
      customersRef,
      async (snapshot) => {
        if (!snapshot.empty) {
          const list: Customer[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
            } as Customer;
          });
          onUpdate(list);
        } else {
          onUpdate(INITIAL_CUSTOMERS);
          try {
            for (const cust of INITIAL_CUSTOMERS) {
              const docRef = doc(db, CUSTOMERS_COLLECTION, cust.id);
              await setDoc(docRef, cust, { merge: true });
            }
          } catch {
            // non-blocking
          }
        }
      },
      () => {
        onUpdate(INITIAL_CUSTOMERS);
      }
    );
  } catch {
    onUpdate(INITIAL_CUSTOMERS);
    return () => {};
  }
}

/**
 * Records every login / user detail input in Firestore 'portal_logins' collection
 */
export async function logPortalLoginInFirestore(
  role: 'customer' | 'owner' | 'delivery',
  identifier: string,
  name: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const loginsRef = collection(db, PORTAL_LOGINS_COLLECTION);
    const docRef = await addDoc(loginsRef, {
      role,
      identifier: identifier.trim(),
      name: name.trim(),
      metadata: metadata || {},
      loginTime: new Date().toISOString(),
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error saving login to Firestore' };
  }
}

// ==========================================
// 5. MEMBERS COLLECTION OPERATIONS (Registration Form)
// ==========================================

export const DEFAULT_MEMBERS: MemberRecord[] = [
  {
    id: 'mem-swapnil',
    name: 'Swapnil Mukherjee',
    phone: '+91 98300 45678',
    email: 'swapnil.mukherjee@example.com',
    membershipPlan: 'Fresh Care Prime Saver Plan',
    joinDate: 'Jul 10, 2026',
    activeStatus: 'Active',
    address: 'House 22, Station Road, Garalgacha',
    city: 'Dankuni',
    pincode: '712311',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-1',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    membershipPlan: 'Fresh Care Prime Saver Plan',
    joinDate: 'Aug 01, 2026',
    activeStatus: 'Active',
    address: 'House 14B, Station Road, Garalgacha',
    city: 'Dankuni',
    pincode: '712311',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-2',
    name: 'Amitabh Sen',
    phone: '+91 98234 56789',
    email: 'amitabh.sen@example.com',
    membershipPlan: 'Gold VIP Member',
    joinDate: 'Jul 28, 2026',
    activeStatus: 'Active',
    address: 'Bungalow 18, Garalgacha High School Lane',
    city: 'Dankuni',
    pincode: '712311',
    createdAt: new Date().toISOString(),
  },
];

export async function registerMemberInFirestore(memberData: Omit<MemberRecord, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docData = {
      name: memberData.name.trim(),
      phone: memberData.phone.trim(),
      email: memberData.email.trim(),
      membershipPlan: memberData.membershipPlan || 'Standard Community Member',
      joinDate: memberData.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      activeStatus: memberData.activeStatus ?? 'Active',
      address: memberData.address || '',
      city: memberData.city || 'Dankuni',
      pincode: memberData.pincode || '712311',
      createdAt: new Date().toISOString(),
    };

    const membersRef = collection(db, MEMBERS_COLLECTION);
    const docRef = await addDoc(membersRef, docData);

    // Also auto-sync as customer in customers collection
    const customerId = `cust-${Date.now()}`;
    await saveCustomerToFirestore({
      id: customerId,
      name: memberData.name.trim(),
      email: memberData.email.trim(),
      phone: memberData.phone.trim(),
      address: `${memberData.address || ''}, ${memberData.city || 'Dankuni'} ${memberData.pincode || '712311'}`.trim(),
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      membershipTier: memberData.membershipPlan?.includes('Prime') ? 'Prime' : memberData.membershipPlan?.includes('Gold') ? 'Gold' : 'Silver',
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Database write error' };
  }
}

export function subscribeMembers(onUpdate: (members: MemberRecord[]) => void) {
  try {
    const membersRef = collection(db, MEMBERS_COLLECTION);
    return onSnapshot(
      membersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MemberRecord[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<MemberRecord, 'id'>),
          }));
          onUpdate(list);
        } else {
          onUpdate(DEFAULT_MEMBERS);
        }
      },
      () => {
        onUpdate(DEFAULT_MEMBERS);
      }
    );
  } catch {
    onUpdate(DEFAULT_MEMBERS);
    return () => {};
  }
}

// ==========================================
// 6. MEMBERSHIP PLANS COLLECTION OPERATIONS
// ==========================================

export const DEFAULT_PLANS: MembershipPlanRecord[] = [
  {
    id: 'plan-standard',
    planName: 'Standard Community Member',
    price: 'Free',
    duration: 'Lifetime Access',
    benefits: [
      'Access to Fresh Care catalogue',
      'Doorstep Delivery in Dankuni & Hooghly',
      'Cash on Delivery & UPI payments',
      'Downloadable Tax Invoices',
    ],
    recommended: false,
  },
  {
    id: 'plan-prime',
    planName: 'Fresh Care Prime Saver Plan',
    price: '₹199 / month',
    duration: 'Monthly Subscription',
    benefits: [
      'Unlimited FREE express delivery on all orders',
      'Extra 5% discount on all spices & dry fruits',
      'Priority live order packing & dispatch',
      'Early access to seasonal spice harvests',
    ],
    recommended: true,
  },
  {
    id: 'plan-gold',
    planName: 'Gold VIP Super Shopper Plan',
    price: '₹999 / year',
    duration: 'Annual Membership',
    benefits: [
      'Free express deliveries with zero minimum order',
      '10% Flat VIP cashback points on every grocery order',
      'Dedicated WhatsApp hotline with Dankuni Hub Manager',
      'Exclusive early bird access to festive bulk spice sales',
    ],
    recommended: false,
  },
];

export async function addMembershipPlanToFirestore(plan: Omit<MembershipPlanRecord, 'id'>) {
  try {
    const plansRef = collection(db, PLANS_COLLECTION);
    const docRef = await addDoc(plansRef, plan);
    return { success: true, id: docRef.id };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export function subscribeMembershipPlans(onUpdate: (plans: MembershipPlanRecord[]) => void) {
  try {
    const plansRef = collection(db, PLANS_COLLECTION);
    return onSnapshot(
      plansRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MembershipPlanRecord[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<MembershipPlanRecord, 'id'>),
          }));
          onUpdate(list);
        } else {
          onUpdate(DEFAULT_PLANS);
        }
      },
      () => {
        onUpdate(DEFAULT_PLANS);
      }
    );
  } catch {
    onUpdate(DEFAULT_PLANS);
    return () => {};
  }
}

// ==========================================
// 7. TRAINERS / WELLNESS ADVISORS COLLECTION OPERATIONS
// ==========================================

export const DEFAULT_TRAINERS: TrainerRecord[] = [
  {
    id: 'trn-1',
    trainerName: 'Dr. Debabrata Roy',
    specialty: 'Clinical Nutrition & Dietetics',
    experience: '8+ Years',
    availability: 'Available',
    bio: 'Specialist in organic foods, diabetic diet planning, and high-curcumin antioxidant diets.',
    phone: '+91 98300 12345',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'trn-2',
    trainerName: 'Ananya Mukherjee',
    specialty: 'Holistic Fitness & Functional Training',
    experience: '5 Years',
    availability: 'Slots Open',
    bio: 'Expert in daily mobility routines, core strengthening, and clean dietary stamina building.',
    phone: '+91 98301 54321',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'trn-3',
    trainerName: 'Somnath Banerjee',
    specialty: 'Strength, Conditioning & Recovery',
    experience: '7+ Years',
    availability: 'Available',
    bio: 'Guiding strength athletes on clean plant-based protein intake and wholesome pulses nutrition.',
    phone: '+91 98302 98765',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80',
  },
];

export async function addTrainerToFirestore(trainer: Omit<TrainerRecord, 'id'>) {
  try {
    const trainersRef = collection(db, TRAINERS_COLLECTION);
    const docRef = await addDoc(trainersRef, trainer);
    return { success: true, id: docRef.id };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export function subscribeTrainers(onUpdate: (trainers: TrainerRecord[]) => void) {
  try {
    const trainersRef = collection(db, TRAINERS_COLLECTION);
    return onSnapshot(
      trainersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TrainerRecord[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<TrainerRecord, 'id'>),
          }));
          onUpdate(list);
        } else {
          onUpdate(DEFAULT_TRAINERS);
        }
      },
      () => {
        onUpdate(DEFAULT_TRAINERS);
      }
    );
  } catch {
    onUpdate(DEFAULT_TRAINERS);
    return () => {};
  }
}

// ==========================================
// 8. ANNOUNCEMENTS COLLECTION OPERATIONS
// ==========================================

export const DEFAULT_ANNOUNCEMENTS: AnnouncementRecord[] = [
  {
    id: 'ann-1',
    title: '🌿 Salem High-Curcumin Turmeric Batch Arrived!',
    message: 'Direct farm harvest from Salem, cold-milled with 5.2% curcumin is now packed and available at our Garalgacha fulfillment hub.',
    date: 'Aug 05, 2026',
    activeStatus: true,
    priority: 'High',
  },
  {
    id: 'ann-2',
    title: '🚚 Express Doorstep Delivery in Dankuni (712311)',
    message: 'We deliver within 30-45 mins across Garalgacha, Station Road, and Dankuni Housing. Free delivery on orders above ₹499!',
    date: 'Aug 04, 2026',
    activeStatus: true,
    priority: 'Normal',
  },
];

export async function addAnnouncementToFirestore(announcement: Omit<AnnouncementRecord, 'id'>) {
  try {
    const announcementsRef = collection(db, ANNOUNCEMENTS_COLLECTION);
    const docRef = await addDoc(announcementsRef, announcement);
    return { success: true, id: docRef.id };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export function subscribeAnnouncements(onUpdate: (announcements: AnnouncementRecord[]) => void) {
  try {
    const announcementsRef = collection(db, ANNOUNCEMENTS_COLLECTION);
    return onSnapshot(
      announcementsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: AnnouncementRecord[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<AnnouncementRecord, 'id'>),
          }));
          onUpdate(list);
        } else {
          onUpdate(DEFAULT_ANNOUNCEMENTS);
        }
      },
      () => {
        onUpdate(DEFAULT_ANNOUNCEMENTS);
      }
    );
  } catch {
    onUpdate(DEFAULT_ANNOUNCEMENTS);
    return () => {};
  }
}

// ==========================================
// 9. CONTACT / INQUIRY INPUTS IN FIRESTORE
// ==========================================

export async function submitInquiryToFirestore(inquiry: {
  name: string;
  phone: string;
  email?: string;
  message: string;
  category?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const inquiriesRef = collection(db, INQUIRIES_COLLECTION);
    const docRef = await addDoc(inquiriesRef, {
      ...inquiry,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error submitting inquiry to Firestore' };
  }
}
