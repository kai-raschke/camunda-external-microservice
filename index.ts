// Import .env file if available
require('dotenv').config();

import { ExternalTaskClient } from "./client";
import { log, creatLogger } from './log';

function main () {
    creatLogger(); // initialize logger
    log.info("Start micro API");

    const extClient = new ExternalTaskClient();
    const instance = extClient.init().getInstance();

    const topic = process.env.topic;

    if (topic) {
        instance.subscribe(topic, taskSubscription);
        instance.start();
    }
}

main();

/***
 * Main task for subscription
 * @param task
 * @param taskService
 * @returns {Promise<void>}
 */
export async function taskSubscription({ task, taskService }){
    try {
        // get module which shall be executed
        const microModule = task.variables.get("micro-api-module");
        log.info(microModule);
        const module = await import('./modules/' + microModule);

        module.main({ task, taskService });
    }
    catch (ex) {
         // log.error(ex);
        await taskService.handleFailure(task, "An error occured - strange ...");
    }
}
