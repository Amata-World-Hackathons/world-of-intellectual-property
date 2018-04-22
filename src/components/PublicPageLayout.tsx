import Head from "next/head";
import Link from "next/link";
import React from "react";
import AccountDropdown from "./AccountDropdown";

export const PublicPageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Head>
        <title>Creators</title>
        <meta
          name="description"
          content="Explore the tools to connect universes"
        />
      </Head>

      <header className="flex flex-row justify-between">
        <ul className="flex flex-row">
          <li className="p-4">
            <Link href="/">
              <a className="btn btn-ghost btn-sm">WIP</a>
            </Link>
          </li>

          <li className="p-4">
            <Link href="/creators">
              <a className="btn btn-ghost btn-sm">Creators</a>
            </Link>
          </li>
        </ul>

        <ul className="flex flex-row">
          <li className="p-4">
            <AccountDropdown />
          </li>
        </ul>
      </header>

      {children}
    </>
  );
};

export function applyPublicPageLayout(page: React.ReactNode) {
  return <PublicPageLayout>{page}</PublicPageLayout>;
}
