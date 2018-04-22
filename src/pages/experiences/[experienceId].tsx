import { applyCreatorsPageLayout } from "@src/components/CreatorsPageLayout";
import { Preloader } from "@src/components/progress/Preloader";
import { applyPublicPageLayout } from "@src/components/PublicPageLayout";
import { useFirestoreDocument } from "@src/contexts/Firebase";
import { AppPage } from "@src/types";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const ExperiencePage: AppPage = () => {
  const router = useRouter();
  const { experienceId } = router.query as { experienceId: string };

  const { data: d, loading } = useFirestoreDocument(
    "experiences",
    experienceId
  );

  if (loading) {
    return <Preloader />;
  }

  const data = d!;

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>{data?.name}</title>
      </Head>

      <div className="prose dark:prose-invert">
        <h1>{data?.name}</h1>
      </div>

      <img
        src={data?.imageUrl}
        alt={`Image of ${data?.name}`}
        className="mx-auto my-8"
      />

      <section className="p-8 w-full max-w-3xl border border-cyan-500 rounded-lg">
        <div className="mb-8 prose dark:prose-invert">{data?.description}</div>

        {data?.lendablesUsed.length ? (
          <>
            <div className="divider"></div>

            <div className="prose dark:prose-invert">
              <h3>Content attribution</h3>

              <ul>
                {data?.lendablesUsed.map(
                  ({ id, name }: { id: string; name: string }) => (
                    <li key={id}>
                      <Link href={`/creators/lendables/${id}`}>
                        <a className="">{name}</a>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </>
        ) : null}

        <div className="divider"></div>

        <p className="text-sm text-cyan-500">
          {data?.totalSupply} / {data?.totalSupply} remaining
        </p>
        <p className="mt-2 text-sm text-cyan-500">
          Price: {data?.ticketPrice} <span className="kbd kbd-xs">TFUEL</span>{" "}
        </p>

        <div className="mt-8 flex flex-row justify-end items-center">
          <Link href="/" passHref>
            <button className="btn btn-sm btn-ghost">Back to explore</button>
          </Link>

          <button className="btn btn-primary ml-8">Buy Now</button>
        </div>
      </section>
    </div>
  );
};

ExperiencePage.applyLayout = applyPublicPageLayout;

export default ExperiencePage;
