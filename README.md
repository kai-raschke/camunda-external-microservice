# camunda-external-microservice
Uses external task client to redirect variable microservices

### microApi

Fungiert als Schnittstelle zwischen Camunda und weiteren Microservices und führt einfache Tasks aus.
Umgesetzt mithilfe des External Task Client von Camunda (https://github.com/camunda/camunda-external-task-client-js).


**Konfiguration**

Die Konfiguration kann in einer app.json hinterlegt werden. Das Format entspricht 
dem Ecosystem-File von PM2 (https://pm2.io/docs/runtime/best-practices/environment-variables/).

    "NODE_ENV": "development",
    "topic": "dev.external.microapi",
    "ASYNC_RESPONSE_TIMEOUT": 10000,
    "MAX_TASK": 5,
    "INTERVAL": 2000,
    "AUTO_POLL": "false",
    "LOCK_DURATION": 10000,
    "BASE_URL": "http://localhost:8080/engine-rest",
    "WORKER_ID": "default-worker",
    "USER": "demo",
    "PASS": "demo",

**Funktionisweise**

Der Dienst fragt Camunda nach External Tasks und gleicht diese mit dem Topic ab. 
Befinden sich offene Task für das Topic in der Pipeline, werden diese abgerufen.  
Im BPMN wird über Input-Variablen der auszuführende Task und ggf. noch Variablen 
mitgegeben (nicht notwendigerweise, da alle Variablen bei Bedarf zur Verfügung stehen).  

Alle Funktionen sind als Module im Ordner "modules" hinterlegt.

Falls aufwendigere Prozesse ausgeführt werden sollen (z. B. PDF erstellen), wird 
diese Aufgabe über das Modul delegiert (PDF creator HTTP API).


**Sample**

Beispiel BPMN mit dem Aufruf des "just-complete"-Microservice.
