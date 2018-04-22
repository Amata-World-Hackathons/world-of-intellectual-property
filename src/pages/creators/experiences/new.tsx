import { applyPrivateCreatorsPageLayout } from "@src/components/PrivateCreatorsPageLayout";
import { AppPage } from "@src/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useFormState } from "react-hook-form";
import { debounce } from "debounce";
import classNames from "classnames";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocument,
} from "@src/contexts/Firebase";
import { useEthers } from "@usedapp/core";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";

import DERIVATIVE_WORK_ABI from "@src/abi/DerivativeWork.abi.json";
import DERIVATIVE_WORK_BYTECODE from "@src/abi/DerivativeWork.bytecode.json";
import { ContractFactory } from "ethers";

export const MintExperiencePage: AppPage = () => {
  const db = useFirestore();
  const router = useRouter();
  const { account, library } = useEthers();
  const prefResult = useFirestoreDocument("preferences", account!);
  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "all",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lendablesUsed",
  });
  const lendablesResult = useFirestoreCollection("lendables");

  const lendables = useMemo(() => {
    const res = lendablesResult.data?.slice(0) || [];
    const pts = (a: any) => (prefResult.data?.list.includes(a.id) ? 1 : 0);

    res.sort((a, b) => pts(b) - pts(a));

    return res;
  }, [lendablesResult, prefResult]);

  return (
    <div className="flex flex-col items-center">
      <div className="mt-16 p-4 prose dark:prose-invert">
        <h1>Create a new experience</h1>
      </div>

      <form
        onSubmit={handleSubmit(async (data) => {
          const factory = new ContractFactory(
            DERIVATIVE_WORK_ABI,
            DERIVATIVE_WORK_BYTECODE,
            library?.getSigner()
          );
          const doc = await addDoc(collection(db, "experiences"), {
            name: data.name,
            imageUrl: data.imageUrl,
            ticketPrice: data.ticketPrice,
            totalSupply: data.totalSupply,
            description: data.description,
            ownerAddress: account,
            lendablesUsed: data.lendablesUsed.map(
              ({ lendable, monetization }: any) => ({
                id: lendable.id,
                name: lendable.displayName,
                option: Object.keys(monetization).find(
                  (key) => !!monetization[key]
                ),
              })
            ),
          });

          router.push(`/experiences/${doc.id}`);
        })}
        className="flex flex-col items-center w-full"
      >
        <section className="w-full max-w-3xl p-8 rounded-lg border border-cyan-500">
          <div className="flex flex-col">
            <h3 className="text-lg mb-4">Customisation</h3>

            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text">Name</span>
              </label>

              <input
                type="text"
                className="input"
                {...register("name", {
                  validate: {
                    required: (v) => !!v,
                  },
                })}
              />
            </div>

            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text">Link to image</span>
              </label>

              <input
                type="text"
                className={classNames("input input-bordered", {
                  "input-bordered input-error":
                    dirtyFields.imageUrl && errors.imageUrl,
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
                    "text-red-500": dirtyFields.imageUrl && errors.imageUrl,
                  })}
                >
                  {!dirtyFields.imageUrl || !errors.imageUrl
                    ? "Image to be used for the NFT drop"
                    : "Invalid"}
                </span>
              </label>
            </div>

            <div className="mt-4 form-control">
              <label htmlFor="" className="label">
                <span className="label-text">Description</span>
                <span className="label-text">(Optional)</span>
              </label>

              <textarea className="textarea" {...register("description")} />
            </div>

            <div className="mt-4 form-control">
              <label htmlFor="" className="label">
                <span className="label-text">Total supply</span>
              </label>

              <label htmlFor="" className="input-group">
                <input
                  type="number"
                  min={0}
                  step="1"
                  placeholder="e.g. 50"
                  {...register("totalSupply", {
                    validate: {
                      required: (v) => !!v,
                    },
                  })}
                  className="input"
                />
                <span>Tickets</span>
              </label>
            </div>

            <div className="mt-4 form-control">
              <label htmlFor="" className="label">
                <span className="label-text">Ticket price</span>
              </label>

              <label htmlFor="" className="input-group">
                <input
                  type="number"
                  min={0}
                  step="1"
                  placeholder="e.g. 200"
                  {...register("ticketPrice", {
                    validate: {
                      required: (v) => !!v,
                    },
                  })}
                  className="input"
                />
                <span>
                  <span className="kbd kbd-xs">TFUEL</span>
                </span>
              </label>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex flex-col">
            <h3 className="text-lg mb-4">Lendables used</h3>
            <p className="text-sm text-slate-300">
              Give back to the creators that made this work possible
            </p>

            {fields.map((field, index) => (
              <div key={field.id} className="mt-4 form-control">
                <a
                  href={`/creators/marketplace/lendables/${field.lendable.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {field.lendable.displayName}
                </a>
                {field.lendable.monetization.map((m: any, idx) => (
                  <label
                    key={m.option}
                    className="label cursor-pointer justify-start"
                  >
                    <input
                      type="radio"
                      className="radio mr-4"
                      defaultChecked={idx === 0}
                      {...register(
                        `lendablesUsed.${index}.monetization.${m.option}`
                      )}
                    />

                    {m.option === "one-time-fee" ? (
                      <span key={m.option} className="label-text">
                        {m.value} <span className="kbd kbd-xs">TFUEL</span>{" "}
                        one-off payment
                      </span>
                    ) : (
                      <span key={m.option} className="label-text">
                        {m.value}% on every transaction
                      </span>
                    )}
                  </label>
                ))}
              </div>
            ))}

            <div className="flex flex-row justify-end">
              <label
                htmlFor="new-derivation-modal"
                className="mt-4 btn btn-secondary btn-sm modal-button"
              >
                <span className="material-icons">add_circle_outline</span>&nbsp;
                Add lendable
              </label>

              <input
                type="checkbox"
                id="new-derivation-modal"
                className="modal-toggle"
              />
              <label
                htmlFor="new-derivation-modal"
                className="modal cursor-pointer"
              >
                <label htmlFor="" className="modal-box relative">
                  <label
                    htmlFor="new-derivation-modal"
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                  >
                    ✕
                  </label>

                  <h3 className="font-bold text-lg">Choose from options</h3>

                  <ul className="flex-1 overflow-y-auto">
                    {lendables.map((lendable) => (
                      <li key={lendable.id} className="card card-side">
                        <figure className="h-32 w-32 overflow-hidden">
                          <img
                            src={lendable.nft.imageUrl}
                            alt={`Preview of ${lendable.displayName}`}
                          />
                        </figure>

                        <div className="card-body">
                          <h4 className="card-title">
                            {lendable.displayName}
                            {prefResult.data?.list.includes(lendable.id) ? (
                              <div className="badge badge-secondary">
                                In list
                              </div>
                            ) : null}
                          </h4>

                          <div className="card-actions justify-end">
                            <label
                              htmlFor="new-derivation-modal"
                              className="btn btn-primary btn-sm"
                              onClick={() => append({ lendable })}
                            >
                              Use
                            </label>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </label>
              </label>
            </div>
          </div>
        </section>

        <div className="flex flex-row justify-end items-center w-full max-w-3xl mt-12">
          <Link href="/creators/dashboard">
            <a className="btn btn-ghost">Back to dashboard</a>
          </Link>

          <button type="submit" className="ml-4 btn btn-primary">
            Create experience
          </button>
        </div>
      </form>
    </div>
  );
};

MintExperiencePage.applyLayout = applyPrivateCreatorsPageLayout;

export default MintExperiencePage;
