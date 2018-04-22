import "../globals.css";
import type { AppProps } from "next/app";
import { AppPage } from "../types";
import { Config, DAppProvider, ThetaTestnet } from "@usedapp/core";
import * as thetajs from "@thetalabs/theta-js";
import React from "react";

console.log("THETA", thetajs);

const DAPP_CONFIG: Config = {
  autoConnect: true,
  networks: [ThetaTestnet],
};

function MyApp({ Component, pageProps }: AppProps) {
  const applyLayout = (Component as AppPage).applyLayout;

  return (
    <React.StrictMode>
      <DAppProvider config={DAPP_CONFIG}>
        {applyLayout(<Component {...pageProps} />)}
      </DAppProvider>
    </React.StrictMode>
  );
}

export default MyApp;
