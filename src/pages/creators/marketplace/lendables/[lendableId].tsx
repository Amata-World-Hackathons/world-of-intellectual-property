import { applyCreatorsPageLayout } from "@src/components/CreatorsPageLayout";
import { Preloader } from "@src/components/progress/Preloader";
import { useFirestoreDocument } from "@src/contexts/Firebase";
import { AppPage } from "@src/types";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const LendablePage: AppPage = () => {
  const router = useRouter();
  const { lendableId } = router.query as { lendableId: string };

  const { data: d, loading } = useFirestoreDocument("lendables", lendableId);

  if (loading) {
    return <Preloader />;
  }

  const data = d!;

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>{data?.displayName}</title>
      </Head>

      <h1>{data?.displayName}</h1>

      <div className="card w-96 bg-base-100 shadow-sm shadow-cyan-500">
        <figure>
          <img
            src={data?.nft.imageUrl}
            alt={`Image of ${data?.displayName}`}
            className="mx-auto"
          />
        </figure>
        <div className="card-body">
          <div className="card-actions justify-end">
            <Link href="/creators/marketplace" passHref>
              <button className="btn btn-sm btn-ghost">
                Back to the Marketplace
              </button>
            </Link>

            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

LendablePage.applyLayout = applyCreatorsPageLayout;

export default LendablePage;
