# Introduction

This repository contains a simple demo to explore different index strategies in MongoDB Atlas, including the powerful Atlas Search feature.

## Features

This demo showcases:
- Compound indexes (ESR rule)
- Attributes indexes (compound and multikey indexes, demonstrating the Attribute pattern)
- Atlas Search

# Prerequisites

## Code Runtime

You'll need both **Node.js** and **Deno** on your computer.

- MacOS users: both can be installed with Homebrew (`brew install node deno`)
- For other operating systems, see the oficial sites
- Tip: You may run the frontend with Deno. I haven't tested... but if you're feeling brave...

## MongoDB Atlas

1. Create a cluster in MongoDB Atlas. For best results, use at least an M10 tier.
2. Network access: Make sure your computer can access the Atlas cluster. Set up an IP whitelist in **Network Access**.
3. User: It's recommended to create a dedicated user for this demo, following the least privilege principle. Assign the readWrite role to the relevant database.

# Configuration

1. Edit the `config.yml` file and add your [MongoDB connection string](https://www.mongodb.com/docs/manual/reference/connection-string/). 
2. You may want to change the database name in order to avoid possible conflicts. 

# Generating Testing Data 

The **loader** creates sample data and also sets up indexes. You must do this before running the tests.
1. Make sure your configuration is ready (config.yml)
2. Generate data and indexes:
```shell
cd loader
sh ./gen.sh
sh ./indexes.sh
```

You just need to execute `indexes.sh` once.

TIP: Each time you execute `loader/gen.sh` script, it will generate a new Tenant (Company / Hospital) and associated patients. You may want to change the total of patients per tenant on each execution. Change the const TOTAL variable under the `loader/src/gen.ts` script.

# Running the Demo

Open two terminals or VS Code instances, then execute:

1. Back end
```shell
cd back
sh ./dev.sh
```

2. Front end
```shell
cd front
npm install
sh ./dev.sh
```

After both services start, open [http://localhost:3000](http://localhost:3000) in your web browser.

# Working with the Demo

First you select the tenant, then you can switch between the experiences. 

- Default: Compound index
- Attribute: Attribute index
- Search: Atlas Search index

Everytime you search, you will see the filter utilized as well as the elapsed time (time that took to perform the search and return with the data). The backend code is computing the search elapsed time - so it will also factor the Atlas search time + network transfer time (download the response to your backend service). Keep this in mind if you have a problem with your network.

You may want to build the filters first. Just click on Filters right arrow. I will compute the filters based on all records created.
You can then select and deselect some of the filters and see the results.

The UI interface was built to show you the search attributes plus the information sent to the backend as well as received from the backend.

It is not meant to be highly optimized - for instance when you add a new Tag to an existing patient, the code um pre-compute the new filters object. In a real production ready code, this function would be running asynchronously.