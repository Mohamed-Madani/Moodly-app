'use client'

import React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'



const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // State to manage the current user, user data object, and loading state
    const [currentUser, setCurrentUser] = useState(null)
    const [userDataObj, setUserDataObj] = useState(null)
    const [loading, setLoading] = useState(true)

    // Function to handle user signup
    function signup(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // Function to handle user login
    function login(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    // Function to handle user logout
    function logout() {
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    // Effect to listen for authentication state changes and fetch user data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                setLoading(true) // Set loading to true while fetching user data
                setCurrentUser(user) // Update the current user state

                if (!user) {
                    console.log('No user found') // Log if no user is found
                    return
                }

                console.log('Fetching User Data') // Log when fetching user data
                const docRef = doc(db, 'users', user.uid) // Reference to the user document in Firestore
                const docSnap = await getDoc(docRef) // Fetch the user document
                let firebaseData = {}
                if (docSnap.exists()) {
                    console.log('Found User Data') // Log if user data is found
                    firebaseData = docSnap.data() // Extract user data from the document
                    console.log(firebaseData) // Log the user data
                }
                setUserDataObj(firebaseData) // Update the user data object state

            } catch (error) {
                console.log(error) // Log any errors that occur
            } finally {
                setLoading(false) // Set loading to false after fetching user data
            }
        })

    }, [])

    // Value object to be passed to the context provider
    const value = {
        currentUser,
        userDataObj,
        setUserDataObj,
        signup,
        logout,
        login,
        loading,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}