import ImageKit from "imagekit"; // Node.js SDK
import { env } from "../env/env";

export const ik = new ImageKit({
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT!, // https://ik.imagekit.io/your_imagekit_id
  publicKey: env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: env.IMAGEKIT_PRIVATE_KEY!,
});
