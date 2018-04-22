import { AppPage } from "@src/types";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocument,
} from "@src/contexts/Firebase";
import { Preloader } from "@src/components/progress/Preloader";
import { applyPrivateCreatorsPageLayout } from "@src/components/PrivateCreatorsPageLayout";
import { useEthers } from "@usedapp/core";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import classNames from "classnames";

const USER_DATA = "userdata";

const CreatorsMarketplacePage: AppPage = () => {
  const { account } = useEthers();
  const db = useFirestore();
  const { data, loading } = useFirestoreCollection("lendables");
  const result = useFirestoreDocument("preferences", account!);

  if (loading) return <Preloader />;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 prose dark:prose-invert">
        <h1>Marketplace</h1>
      </div>

      <ul className="flex flex-row flex-wrap w-full max-w-6xl justify-evenly">
        {data?.map((d) => {
          const isInList = result.data?.list.includes(d.id);

          return (
            <li
              key={d.id}
              className="card m-4 w-72 max-h-screen bg-base-100 shadow-sm shadow-cyan-500"
            >
              <figure>
                <img src={d.nft.imageUrl} alt={`Image of ${d.displayName}`} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{d.displayName}</h2>

                <div className="tooltip" data-tip={d.ownerAddress}>
                  <p className="text-left text-xs text-slate-400">
                    by {d.ownerAddress.slice(0, 9)}...
                  </p>
                </div>

                <p className="max-h-32 text-ellipsis overflow-hidden">
                  {d.description || "N/A"}
                </p>

                <div className="text-sm text-slate-200">
                  Payment options:
                  <ul className="list-disc">
                    {d.monetization.map((m) =>
                      m.option === "one-time-fee" ? (
                        <li key={m.option}>
                          {m.value} <span className="kbd kbd-xs">TFUEL</span>{" "}
                          one-off payment
                        </li>
                      ) : (
                        <li key={m.option}>{m.value}% on every transaction</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="card-actions justify-end">
                  {d.tags.map((tag: string) => (
                    <div key={tag} className="badge badge-outline">
                      {tag}
                    </div>
                  ))}
                </div>

                <div className="mt-4 card-actions justify-end">
                  <button
                    className={classNames("btn btn-xs", {
                      "btn-secondary": !isInList,
                      "btn-accent": isInList,
                    })}
                    onClick={() => {
                      if (result.data) {
                        updateDoc(doc(db, "preferences", result.data.id), {
                          list: arrayUnion(d.id),
                        });
                      } else {
                        setDoc(doc(db, "preferences", account!), {
                          list: [d.id],
                        });
                      }

                      result.refetch();
                    }}
                  >
                    {isInList ? "Added" : "Add to list"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

CreatorsMarketplacePage.applyLayout = applyPrivateCreatorsPageLayout;

export default CreatorsMarketplacePage;
