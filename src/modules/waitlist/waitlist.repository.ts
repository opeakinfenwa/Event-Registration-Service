import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class WaitlistRepository {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  async addToWaitlist(eventId: string, userId: string) {
    const result = await this.db.query(
      `INSERT INTO waitlist (event_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [eventId, userId],
    );
    return result.rows[0];
  }

  async findNextInWaitlist(eventId: string) {
    const result = await this.db.query(
      `SELECT * FROM waitlist
       WHERE event_id = $1
       ORDER BY joined_at ASC
       LIMIT 1`,
      [eventId],
    );
    return result.rows[0];
  }

  async removeFromWaitlist(eventId: string, userId: string) {
    await this.db.query(
      `DELETE FROM waitlist
       WHERE event_id = $1 AND user_id = $2`,
      [eventId, userId],
    );
  }
  async deleteByEventAndUser(eventId: string, userId: string) {
    const result = await this.db.query(
      `DELETE FROM waitlist WHERE event_id = $1 AND user_id = $2 RETURNING *`,
      [eventId, userId],
    );
    return result.rows[0];
  }

  async isUserAlreadyOnWaitlist(
    eventId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.db.query(
      `SELECT 1 FROM waitlist
       WHERE event_id = $1 AND user_id = $2`,
      [eventId, userId],
    );
    return result.rows.length > 0;
  }

  async findByUserId(userId: string) {
    const result = await this.db.query(
      `SELECT * FROM waitlist WHERE user_id = $1 ORDER BY created_at ASC`,
      [userId],
    );
    return result.rows;
  }

  async getWaitlistByEvent(
    eventId: string,
    skip: number,
    limit: number,
  ): Promise<{
    data: {
      id: string;
      name: string;
      email: string;
      joined_at: Date;
    }[];
    total: number;
  }> {
    const waitlistQuery = `
    SELECT 
      users.id, users.name, users.email, waitlist.joined_at
    FROM waitlist
    INNER JOIN users ON waitlist.user_id = users.id
    WHERE waitlist.event_id = $1
    ORDER BY waitlist.joined_at ASC
    OFFSET $2 LIMIT $3
  `;

    const countQuery = `
    SELECT COUNT(*) FROM waitlist
    WHERE event_id = $1
  `;

    const [waitlistResult, countResult] = await Promise.all([
      this.db.query(waitlistQuery, [eventId, skip, limit]),
      this.db.query(countQuery, [eventId]),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
      data: waitlistResult.rows,
      total,
    };
  }
}