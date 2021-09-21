import { Variables } from 'camunda-external-task-client-js';


/***
 * Main task for subscription
 * @param task
 * @param taskService
 * @returns {Promise<void>}
 */
export async function main({ task, taskService }){
    try{
        const processVariables  = new Variables();
        processVariables.set("executed", new Date());
        console.log('complete', new Date());
        await taskService.complete(task, processVariables);
    }
    catch(ex){
        // log.error(ex);
        await taskService.handleFailure(task, "An error occured - strange ...");
    }
}
