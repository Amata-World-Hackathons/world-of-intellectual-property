import { useEthers } from "@usedapp/core";
import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";

export const CreatorsConnectButton: React.FC<
  React.HTMLAttributes<HTMLButtonElement>
> = ({ className, children, onClick, ...rest }) => {
  const router = useRouter();
  const { activateBrowserWallet, account } = useEthers();

  return (
    <button
      {...rest}
      className={classNames("btn btn-primary", className)}
      onClick={() => {
        if (account) {
          router.push("/creators/dashboard");
        } else {
          activateBrowserWallet();
        }
      }}
    >
      {account ? children || "Go to dashboard" : "Connect to wallet"}
    </button>
  );
};

export default CreatorsConnectButton;
