import { syncNewsContent } from "./news.mjs";
import { syncPublicationContent } from "./publications.mjs";
import { syncPhotoContent } from "./photos.mjs";

const run = async () => {
  await syncNewsContent();
  await syncPublicationContent();
  await syncPhotoContent();
  console.log("[content] sync completed");
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

