import { NextPage } from "next";
import React from "react";

export type AppPage = NextPage & {
  applyLayout: (page: React.ReactNode) => React.ReactNode;
};
