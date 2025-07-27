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

Every time you perform a search, you'll see the filter that was used and the elapsed time - the time it took to search and return the data. 
The backend code measures this elapsed time, so it includes both the MongoDB Atlas processing time and the time to transfer results over the network to your backend service. Keep this in mind if you experience network issues, as slowdowns may be due to network conditions.

You may want to build your filters first. Click on "Filters" or filters arrow. This will compute filter options based on all existing records. It may take sometime to return from the first run.

The UI is designed to show you both the search attributes and the data sent to and received from the backend.

The goal of this demo is to focus on database search and different index strategies. As such, the service is not highly optimized. For example, when you add a new tag to the existing patient, the backend service recomputes the filters object synchronously. In production-ready code, this function would typically run asynchronously.