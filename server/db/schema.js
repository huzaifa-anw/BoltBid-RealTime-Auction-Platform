import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});


export const auctions = pgTable("auctions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),

  host_id: uuid("host_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  description: varchar("description", { length: 255 }).notNull(),
  starting_price: integer("starting_price").notNull(),
  highest_bid: integer("highest_bid"),

  highest_bidder_id: uuid("highest_bidder_id")
    .references(() => users.id, { onDelete: "set null" }),

  ends_at: timestamp("ends_at").notNull(),
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});


export const bids = pgTable("bids", {
  id: uuid("id").primaryKey().defaultRandom(),

  auction_id: uuid("auction_id")
    .notNull()
    .references(() => auctions.id, { onDelete: "cascade" }),

  bidder_id: uuid("bidder_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  amount: integer("amount").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});



export const usersRelations = relations(users, ({ many }) => ({
  auctions: many(auctions),
  bids: many(bids),
}));


export const auctionsRelations = relations(auctions, ({ one, many }) => ({
  host: one(users, {
    fields: [auctions.host_id],
    references: [users.id],
  }),

  highestBidder: one(users, {
    fields: [auctions.highest_bidder_id],
    references: [users.id],
  }),

  bids: many(bids),
}));


export const bidsRelations = relations(bids, ({ one }) => ({
  auction: one(auctions, {
    fields: [bids.auction_id],
    references: [auctions.id],
  }),

  bidder: one(users, {
    fields: [bids.bidder_id],
    references: [users.id],
  }),
}));