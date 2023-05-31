import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import checkPlan from "@/utils/checkPlan";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const reqBody = JSON.parse(req.body);
  const { customHoneypot, customSpamWords, formId, plan } = reqBody;

  const toProceed = checkPlan(plan);

  if (!toProceed) {
    return res
      .status(400)
      .json({ success: false, message: "Please upgrade plan" });
  }

  const customSpamArray = customSpamWords.split(",");

  const response = await prisma.forms.update({
    where: {
      id: formId,
    },
    data: {
      customHoneypot: customHoneypot,
      customSpamWords: customSpamArray,
    },
  });

  return res.status(201).json({ success: true, data: response });
}
