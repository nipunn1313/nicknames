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

export default MyApp
