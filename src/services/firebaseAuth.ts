/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import { ManagerUser } from '../types';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const FIREBASE_CONFIG_STORAGE_KEY = 'mealmind_firebase_config';
const LOCAL_USERS_STORAGE_KEY = 'mealmind_local_users';
const CURRENT_USER_STORAGE_KEY = 'mealmind_current_user';

// Built-in starter accounts for immediate hotel operations preview
export const DEMO_CREDENTIALS = {
  email: 'chef@grandhorizon.com',
  password: 'Password123!',
  managerName: 'Chef Vikram Raman',
  hotelName: 'The Grand Horizon Hotel & Luxury Suites',
  phone: '+91 98401 23456',
};

// Check if environment or saved storage has Firebase configuration
export function getStoredFirebaseConfig(): FirebaseClientConfig | null {
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }

  // Check Vite environment variables
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  return null;
}

export function isFirebaseConfigured(): boolean {
  const config = getStoredFirebaseConfig();
  return !!(config && config.apiKey && config.projectId && !config.apiKey.includes('YOUR_'));
}

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  try {
    if (!cachedAuth) {
      const config = getStoredFirebaseConfig()!;
      cachedApp = getApps().length > 0 ? getApp() : initializeApp(config);
      cachedAuth = getAuth(cachedApp);
    }
    return cachedAuth;
  } catch (err) {
    console.warn('Could not initialize Firebase Auth instance:', err);
    return null;
  }
}

export function saveFirebaseConfig(config: FirebaseClientConfig) {
  localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  cachedApp = null;
  cachedAuth = null;
}

export function clearFirebaseConfig() {
  localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  cachedApp = null;
  cachedAuth = null;
}

interface StoredAccount {
  id: string;
  name: string;
  hotelName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: ManagerUser['role'];
  createdAt: string;
}

function getLocalAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_STORAGE_KEY);
    if (!raw) {
      // Initialize with demo manager
      const seed: StoredAccount[] = [
        {
          id: 'mgr-horizon-001',
          name: DEMO_CREDENTIALS.managerName,
          hotelName: DEMO_CREDENTIALS.hotelName,
          email: DEMO_CREDENTIALS.email.toLowerCase(),
          phone: DEMO_CREDENTIALS.phone,
          passwordHash: btoa(DEMO_CREDENTIALS.password),
          role: 'Executive Chef',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalAccount(account: StoredAccount) {
  const accounts = getLocalAccounts();
  const filtered = accounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
  filtered.push(account);
  localStorage.setItem(LOCAL_USERS_STORAGE_KEY, JSON.stringify(filtered));
}

export function getStoredSession(): ManagerUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(user: ManagerUser | null) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export interface SignUpParams {
  managerName: string;
  hotelName: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * Sign up a new hotel / restaurant manager.
 * Uses Firebase Authentication if configured, or transparent validated local storage.
 */
export async function registerManager(params: SignUpParams): Promise<ManagerUser> {
  const auth = getFirebaseAuth();
  const normalizedEmail = params.email.trim().toLowerCase();

  if (auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, params.password);
      const fbUser = userCredential.user;

      if (params.managerName) {
        await updateProfile(fbUser, {
          displayName: params.managerName.trim(),
        });
      }

      const managerUser: ManagerUser = {
        id: fbUser.uid,
        name: params.managerName.trim(),
        email: normalizedEmail,
        phone: params.phone.trim(),
        hotelName: params.hotelName.trim(),
        propertyName: params.hotelName.trim(),
        propertyLocation: 'Hospitality Center',
        role: 'Executive Chef',
        authProvider: 'firebase',
      };

      // Also persist profile metadata locally for instant retrieval
      saveLocalAccount({
        id: fbUser.uid,
        name: params.managerName.trim(),
        hotelName: params.hotelName.trim(),
        email: normalizedEmail,
        phone: params.phone.trim(),
        passwordHash: 'FIREBASE_AUTH_MANAGED',
        role: 'Executive Chef',
        createdAt: new Date().toISOString(),
      });

      setStoredSession(managerUser);
      return managerUser;
    } catch (err: any) {
      throw formatFirebaseError(err);
    }
  }

  // Fallback when Firebase configuration is pending:
  const accounts = getLocalAccounts();
  const existing = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const newId = `mgr-${Date.now()}`;
  const newAccount: StoredAccount = {
    id: newId,
    name: params.managerName.trim(),
    hotelName: params.hotelName.trim(),
    email: normalizedEmail,
    phone: params.phone.trim(),
    passwordHash: btoa(params.password),
    role: 'Executive Chef',
    createdAt: new Date().toISOString(),
  };

  saveLocalAccount(newAccount);

  const managerUser: ManagerUser = {
    id: newId,
    name: newAccount.name,
    email: newAccount.email,
    phone: newAccount.phone,
    hotelName: newAccount.hotelName,
    propertyName: newAccount.hotelName,
    propertyLocation: 'Hospitality Center',
    role: newAccount.role,
    authProvider: 'local_vault',
  };

  setStoredSession(managerUser);
  return managerUser;
}

/**
 * Sign in an existing manager using email + password.
 */
export async function loginManager(email: string, password: string): Promise<ManagerUser> {
  const auth = getFirebaseAuth();
  const normalizedEmail = email.trim().toLowerCase();

  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const fbUser = userCredential.user;

      // Find locally associated property metadata if present
      const accounts = getLocalAccounts();
      const match = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

      const managerUser: ManagerUser = {
        id: fbUser.uid,
        name: fbUser.displayName || match?.name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        phone: match?.phone || '',
        hotelName: match?.hotelName || 'The Grand Horizon Hotel',
        propertyName: match?.hotelName || 'The Grand Horizon Hotel',
        propertyLocation: 'Hospitality Center',
        role: match?.role || 'Executive Chef',
        authProvider: 'firebase',
      };

      setStoredSession(managerUser);
      return managerUser;
    } catch (err: any) {
      throw formatFirebaseError(err);
    }
  }

  // Local storage check
  const accounts = getLocalAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

  if (!account) {
    throw new Error('No hotel manager account found with this email. Please check your email or create an account.');
  }

  if (account.passwordHash !== btoa(password)) {
    throw new Error('Incorrect password. Please verify your credentials and try again.');
  }

  const managerUser: ManagerUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    hotelName: account.hotelName,
    propertyName: account.hotelName,
    propertyLocation: 'Hospitality Center',
    role: account.role,
    authProvider: 'local_vault',
  };

  setStoredSession(managerUser);
  return managerUser;
}

/**
 * Sign out current manager.
 */
export async function logoutManager(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await signOut(auth);
    } catch {
      // Ignore signout network errors
    }
  }
  setStoredSession(null);
}

function formatFirebaseError(err: any): Error {
  const code = err?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return new Error('The email address is formatted incorrectly.');
    case 'auth/user-disabled':
      return new Error('This account has been disabled. Please contact your property administrator.');
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return new Error('Invalid email or password. Please verify your credentials and try again.');
    case 'auth/email-already-in-use':
      return new Error('An account with this email address already exists. Please sign in instead.');
    case 'auth/weak-password':
      return new Error('Password must be at least 6 characters long.');
    case 'auth/operation-not-allowed':
      return new Error(
        'Email/Password sign-in is not enabled in your Firebase project. Please enable it in Firebase Console -> Authentication -> Sign-in method.'
      );
    case 'auth/too-many-requests':
      return new Error('Access temporarily blocked due to multiple failed login attempts. Please try again later.');
    case 'auth/network-request-failed':
      return new Error('Network connection error. Please check your internet connection.');
    default:
      return new Error(err?.message || 'Authentication failed. Please check your details.');
  }
}
