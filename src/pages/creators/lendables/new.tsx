import { applyPrivateCreatorsPageLayout } from "@src/components/PrivateCreatorsPageLayout";
import { AppPage } from "@src/types";
import { Contract } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import FindOrCreateNFTForm, {
  NFTResult,
} from "@src/components/forms/FindOrCreateNFTForm";
import LendableFromNFTForm from "@src/components/forms/LendableFromNFTForm";
import { useRouter } from "next/router";

const INTERFACE_TNT721 = 0x80ac58cd;
// const INTERFACE_TNT721_METADATA = 0x5b5e139f;
// const INTERFACE_TNT721_ENUMERABLE = 0x780e9d63;

function useContract(
  address: string,
  abi: Record<string, unknown>[],
  provider: JsonRpcProvider
) {
  return useMemo(
    () => (address ? new Contract(address, abi, provider) : null),
    [address, abi, provider]
  );
}

function useCall(contract: Contract | null, method: string, args: unknown[]) {
  const [result, setResult] = useState<{ data?: any; error?: string }>({
    error: "not defined",
  });

  useEffect(() => {
    if (!contract) {
      setResult({ error: "not defined" });
      return;
    }

    contract[method](...args).then(
      (data: any) => {
        setResult({ data });
      },
      (err: Error) => setResult({ error: String(err) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, method, JSON.stringify(args)]);

  return result;
}

export const NewLendablePage: AppPage = () => {
  const router = useRouter();
  const [nftResult, setNFTResult] = useState<NFTResult | null>(null);

  return (
    <div className="flex flex-col items-center p-8">
      {nftResult ? (
        <LendableFromNFTForm
          nft={nftResult}
          onRequestChangeNFT={() => setNFTResult(null)}
          onLendableCreated={(lendableId) =>
            router.push(`/creators/marketplace/`)
          }
        />
      ) : (
        <FindOrCreateNFTForm onNFTResult={setNFTResult} />
      )}
    </div>
  );
};

NewLendablePage.applyLayout = applyPrivateCreatorsPageLayout;

export default NewLendablePage;
