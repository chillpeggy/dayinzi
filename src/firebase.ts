import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";

// TODO: 用户需要在这里填入他们自己的 Firebase 配置
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Data Models
export type Product = {
    id: string; // Document ID
    qrCodeId: string; // The generated ID in the QR code e.g. ITM-123456
    style: string;
    color: string;
    size: string;
    price: number;
    stock: number;
    createdAt: number;
};

// --- Firebase Helpers ---

export const productsRef = collection(db, 'products');
export const ordersRef = collection(db, 'orders');

export const addProductToDB = async (product: Omit<Product, 'id'>) => {
    try {
        const docRef = await addDoc(productsRef, product);
        return docRef.id;
    } catch (e) {
        console.error("Error adding product: ", e);
        throw e;
    }
};

export const createOrder = async (items: any[], total: number) => {
    try {
        const order = {
            items,
            total,
            createdAt: Date.now()
        };
        await addDoc(ordersRef, order);

        // Deduct stock
        // In a real production app, this should be done via Firebase Cloud Functions or a Batch Write for atomicity
        for (const item of items) {
            if (item.firebaseId && item.stock > 0) {
                const pRef = doc(db, 'products', item.firebaseId);
                await updateDoc(pRef, { stock: item.stock - 1 });
            }
        }
    } catch (e) {
        console.error("Error creating order: ", e);
        throw e;
    }
};

// --- Cloud Print Queue ---

export const printJobsRef = collection(db, 'print_jobs');

export const addPrintJob = async (productData: any, copies: number = 1) => {
    try {
        const docRef = await addDoc(printJobsRef, {
            productData,
            copies,
            status: 'pending', // pending, printing, completed, failed
            createdAt: Date.now()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding print job: ", e);
        throw e;
    }
};
