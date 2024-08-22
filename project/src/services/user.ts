import { AlertDialog } from "tabris";
import { client } from "./connection";

export async function createUser(email: string, password: string) {
    const { data, error } = await client.auth.createUser({
        email,
        password,
    })

    AlertDialog.open(error ? 'Error creating user: ' + error.message : 'User created');

    return data;
}

export async function signIn(email: string, password: string) {
    const { user, session, error } = await client.auth.signIn({
        email,
        password,
    })

    AlertDialog.open(error ? 'Error signing in: ' + error.message : 'User signed in:' + user);

    return {
        session,
        user
    }
}

export async function signOut() {
    const { error } = await client.auth.signOut()
    AlertDialog.open(error ? 'Error signing in: ' + error.message : 'User signed out');
    return error;
}

export function authState(fn: (event: any, session: any) => any) {
    client.auth.onAuthStateChange(fn)
}

export async function deleteUser(id: string) {
    const { data, error } = await client.auth
        .deleteUser(id)
    AlertDialog.open(error ? 'Error signing in: ' + error.message : 'Usuario eliminado');
    return {
        error,
        data
    }
}

export async function updateUSer() {
    const { user } = client.auth.session()

    const { error } = await client.auth.updateUser({
        id: user.id,
        phone: '+1234567890'
    })

    if (error) console.log('Error updating phone:', error.message)
}