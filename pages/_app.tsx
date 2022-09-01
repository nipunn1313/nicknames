import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import convexConfig from "../convex.json"
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useConvex, useMutation } from '../convex/_generated/react';
import { Id } from '../convex/_generated/dataModel';

import clientConfig from '../convex/_generated/clientConfig';
const convex = new ConvexReactClient(clientConfig);
const authInfo = convexConfig.authInfo[0];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain={convexConfig.authInfo[0].domain}
      clientId={convexConfig.authInfo[0].applicationID}
      redirectUri={typeof window === "undefined" ? "" : window.location.origin}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex} authInfo={authInfo} loggedOut={<Login />}>
				<Logout />
        <Component {...pageProps} />
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  )
}

function Login() {
  const { isLoading, loginWithRedirect } = useAuth0();
  if (isLoading) {
    return <button className="btn btn-primary">Loading...</button>;
  }
  return (
    <main className="py-4">
      <h1 className="text-center">Nonsense Nicknames</h1>
      <div className="text-center">
        <span>
          <button className="btn btn-primary" onClick={loginWithRedirect}>
            Log in
          </button>
        </span>
      </div>
    </main>
  );
}

function Logout() {
	const [userId, setUserId] = useState<Id<"users"> | null>(null);
	const storeUser = useMutation("storeUser");
	// Call the `storeUser` mutation function to store
	// the current user in the `users` table and return the `Id` value.
	useEffect(() => {
		// Store the user in the database.
		// Recall that `storeUser` gets the user information via the `auth`
		// object on the server. You don't need to pass anything manually here.
		async function createUser() {
			const id = await storeUser();
			setUserId(id);
		}
		createUser();
		return () => setUserId(null);
	}, [storeUser]);

  const { logout, user } = useAuth0();
  return (
    <div>
      {/* We know this component only renders if the user is logged in. */}
      <p>Logged in{user!.name ? ` as ${user!.name}` : ""}</p>
      <button
        className="btn btn-primary"
        onClick={() => logout({ returnTo: window.location.origin })}
      >
        Log out
      </button>
    </div>
  );
}

/*
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
        {
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
*/

export default MyApp
