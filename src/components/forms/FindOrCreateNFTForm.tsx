import { useEthers } from "@usedapp/core";
import classNames from "classnames";
import Link from "next/link";
import { useForm, useFormState } from "react-hook-form";

import WIPNFT_ABI from "@src/abi/WIPNFT.abi.json";
import WIPNFT_BYTECODE from "@src/abi/WIPNFT.bytecode.json";
import { Contract, ContractFactory } from "ethers";

export interface NFTResult {
  imageUrl: string;
  ownerAddress: string;
  contract: Contract;
}

export interface FindOrCreateNFTFormProps {
  onNFTResult: (result: NFTResult) => void;
}

export const FindOrCreateNFTForm: React.FC<FindOrCreateNFTFormProps> = ({
  onNFTResult,
}) => {
  const { account, library } = useEthers();
  const {
    control,
    watch,
    register,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = useForm();

  const imageUrl = watch("imageUrl");

  const imageUrlState = useFormState({
    name: "imageUrl",
    control,
  });

  const isFormValid = !(
    !imageUrlState.isDirty ||
    !imageUrlState.isValid ||
    imageUrlState.isValidating
  );

  return (
    <form
      className="flex flex-col items-center p-8"
      onSubmit={handleSubmit(async (data) => {
        console.log("SUBMIT DATA", data);

        const factory = new ContractFactory(
          WIPNFT_ABI,
          WIPNFT_BYTECODE,
          library?.getSigner()
        );

        const contract = await factory.deploy(
          "DefaultWIPNFT",
          "WIP",
          data.imageUrl
        );

        onNFTResult({ imageUrl, ownerAddress: account!, contract });
      })}
    >
      <div className="mt-12 w-full max-w-xl p-4 prose dark:prose-invert">
        <h2>Step 1: Mint an NFT</h2>
      </div>

      <section className="w-full max-w-xl p-8 border border-cyan-500 rounded-lg">
        <div className="form-control">
          <label htmlFor="" className="label">
            <span className="label-text">Link to image</span>
          </label>

          <input
            type="text"
            className={classNames("input input-bordered", {
              "input-bordered input-error":
                imageUrlState.isDirty && !imageUrlState.isValid,
            })}
            {...register("imageUrl", {
              validate: {
                required: (v) => !!v,
                addressFormat: (v) => /(https?:\/\/.*)/i.test(v),
              },
              onChange: () => trigger(["imageUrl"]),
            })}
          />

          <label htmlFor="" className="label">
            <span
              className={classNames("label-text", {
                "text-red-500": imageUrlState.isDirty && !imageUrlState.isValid,
              })}
            >
              {!imageUrlState.isDirty || imageUrlState.isValid
                ? "You must own this image"
                : `errors: ${imageUrlState.errors.required}`}
            </span>
          </label>
        </div>

        {/* <div className="form-control">
          <label htmlFor="" className="label">
            <span className="label-text">The address of the (TNT721) NFT</span>
          </label>

          <label htmlFor="" className="input-group flex flex-row">
            <span className="grow-0">NFT Address</span>
            <input
              type="text"
              className={classNames("input input-bordered flex-1", {
                "input-bordered input-error":
                  contractAddressState.isDirty &&
                  !contractAddressState.isValidating &&
                  !contractAddressState.isValid,
              })}
              {...register("contractAddress", {
                validate: {
                  required: (v) => !!v,
                  addressFormat: (v) => /^0x[0-9a-f]+$/i.test(v),
                  checkSupportedInterfaces: async (v) => {
                    if (!v) {
                      return false;
                    }

                    const contract = new Contract(v, TNT_CONTRACT_ABI, library);

                    try {
                      const res = contract.supportsInterface(INTERFACE_TNT721);
                      console.log("RES", res);
                      console.log("URI", await contract.tokenURI(0));
                      return await res;
                    } catch (e) {
                      console.error(e);
                      return false;
                    }
                  },
                },
                onChange: () => trigger(["contractAddress"]),
              })}
            />
          </label>

          <label htmlFor="" className="label">
            <span
              className={classNames("label-text", {
                "text-green-600": isFormValid,
              })}
            >
              {isFormValid
                ? "NFT can be safely imported"
                : "Enter a valid NFT address to begin"}
            </span>
          </label>
        </div> */}
      </section>

      <div
        className={classNames("mt-8 flex flex-col items-center max-w-xl", {
          hidden: !imageUrlState.isDirty,
        })}
      >
        <img src={imageUrl} alt="image preview" />

        <div className="mt-2 alert alert-warning shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm">
              WIP will add this to your default WIP collection or mint it if it
              doesn&apos;t yet exist
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-end items-center mt-8 w-full max-w-xl">
        <Link href="/creators/dashboard">
          <a className="btn btn-ghost">Return to dashboard</a>
        </Link>

        <button
          type="submit"
          className={classNames("ml-4 btn btn-primary", {
            "btn-disabled": !isFormValid,
            loading: isSubmitting,
          })}
        >
          Mint NFT
        </button>
      </div>
    </form>
  );
};

export default FindOrCreateNFTForm;
