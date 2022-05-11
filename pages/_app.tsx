import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ConvexProvider, ConvexReactClient } from "convex-dev/react"
import convexConfig from "../convex.json"
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useConvex, useMutation } from '../convex/_generated';
import { Id } from 'convex-dev/values';

const convex = new ConvexReactClient(convexConfig.origin);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain={convexConfig.authInfo[0].domain}
      clientId={convexConfig.authInfo[0].applicationID}
      redirectUri={typeof window === "undefined" ? "" : window.location.origin}
      cacheLocation="localstorage"
    >
      <ConvexProvider client={convex}>
        <LoginLogout />
        <Component {...pageProps} />
      </ConvexProvider>
    </Auth0Provider>
  )
}

function LoginLogout() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user, getIdTokenClaims } =
    useAuth0();

  const [userId, setUserId] = useState<Id | null>(null);
  const convex = useConvex();
  const storeUser = useMutation("storeUser");
  // Pass the ID token to the Convex client when logged in, and clear it when logged out.
  // After setting the ID token, call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      getIdTokenClaims().then(async claims => {
        // Get the raw ID token from the claims.
        const token = claims!.__raw;
        // Pass it to the Convex client.
        convex.setAuth(token);
        // Store the user in the database.
        // Recall that `storeUser` gets the user information via the `auth`
        // object on the server. You don't need to pass anything manually here.
        const id = await storeUser();
        setUserId(id);
      });
    } else {
      // Tell the Convex client to clear all authentication state.
      convex.clearAuth();
      setUserId(null);
    }
  }, [isAuthenticated, isLoading, getIdTokenClaims, convex, storeUser]);

  if (isLoading) {
    return <button className="btn btn-primary">Loading...</button>;
  }
  if (isAuthenticated) {
    return (
      <div>
        {/* We know that Auth0 provides the user's name, but another provider
        might not. */}
        <p>Logged in as {user!.name}</p>
        <button
          className="btn btn-primary"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log out
        </button>
      </div>
    );
  } else {
    return (
      <button className="btn btn-primary" onClick={loginWithRedirect}>
        Log in
      </button>
    );
  }
}

export default MyApp
