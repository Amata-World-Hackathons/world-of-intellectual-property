import { AppPage } from "@src/types";
import { applyPrivateCreatorsPageLayout } from "@src/components/PrivateCreatorsPageLayout";
import Link from "next/link";

export const CreatorsDashboardPage: AppPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="mt-18 w-full max-w-3xl p-4 prose dark:prose-invert">
        <h1>Welcome to the dashboard</h1>
        <p>What would you like to do?</p>
      </div>

      <section className="mt-12 w-full max-w-5xl prose dark:prose-invert p-8 border border-cyan-500 rounded-lg">
        <h2>Marketplace</h2>

        <div className="flex flex-row-reverse">
          <Link href="/creators/lendables/new" passHref>
            <button className="ml-8 btn btn-primary">New lendable</button>
          </Link>

          <button className="ml-8 btn btn-primary">Manage my listings</button>

          <Link href="/creators/browse/media" passHref>
            <button className="btn btn-primary">Browse</button>
          </Link>
        </div>
      </section>

      <section className="my-24 w-full max-w-5xl prose dark:prose-invert p-8 border border-cyan-500 rounded-lg">
        <h2>Experiences</h2>

        <div className="flex flex-row-reverse">
          <Link href="/creators/experiences/new" passHref>
            <button className="ml-8 btn btn-primary">
              Create a new experience
            </button>
          </Link>

          <button className="ml-8 btn btn-primary">Manage Experiences</button>

          <Link href="/creators/browse/experiences" passHref>
            <button className="btn btn-primary">Browse</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

CreatorsDashboardPage.applyLayout = applyPrivateCreatorsPageLayout;

export default CreatorsDashboardPage;
