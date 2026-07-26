import { lte, and, eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { auctions } from '../db/schema.js';

const sweeper = () => {
    setInterval(async () => {
        try {
            console.log('running sweeper...');
            const response = await db
                .update(auctions)
                .set({status: 'ENDED'})
                .where(
                    and(
                        eq(auctions.status, 'ACTIVE'),
                        lte(auctions.ends_at, new Date())
                    )
                )
                .returning({ id: auctions.id })
            console.log(`Ended ${response.length ?? 0} auctions`);
        } catch (e) {
            console.error("Auction sweeper failed:", e);
        }
    }, 1000 * 60);
};

export default sweeper;