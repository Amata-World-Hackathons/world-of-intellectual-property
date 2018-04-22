import { AppPage } from "@src/types";
import Link from "next/link";

export const FatalErrorPage: AppPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-black">
      <section className="prose dark:prose-invert">
        <h1>Something really bad happened</h1>
        <p>
          It is not safe here, quickly{" "}
          <Link href="/">
            <a className="link link-accent">return to safety</a>
          </Link>
        </p>
      </section>
    </div>
  );
};

FatalErrorPage.applyLayout = (page) => page;

export default FatalErrorPage;
