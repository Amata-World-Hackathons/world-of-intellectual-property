import CreatorsConnectButton from "@src/components/CreatorsConnectButton";
import { applyCreatorsPageLayout } from "@src/components/CreatorsPageLayout";
import { AppPage } from "@src/types";
import Link from "next/link";

const DUMMY_EXPERIENCES = [
  {
    img: "https://place-puppy.com/300x300",
    name: "Test 1",
    description: "Near an ear, a nearer ear, a nearly eerie ear",
    tags: ["Animals", "Dogs"],
  },
  {
    img: "https://place-puppy.com/300x200",
    name: "Test 2",
    description: "If a dog chews shoes whose shoes does he choose?",
    tags: ["Animals", "Dogs", "Puppies"],
  },
  {
    img: "https://place-puppy.com/200x300",
    name: "Test 3",
    description:
      "You know New York, you need New York, you know you need unique New York",
    tags: ["Animals", "Puppies"],
  },
];

const DUMMY_ART = [
  {
    img: "https://placekitten.com/300/300",
    name: "Test 4",
    description:
      "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn’t fuzzy, was he?",
    tags: ["Animals", "Cats"],
  },
  {
    img: "https://placekitten.com/300/200",
    name: "Test 5",
    description: "Kitty caught the kitten in the kitchen.",
    tags: ["Animals", "Cats", "Puppies"],
  },
  {
    img: "https://placekitten.com/200/300",
    name: "Test 6",
    description: "She sells seashells by the seashore",
    tags: ["Animals", "Puppies"],
  },
];

export const BrowseCreatorsPage: AppPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl p-4 prose dark:prose-invert">
        <h1>Check out what others have done</h1>
      </div>

      <section className="flex flex-col items-center mt-12 w-full">
        <div className="prose dark:prose-invert">
          <h2>Experiences</h2>
        </div>

        <div className="flex flex-row">
          {DUMMY_EXPERIENCES.map((exp) => (
            <div
              key={exp.name}
              className="card w-72 mr-12 shadow-blue-500/50 shadow-lg"
            >
              <figure className="w-full h-52 overflow-hidden">
                <img
                  src={exp.img}
                  alt={exp.name}
                  className="w-full object-contain"
                />
              </figure>

              <div className="card-body">
                <h3 className="card-title">{exp.name}</h3>

                <p>{exp.description}</p>

                {exp.tags.length ? (
                  <div className="card-actions justify-end">
                    {exp.tags.map((tag) => (
                      <div key={tag} className="badge badge-outline">
                        {tag}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-row-reverse mt-4 w-full max-w-5xl px-4">
          <Link href="/creators/browse/experiences">
            <a>More from experiences...</a>
          </Link>
        </div>
      </section>

      <section className="flex flex-col items-center mt-12 w-full">
        <div className="prose dark:prose-invert">
          <h2>Art</h2>
        </div>

        <div className="flex flex-row">
          {DUMMY_ART.map((exp) => (
            <div
              key={exp.name}
              className="card w-72 mr-12 shadow-blue-500/50 shadow-lg"
            >
              <figure className="w-full h-52 overflow-hidden">
                <img
                  src={exp.img}
                  alt={exp.name}
                  className="w-full object-contain"
                />
              </figure>

              <div className="card-body">
                <h3 className="card-title">{exp.name}</h3>

                <p>{exp.description}</p>

                {exp.tags.length ? (
                  <div className="card-actions justify-end">
                    {exp.tags.map((tag) => (
                      <div key={tag} className="badge badge-outline">
                        {tag}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-row-reverse mt-4 w-full max-w-5xl px-4">
          <Link href="/creators/browse/media">
            <a>More from media...</a>
          </Link>
        </div>
      </section>

      <section className="h-[50vh] flex flex-col items-center justify-center mt-12 w-full max-w-3xl p-4 prose dark:prose-invert">
        <h2>Join the fun</h2>

        <CreatorsConnectButton />
      </section>
    </div>
  );
};

BrowseCreatorsPage.applyLayout = applyCreatorsPageLayout;

export default BrowseCreatorsPage;
