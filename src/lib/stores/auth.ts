import { writable } from 'svelte/store';

export interface User {
	first_name: string;
	last_name: string;
	email: string;
	access_token: string | null;
	refresh_token: string | null;
    login_type: string;
}

export interface AuthState {
	user: User | null;
}

// Load saved auth state from localStorage if it exists
const stored =
	typeof localStorage !== 'undefined' ? localStorage.getItem('auth') : null;

const initialState: AuthState = stored
	? JSON.parse(stored)
	: { user: null };

export const auth = writable<AuthState>(initialState);

// Keep store synced with localStorage
auth.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('auth', JSON.stringify(value));
	}
});
