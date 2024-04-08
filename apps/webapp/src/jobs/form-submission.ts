import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
// import { isEmpty } from "lodash";
// import prisma from '@/lib/prisma'

// import * as apps from "./src/apps";
import { processDefaultActions } from "./src/defaultActions";

// const appSlugToAppMap: any = {};

client.defineJob({
    id: "form-submission-job",
    name: "Form Submission: Gets triggered on every submission",
    version: "0.0.1",
    trigger: eventTrigger({
        name: "form-submission.event",
    }),
    run: async (payload, io, ctx) => {
        const { eventData } = payload;
        const { formSubmissionData } = eventData || {};

        // if (isEmpty(appSlugToAppMap)) {
        //   const getApps = await prisma.app.findMany();
        //   getApps.forEach((app: any) => {
        //     appSlugToAppMap[app.slug] = app;
        //   });
        // }

        await io.runTask("processDefaultActions", async () => {
            /* Performing Default action like sending email notification and autoresponding for a form submissions */
            await processDefaultActions({ data: payload });
        });

        // // Fetching the Workflows based on the formId
        // const workflow = await prisma.workflow.findFirstOrThrow({
        //   where: {
        //     formId: formId
        //   }
        // })
        // // Fetching all the different Tasks Associated with the Workflows

        // // TODO: Need to implement the logic for processing the tasks using bull-mq flow producers
        // // For now, we are directly processing the tasks
        // const tasks = await prisma.task.findMany({
        //   where: {
        //     workflowId: workflow.id,
        //     status: "active"
        //   }
        // });

        // for await (const task of tasks) {
        //   // Fetching the connection details for connectionId
        //   const conn = await prisma.connection.findFirstOrThrow({ where: { id: task.connectionId } });

        //   const { apiKeys, appSlug, id: connId } = conn;

        //   // Sending the required data to the apps
        //   const app = appSlugToAppMap[appSlug] || {};
        //   const processedData = await apps[appSlug]({
        //     actionSlug: task.slug || "",
        //     apiKeys,
        //     app,
        //     taskData: task,
        //     connId,
        //     ...payload,
        //   });

        //   continue;
        // }

        await io.logger.info(
            `For submission id: ${formSubmissionData.id} event processed successfully!`
        );
    },
});