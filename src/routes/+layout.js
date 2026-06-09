import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

/*
Sveltekit renders the page in the server this causes some errors with native browser objects like window, document, HTMLVideoElement etc.
This line of code is to tell sveltekit to not render the page in the server and only in the client.
*/
export const ssr = false;

// Initialize Vercel Web Analytics
injectAnalytics({ mode: dev ? 'development' : 'production' });