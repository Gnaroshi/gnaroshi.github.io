import { syncNewsContent } from "./news.mjs";
import { syncPublicationContent } from "./publications.mjs";
import { syncPhotoContent } from "./photos.mjs";

const run = async () => {
  await syncNewsContent({ validateOnly: true });
  await syncPublicationContent({ validateOnly: true });
  await syncPhotoContent({ validateOnly: true });
  console.log("[content] validation completed");
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

