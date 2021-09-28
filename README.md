# camunda-external-microservice
Uses external task client to redirect variable microservices to modules

## microApi

Acts as an interface between Camunda and other microservices and executes simple tasks.
Implemented using the External Task Client from Camunda (https://github.com/camunda/camunda-external-task-client-js).

### Configuration

Default method for setting configurations options is the .env file.

If you are using PM2 as process manager, you can use their ecosystem json file declaration (sample
in app.json.sample). In case of PM2 delete the .env file, because it will overwrite the variables
of PM2.

### Option

| Variable | Type | Optional | Default | Values | Description |
|---|---|---|---|---|---|
| NODE_ENV | String |  | -  | development; staging; production  | node environment
|  TOPIC |  String |   | -  |   | external service task topic |
| ASYNC_RESPONSE_TIMEOUT |  Number | X  | -  |   | [External Task Client Docs](https://github.com/camunda/camunda-external-task-client-js/blob/master/docs/Client.md#new-clientoptions)
| MAX_TASK |  Number | X  | 10  |   | [External Task Client Docs](https://github.com/camunda/camunda-external-task-client-js/blob/master/docs/Client.md#new-clientoptions)
| INTERVAL |  Number | X  | 300  |   | [External Task Client Docs](https://github.com/camunda/camunda-external-task-client-js/blob/master/docs/Client.md#new-clientoptions)
| LOCK_DURATION |  Number | X  | 50000  |   | [External Task Client Docs](https://github.com/camunda/camunda-external-task-client-js/blob/master/docs/Client.md#new-clientoptions)
| BASE_URL |  String | X  | http://localhost:8080/engine-rest  |   | [External Task Client Docs](https://github.com/camunda/camunda-external-task-client-js/blob/master/docs/Client.md#new-clientoptions)
| WORKER_ID |  String | X  | default-worker  |   | [External Task Client Docs](https://github.com/camunda/camunda-external-task-client-js/blob/master/docs/Client.md#new-clientoptions)
| AUTH |  Boolean | X  | false  |   | Use basic auth for REST
| USER |  String | X  | -  |   | Basic auth user
| PASS |  String | X  | -  |   | Basic auth password

### How it works

Place a service task in your BPMN and configure it to use the external microservice (see the sample BPMN).

This service will grab the task and execute the specified module.  
The module is specified as input parameter named "micro-api-module" and as value the filename of the
the module (without extension).

You can set more input variables in the service task to use them directly in the module. Modules
then take care of some service (e.g. Query another API, build a PDF, download stuff etc.).

### Sample

Sample folder holds a BPMN using the "just-complete"-Microservice.
It just completes the service successfully.

### LICENCE

MIT License

Copyright (c), 2021, KAJU.IT UG (haftungsbeschränkt)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
