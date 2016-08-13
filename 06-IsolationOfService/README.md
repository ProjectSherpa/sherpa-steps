##Client being test
---

Welcome. This is the client/server being load testing. Improvement will be made here to improve the ability to scale.

Rough Draft:

-Serves website
- Contains database with data
--accepts posts
--accepts gets
--MERN Stack - Mongo, express, react, node


Start
---

```
npm start
```

Setup
---

```
npm install
```

Compile
---

```
npm run compile
```


##Vagrant Setup
Currently the server is running in a server. In order to facilitate load testing, vagrant will be used.

-Install Vagrant
-vagrant up

##Docker Setup
In order to Horizontally Scale, you can use the follow commands to build and run the app within a Docker Container

Build
---

```
docker build -t scalesherpas/sherpa-app .
```

Run
---

```
docker run -p 5000:5000 -d scalesherpas/sherpa-app
```

Navigating to localhost:5000 will give you access to the app.
