import CreatorsConnectButton from "../../components/CreatorsConnectButton";
import { applyCreatorsPageLayout } from "../../components/CreatorsPageLayout";
import { AppPage } from "../../types";

const CreatorsPage: AppPage = () => {
  return (
    <div className="flex flex-col items-center">
      <section
        className="relative w-full max-w-3xl p-4 prose dark:prose-invert"
        style={{
          height: "calc(100vh - 4rem)",
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1>Become a creator</h1>

          <p>Jump in and leave your mark in the multiverse</p>

          <CreatorsConnectButton />
        </div>

        <div className="absolute bottom-0 left-1/2">
          <span className="material-icons">expand_more</span>
        </div>
      </section>

      <section className="w-full max-w-5xl p-4 prose dark:prose-invert">
        <h2>Build experiences across the metaverse</h2>

        <p>Create connected experiences that span the metaverse</p>
      </section>

      <section className="mt-52 w-full max-w-5xl p-4 prose dark:prose-invert text-right">
        <h2>Turn those fantasies into realities</h2>

        <p>Ever asked yourself what if? Now you can make it happen</p>
      </section>

      <section className="h-screen flex flex-col items-center justify-center mt-52 w-full max-w-3xl p-4 prose dark:prose-invert">
        <h2>Begin your journey</h2>

        <CreatorsConnectButton />
      </section>
    </div>
  );
};

CreatorsPage.applyLayout = applyCreatorsPageLayout;

export default CreatorsPage;
