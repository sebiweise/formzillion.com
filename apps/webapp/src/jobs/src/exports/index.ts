import { httpClient } from "../../utils";
import { ExportSubmissionsEmail } from "./exportEmail";
import { convertJsonToCsv, uploadFileToSupabase } from "./helper";
import { apiKey, fromEmailData } from "../config/sengrid";
import prisma from "@/lib/prisma";

const sendEmail = async ({ data, apiKey }: { data: any; apiKey: string }) => {
  return await httpClient({
    endPoint: `https://api.sendgrid.com/v3/mail/send`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: data,
  });
};

const exportSubmissions = async (eventData: any) => {
  const exportDays = new Date();
  const { userEmail } = eventData;
  exportDays.setDate(exportDays.getDate() - eventData.exportDays);

  const jsonData = await prisma.form_submissions.findFirst({
    where: {
      formId: eventData.formId,
      createdAt: {
        gt: exportDays
      }
    }
  });

  const { csvData, fileName }: any = convertJsonToCsv(jsonData);
  const fileUrl = await uploadFileToSupabase(csvData, fileName);
  console.log("fileUrl: ", fileUrl);

  const exportSubmissionsEmail = {
    from: fromEmailData,
    personalizations: [
      {
        to: [
          {
            email: userEmail.replaceAll(`"`, ""),
          },
        ],
      },
    ],
    subject: `Export File Submission`,
    content: [
      {
        type: "text/html",
        value: ExportSubmissionsEmail({
          fileUrl,
        }),
      },
    ],
  };

  const res: any = await sendEmail({ data: exportSubmissionsEmail, apiKey });
  if (res.status === 202) {
    return {
      success: true,
      message: `Export event processed successfully!`,
    };
  } else {
    return {
      success: false,
      message: `error: ${res.status} ${res.message}`,
    };
  }
};

export default exportSubmissions;
