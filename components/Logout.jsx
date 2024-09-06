'use client'
import React from 'react'
import Button from './LandingPage/Button'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Logout() {
    // Extracting logout function and current user from the AuthContext
    const { logout, currentUser } = useAuth()
    // Using usePathname hook to get the current pathname
    const pathname = usePathname()

    // If there is no current user, return null
    if (!currentUser) {
        return null
    }

    // If the current pathname is the root, redirect to the dashboard
    if (pathname === '/') {
        return (
            <Link href={'/dashboard'}>
                <Button text="Go to dashboard" />
            </Link>
        )
    }

    return (
        <Button text='Logout' clickHandler={logout} />
    )
}