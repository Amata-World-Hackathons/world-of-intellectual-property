import Head from "next/head";
import { AppPage } from "../types";

import { useRouter } from "next/router";
import { applyPublicPageLayout } from "@src/components/PublicPageLayout";
import { useFirestoreCollection } from "@src/contexts/Firebase";
import { Preloader } from "@src/components/progress/Preloader";
import Link from "next/link";

const Home: AppPage = () => {
  const { data, loading } = useFirestoreCollection("experiences");

  if (loading) return <Preloader />;

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>World of Intellectual Property</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-8 prose dark:prose-invert">
        <h1>Browse our experiences</h1>
      </div>

      <ul className="flex flex-row flex-wrap w-full max-w-6xl justify-evenly">
        {data?.map((d) => {
          return (
            <li
              key={d.id}
              className="card m-4 w-72 max-h-screen bg-base-100 shadow-sm shadow-cyan-500"
            >
              <figure>
                <img src={d.imageUrl} alt={d.name} />
              </figure>

              <div className="card-body">
                <h2 className="card-title">
                  <Link href={`/experiences/${d.id}`}>
                    <a>{d.name}</a>
                  </Link>
                </h2>

                <div className="tooltip" data-tip={d.ownerAddress}>
                  <p className="text-left text-xs text-slate-400">
                    by {d.ownerAddress.slice(0, 9)}...
                  </p>
                </div>

                <p className="max-h-32 text-ellipsis overflow-hidden">
                  {d.description || "N/A"}
                </p>

                <div className="text-sm text-slate-200">
                  Price: {d.ticketPrice}{" "}
                  <span className="kbd kbd-xs">TFUEL</span>
                </div>

                <div className="text-sm text-cyan-400">
                  Only {d.totalSupply}/{d.totalSupply} left!
                </div>

                <div className="mt-4 card-actions justify-end">
                  <button
                    className="btn btn-xs btn-secondary"
                    onClick={() => {
                      // if (result.data) {
                      //   updateDoc(doc(db, "preferences", result.data.id), {
                      //     list: arrayUnion(d.id),
                      //   });
                      // } else {
                      //   setDoc(doc(db, "preferences", account!), {
                      //     list: [d.id],
                      //   });
                      // }
                      // result.refetch();
                    }}
                  >
                    Buy now
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

Home.applyLayout = applyPublicPageLayout;

export default Home;
