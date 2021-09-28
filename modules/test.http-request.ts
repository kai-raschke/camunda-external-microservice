import { Variables } from 'camunda-external-task-client-js';
import * as request from 'postman-request';

/***
 * Main task for subscription
 * @param task
 * @param taskService
 * @returns {Promise<void>}
 */
export async function main({ task, taskService }){
    try{
        const processVariables  = new Variables();

        try{
            let ping = task.variables.get("ping") || undefined;
            console.log(`var ping: ${ping}`);

            // Demo response
            /*
            {
                "userId": 1,
                "id": 1,
                "title": "delectus aut autem",
                "completed": false
            }
            */
            request({
                url: 'https://jsonplaceholder.typicode.com/todos/1',
                method: 'get'
            }, async function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

                const content = JSON.parse(body);

                // set something from response as process variable
                processVariables.set("title", content.title);

                await taskService.complete(task, processVariables);
            });
        } catch(ex){
            console.error(ex);
            await taskService.handleFailure(task, "An error occurred while requesting ressource");
        }
    }
    catch(ex){
        // log.error(ex);
        await taskService.handleFailure(task, "An error occured - strange ...");
    }
};
