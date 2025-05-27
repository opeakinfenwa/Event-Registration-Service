import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class RegistrationRepository {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  async createRegistration(eventId: string, userId: string) {
    const result = await this.db.query(
      `INSERT INTO registrations (event_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [eventId, userId],
    );
    return result.rows[0];
  }

  async countRegistrationsForEvent(eventId: string) {
    const result = await this.db.query(
      `SELECT COUNT(*) FROM registrations WHERE event_id = $1`,
      [eventId],
    );
    return parseInt(result.rows[0].count, 10);
  }

  async isUserRegistered(eventId: string, userId: string) {
    const result = await this.db.query(
      `SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2`,
      [eventId, userId],
    );
    return result.rows.length > 0;
  }

  async getAttendeesByEvent(
    eventId: string,
    skip: number,
    limit: number,
  ): Promise<{
    data: {
      id: string;
      name: string;
      email: string;
      registered_at: Date;
    }[];
    total: number;
  }> {
    const attendeesQuery = `
      SELECT 
        users.id, users.name, users.email, registrations.registered_at
      FROM registrations
      INNER JOIN users ON registrations.user_id = users.id
      WHERE registrations.event_id = $1
      ORDER BY registrations.registered_at DESC
      OFFSET $2 LIMIT $3
    `;

    const countQuery = `
      SELECT COUNT(*) FROM registrations
      WHERE event_id = $1
    `;

    const [attendeesResult, countResult] = await Promise.all([
      this.db.query(attendeesQuery, [eventId, skip, limit]),
      this.db.query(countQuery, [eventId]),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
      data: attendeesResult.rows,
      total,
    };
  }

  async removeRegistration(eventId: string, userId: string) {
    const result = await this.db.query(
      `DELETE FROM registrations WHERE event_id = $1 AND user_id = $2 RETURNING *`,
      [eventId, userId],
    );

    return result.rows[0];
  }
}
