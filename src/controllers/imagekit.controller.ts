import { Request, Response } from "express";
import ImageKit from "imagekit"; // Node.js SDK

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!, // https://ik.imagekit.io/your_imagekit_id
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const imagekitAuthentication = async (req: Request, res: Response) => {
  try {
    const authenticationDetails = imagekit.getAuthenticationParameters();
    res.status(200).json({
      status: true,
      message: "ImageKit authentication details retrieved successfully",
      data: {
        ...authenticationDetails,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      },
    });
  } catch (error) {
    console.error("Error in imagekitAuthentication:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve ImageKit authentication details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { imagekitAuthentication };
