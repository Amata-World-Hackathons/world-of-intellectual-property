import { useEthers } from "@usedapp/core";
import classNames from "classnames";
import Link from "next/link";
import CreatorsConnectButton from "./CreatorsConnectButton";

export const AccountDropdown: React.FC<
  React.HTMLAttributes<HTMLLabelElement>
> = ({ className, ...rest }) => {
  const { account, deactivate } = useEthers();

  return account ? (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        {...rest}
        className={classNames("btn btn-sm normal-case", className)}
      >
        {account.slice(0, 9)}...
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu shadow shadow-blue-500/50 rounded-box bg-gray-700 w-52"
      >
        <li>
          <Link href="/creators/dashboard">
            <a>Dashboard</a>
          </Link>
        </li>

        <li className="divider"></li>

        <li>
          <button onClick={() => deactivate()}>Disconnect</button>
        </li>
      </ul>
    </div>
  ) : (
    <CreatorsConnectButton className="btn-sm">Dashboard</CreatorsConnectButton>
  );
};

export default AccountDropdown;
