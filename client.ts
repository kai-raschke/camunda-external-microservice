import * as path from "path";

import { Client, BasicAuthInterceptor } from "camunda-external-task-client-js";
import { util } from "camunda-external-task-client-js/lib/__internal/utils";
import { log as log } from './log';

export class ExternalTaskClient {
    instance: ClientInstance;
    constructor(options?: object) {
        let env = {};

        // If options are available use them
        if (options) {
            env = options
        }
        // Otherwise check if initialized by PM2 or not (NODE_ENV not supplied means no PM2)
        else if (!process.env.NODE_ENV) {
            try {
                let appJson = require(path.resolve(__dirname) + path.sep + 'app.json'); //Module within node_modules/org.prodig.external.extras
                env = appJson.apps[0].env;
            } catch(ex){ console.log(ex); }
        }

        // If started by PM2 all env vars are available, otherwise merge them
        process.env = Object.assign(process.env, env);
    }

    init(options?: options) {
        options = options || {};
        let interceptors,
            config = {},
            use;

        let maxTasks =      this.parseEnv('MAX_TASK', 'integer'),
            interval =      this.parseEnv('INTERVAL', 'integer', 300),
            lockDuration =  this.parseEnv('LOCK_DURATION', 'integer', 50000),
            autoPoll =      this.parseEnv('AUTO_POLL', 'boolean', false),
            workerId =      this.parseEnv('WORKER_ID', 'string', 'default-worker'),
            baseUrl =       this.parseEnv('BASE_URL', 'string', 'http://localhost:8080/engine-rest'),
            AUTH =          this.parseEnv('AUTH', 'boolean', false),
            asyncResponseTimeout = this.parseEnv('ASYNC_RESPONSE_TIMEOUT', 'integer');

        //Use basic auth if needed for Camunda rest engine
        if(AUTH === true){
            let basicAuth = new BasicAuthInterceptor({
                username: this.parseEnv('USER', 'string', 'demo'),
                password: this.parseEnv('PASS', 'string', 'demo')
            });

            if (!interceptors) interceptors = [];

            interceptors.push(basicAuth);
        }

        //Add optional middleware for use
        if(
            (options.use && typeof options.use === 'function') ||
            (options.use && util.isArrayOfFunctions(options.use))
        ){
            use = options.use;
        }

        config = {
            maxTasks,
            asyncResponseTimeout,
            interval,
            lockDuration,
            autoPoll,
            interceptors,
            use,
            workerId,
            baseUrl
        };

        this.instance = new Client(config);
        this.appendLogger();

        return this;
    }

    parseEnv(envVar: string, typeOf: string, defaults: string|number|boolean = undefined) : string|number|boolean {
        let envValue = process.env[envVar];

        if (typeOf === 'integer') {
            let envValInt = Number.parseInt(envValue);
            return Number.isNaN(envValInt) ? defaults : envValInt;
        }
        else if (typeOf === 'boolean') {
            let envValBool = (envValue == undefined ? defaults : envValue); // check if default is available instead
            return (envValBool === 'true' || envValBool === true); // could be default bool or envVal
        }
        else {
            return envValue ? envValue : defaults;
        }
    }

    appendLogger () {
        this.instance.on("subscribe", topic => {
            log.info('Subscribed ' + topic);
        });

        this.instance.on("unsubscribe", topic => {
            log.info('Unsubscribed ' + topic);
        });

        this.instance.on("poll:start", () => {
            log.info('polling');
        });

        this.instance.on("poll:stop", () => {
            log.error("X-Camunda-PollError: stopped");
        });

        this.instance.on("poll:success", tasks => {
            log.info('task ' + tasks);
        });

        this.instance.on("poll:error", e => {
            log.error('X-Camunda-PollError: ' + e);
        });

        this.instance.on("complete:success", ({ id }) => {
            log.info(`completed task ${id}`);
        });

        this.instance.on("complete:error", ({ id }, e) => {
            log.error(`X-Camunda-CompleteError: couldn't complete task ${id}, ${e}`);
        });

        this.instance.on("handleFailure:success", ({ id }) => {
            log.info(`handled failure of task ${id}`);
        });

        this.instance.on("handleFailure:error", ({ id }, e) => {
            log.error(`X-Camunda-FailureError: couldn't handle failure of task ${id}, ${e}`);
        });

        this.instance.on("handleBpmnError:success", ({ id }) => {
            log.info(`handled BPMN error of task ${id}`);
        });

        this.instance.on("handleBpmnError:error", ({ id }, e) => {
            log.error(`X-Camunda-BpmnError: couldn't handle BPMN error of task ${id}, ${e}`);
        });

        this.instance.on("extendLock:success", ({ id }) => {
            log.info(`handled extend lock of task ${id}`);
        });

        this.instance.on("extendLock:error", ({ id }, e) => {
            log.error(`X-Camunda-ExtendLockError: couldn't handle extend lock of task ${id}, ${e}`);
        });

        this.instance.on("unlock:success", ({ id }) => {
            log.info(`unlocked task ${id}`);
        });

        this.instance.on("unlock:error", ({ id }, e) => {
            log.error(`X-Camunda-UnlockError: couldn't unlock task ${id}, ${e}`);
        });
    }

    getInstance () {
        return this.instance;
    }
}

export interface ExternalTaskClient {
    instance: ClientInstance
    init: (options?: options) => this
    parseEnv: (envVar: string, typeOf: string, defaults?: string|number|boolean) => string|number|boolean
    getInstance: () => ClientInstance
}

interface options {
    interceptors?: () => any | []
    use?: () => any | []
}

interface ClientInstance {
    subscribe: (topic: string, module: any) => any
    start: () => any
    on: (name: string, fn: (param1?: any, param2?: any) => void) => any
}