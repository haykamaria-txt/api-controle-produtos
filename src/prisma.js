require("dotenv").config({ quiet: true });

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

require.extensions[".ts"] = require.extensions[".js"];

const { PrismaClient } = require("../generated/prisma/client");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
