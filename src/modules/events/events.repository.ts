import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class EventRepository {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  async createEvent(
    userId: string,
    data: {
      title: string;
      description: string;
      location: string;
      capacity: number;
      date: string;
      registration_ends: string;
    },
  ) {
    const { title, description, location, date } = data;
    const result = await this.db.query(
      `INSERT INTO events (title, description, location, capacity, date, registration_ends, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, location, date, userId],
    );
    return result.rows[0];
  }

  async findAllEvents() {
    const result = await this.db.query(
      `SELECT * FROM events ORDER BY date ASC`,
    );
    return result.rows;
  }

  async findEventById(id: string) {
    const result = await this.db.query(`SELECT * FROM events WHERE id = $1`, [
      id,
    ]);
    return result.rows[0];
  }

  async findEventsByUser(userId: string) {
    const result = await this.db.query(
      `SELECT * FROM events WHERE user_id = $1 ORDER BY date ASC`,
      [userId],
    );
    return result.rows;
  }

  async updateEvent(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      location: string;
      capacity: number;
      date: string;
      registration_ends: string;
    }>,
  ) {
    if (!Object.keys(data).length) {
      throw new Error('No fields provided for update.');
    }

    const validFields = [
      'title',
      'description',
      'location',
      'capacity',
      'date',
      'registration_ends',
    ];
    const entries = Object.entries(data).filter(([key]) =>
      validFields.includes(key),
    );

    if (!entries.length) {
      throw new Error('Invalid fields provided for update.');
    }

    const fields = entries.map(([key], i) => `${key} = $${i + 2}`).join(', ');

    const values = [id, ...entries.map(([, value]) => value)];

    const query = `UPDATE events SET ${fields} WHERE id = $1 RETURNING *`;

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async deleteEvent(id: string) {
    await this.db.query(`DELETE FROM events WHERE id = $1`, [id]);
  }
}