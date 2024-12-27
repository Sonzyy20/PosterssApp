import { Client, Account, Databases } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('posterss'); // Replace with your project ID

// Export the client instance
export const appwriteClient = client;

// Export the Databases and Account instances using the client
export const database = new Databases(client);
export const account = new Account(client);

// Export ID from appwrite for convenience
export { ID } from 'appwrite';