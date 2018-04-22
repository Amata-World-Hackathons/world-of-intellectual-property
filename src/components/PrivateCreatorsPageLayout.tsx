import { useEthers } from "@usedapp/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { CreatorsPageLayout } from "./CreatorsPageLayout";
import { Preloader } from "./progress/Preloader";

export const PrivateCreatorsPageLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { account } = useEthers();
  const accountRef = useRef(account);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  useEffect(() => {
    if (!mounted) return;

    if (accountRef.current) {
      setReady(true);
      return;
    }

    setTimeout(() => {
      if (!accountRef.current) {
        router.push("/creators");
      }

      setReady(true);
    }, 1000);
  }, [mounted, router]);

  return ready ? (
    <CreatorsPageLayout>
      <Head>
        <title>My Dashboard</title>
        <meta name="description" content="Create your own universe" />
      </Head>

      {children}
    </CreatorsPageLayout>
  ) : (
    <Preloader />
  );
};

export function applyPrivateCreatorsPageLayout(page: React.ReactNode) {
  return <PrivateCreatorsPageLayout>{page}</PrivateCreatorsPageLayout>;
}

export default PrivateCreatorsPageLayout;
