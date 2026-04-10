// File: src/types/auth.types.ts

// What we send to the API when registering
export type RegisterRequest = {
    userName: string
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber?: string    // optional — the ? means it can be skipped
}

// What we send to the API when logging in
export type LoginRequest = {
    email: string
    password: string
}

// What the API sends back after login or register
export type AuthResponse = {
    token: string
    userId: number
    userName: string
    email: string
    role: string
    expiresAt: string
}

// The logged in user stored in our app state
export type AuthUser = {
    userId: number
    userName: string
    email: string
    role: string
    token: string
    expiresAt: string
}