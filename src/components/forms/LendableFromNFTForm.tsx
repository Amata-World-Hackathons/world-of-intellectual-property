import { useFirestore } from "@src/contexts/Firebase";
import { useEthers } from "@usedapp/core";
import classNames from "classnames";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { WithContext as ReactTags } from "react-tag-input";
import { useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { NFTResult } from "./FindOrCreateNFTForm";

import LENDABLE_ABI from "@src/abi/Lendable.abi.json";
import LENDABLE_BYTECODE from "@src/abi/Lendable.bytecode.json";
import { ContractFactory } from "ethers";

export interface LendableFromNFTFormProps {
  nft: NFTResult;
  onRequestChangeNFT: () => void;
  onLendableCreated: (lendableId: string) => void;
}

const ALL_SUGGESTIONS = [
  { id: "film", text: "film" },
  { id: "history", text: "history" },
  { id: "culture", text: "culture" },
  { id: "comics", text: "comics" },
  { id: "gaming", text: "gaming" },
  { id: "fantasy", text: "fantasy" },
];

export const LendableFromNFTForm: React.FC<LendableFromNFTFormProps> = ({
  nft,
  onRequestChangeNFT,
  onLendableCreated,
}) => {
  const db = useFirestore();
  const { account, library } = useEthers();
  const { watch, register, handleSubmit, trigger, formState } = useForm({
    mode: "all",
  });

  const [formErrors, setFormErrors] = useState<{
    atLeastOneMonetization?: boolean;
  }>({});

  const [tags, setTags] = useState<{ id: string; text: string }[]>([]);

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: { id: string; text: string }) => {
    setTags([...tags, tag]);
  };

  const useOneTimeFee = watch("useOneTimeFee");
  const useCommissions = watch("useCommissions");

  return (
    <form
      className="flex flex-col items-center p-8"
      onSubmit={handleSubmit(async (data) => {
        if (!data.useCommissions && !data.useOneTimeFee) {
          setFormErrors({ atLeastOneMonetization: true });
          return;
        }

        const factory = new ContractFactory(
          LENDABLE_ABI,
          LENDABLE_BYTECODE,
          library?.getSigner()
        );

        const contract = await factory.deploy(nft.contract.address, 0, {
          useOneTimeFee: data.useOneTimeFee,
          useCommissions: data.useCommissions,
          requireAttribution: data.requireAttribution,
          oneTimeFee: data.oneTimeFee || 0,
          commission: data.commission || 0,
        });

        const doc = await addDoc(collection(db, "lendables"), {
          nft: {
            imageUrl: nft.imageUrl,
            ownerAddress: nft.ownerAddress,
          },
          tags: tags.map((tag) => tag.text),
          location: data.location,
          description: data.description,
          displayName: data.displayName,
          ownerAddress: account,
          contractAddress: contract.address,
          monetization: [
            ...(data.useOneTimeFee
              ? [
                  {
                    option: "one-time-fee",
                    value: data.oneTimeFee,
                  },
                ]
              : []),
            ...(data.useCommissions
              ? [
                  {
                    option: "commissions",
                    value: data.commission,
                  },
                ]
              : []),
          ],
          // address:
        });

        onLendableCreated(doc.id);
      })}
    >
      <div className="mt-12 w-full max-w-xl p-4 prose dark:prose-invert">
        <h1>Create a new Lendable</h1>
      </div>

      <section className="w-full max-w-xl p-8 border border-cyan-500 rounded-lg">
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
                "text-green-600": shouldShowFullForm,
              })}
            >
              {shouldShowFullForm
                ? "NFT can be safely imported"
                : "Enter a valid NFT address to begin"}
            </span>
          </label>
        </div> */}

        <div className="card w-96 p-4 pt-8 shadow-sm shadow-cyan-500">
          <figure>
            <img src={nft.imageUrl} alt="NFT preview" />
          </figure>

          <div className="p-4 card-actions justify-end">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => onRequestChangeNFT()}
            >
              Change
            </button>
          </div>

          {/* <div className="card-body">
            <p>{contractAddress}</p>
          </div> */}
        </div>

        <div className="flex flex-col mt-8">
          <h3 className="text-lg mb-4">Customisation</h3>

          <div className="form-control">
            <label htmlFor="" className="label">
              <span className="label-text">Display name</span>
            </label>

            <input
              type="text"
              className="input"
              {...register("displayName", {
                validate: {
                  required: (v) => !!v,
                },
              })}
            />
          </div>

          <div className="mt-3 form-control">
            <label htmlFor="" className="label">
              <span className="label-text">Location</span>
              <span className="label-text">(Optional)</span>
            </label>

            <input type="text" className="input" {...register("location")} />
          </div>

          <div className="mt-3 form-control">
            <label htmlFor="" className="label">
              <span className="label-text">Tags</span>
              <span className="label-text">(Optional)</span>
            </label>

            <ReactTags
              id="tags"
              tags={tags}
              placeholder="history, gaming, culture, etc."
              suggestions={ALL_SUGGESTIONS}
              handleAddition={handleAddition}
              handleDelete={handleDelete}
              autocomplete
            />

            <label>
              <span className="label-text">
                Tags help others find your work
              </span>
            </label>
          </div>

          <div className="mt-3 form-control">
            <label htmlFor="" className="label">
              <span className="label-text">Description</span>
              <span className="label-text">(Optional)</span>
            </label>

            <textarea className="textarea" {...register("description")} />
          </div>

          <div className="divider"></div>

          <h3 className="text-lg mb-4">Usage</h3>

          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("requireAttribution")}
              />
              <span className="label-text">Require attribution</span>
            </label>
          </div>

          <div className="divider"></div>

          <h3 className="text-lg mb-4">Monetization options</h3>

          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("useOneTimeFee", {
                  onChange: () => trigger(["crossValidation"]),
                })}
              />
              <span className="label-text">One-time fee</span>
            </label>
          </div>

          <div
            className={classNames("form-control transition-opacity", {
              "opacity-50": !useOneTimeFee,
            })}
          >
            <label htmlFor="" className="input-group">
              <input
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 100"
                disabled={!useOneTimeFee}
                {...register("oneTimeFee")}
                className="input"
              />
              <span>
                <span className="kbd kbd-xs">TFUEL</span>
              </span>
            </label>
          </div>

          <div className="mt-4 form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("useCommissions", {
                  onChange: () => trigger(["crossValidation"]),
                })}
              />
              <span className="label-text">Commissions on sale</span>
            </label>
          </div>

          <div
            className={classNames("form-control transition-opacity", {
              "opacity-50": !useCommissions,
            })}
          >
            <label htmlFor="" className="input-group">
              <input
                type="number"
                min={0}
                max={20}
                step="0.01"
                placeholder="e.g. 10"
                disabled={!useCommissions}
                {...register("commission")}
                className="input"
              />
              <span>%</span>
            </label>

            <label htmlFor="" className="label">
              <span className="label-text">
                Can be any number between 0 and 20
              </span>
            </label>
          </div>
        </div>

        {Object.keys(formErrors).length ? (
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
                At least one monetization method must be selected
              </span>
            </div>
          </div>
        ) : null}
      </section>

      <div className="flex flex-row justify-end items-center mt-8 w-full max-w-xl">
        <Link href="/creators/dashboard">
          <a className="btn btn-ghost">Return to dashboard</a>
        </Link>

        <button
          type="submit"
          className={classNames("ml-4 btn btn-primary", {
            "btn-disabled": !formState.isDirty,
          })}
        >
          Create lendable
        </button>
      </div>
    </form>
  );
};

export default LendableFromNFTForm;
