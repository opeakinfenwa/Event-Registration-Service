import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UserRepository {
  constructor(@Inject('PG_CONNECTION') private readonly db: Pool) {}

  async getUserByEmail(email: string) {
    const result = await this.db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    return result.rows[0];
  }

  async googleUserCheck(email: string) {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1 AND google_id IS NOT NULL',
      [email],
    );
    return result.rows[0];
  }
  async createUser(
    email: string,
    name: string,
    password: string,
    role: string = 'attendee',
    authProvider: string = 'local',
    securityQuestion: string,
    securityAnswer: string,
  ) {
    const result = await this.db.query(
      `INSERT INTO users (
        email, name, password, role, auth_provider, security_question, security_answer
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        email,
        name,
        password,
        role,
        authProvider,
        securityQuestion,
        securityAnswer,
      ],
    );

    return result.rows[0];
  }

  async createGoogleUser(
    googleId: string,
    email: string,
    name: string,
    role: string = 'attendee',
    authProvider: string = 'google',
  ) {
    const result = await this.db.query(
      `INSERT INTO users (
        google_id, email, name, role, auth_provider
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [googleId, email, name, role, authProvider],
    );

    return result.rows[0];
  }

  async updateUserDetails(id: string, updates: any) {
    const setFields: string[] = [];
    const values: any[] = [];

    if (updates.name) {
      setFields.push('name = $' + (values.length + 1));
      values.push(updates.name);
    }

    if (updates.email) {
      setFields.push('email = $' + (values.length + 1));
      values.push(updates.email);
    }

    if (updates.securityQuestion) {
      setFields.push('security_question = $' + (values.length + 1));
      values.push(updates.securityQuestion);
    }

    if (updates.securityAnswer) {
      setFields.push('security_answer = $' + (values.length + 1));
      values.push(updates.securityAnswer);
    }

    if (setFields.length === 0) {
      throw new Error(
        'At least one field (name, email, security question, or security answer) must be provided for update',
      );
    }

    const query = `UPDATE users SET ${setFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`;
    values.push(id);

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateUserPassword(userId: string, newPassword: string) {
    const result = await this.db.query(
      `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [newPassword, userId],
    );

    return result.rows[0];
  }

  async getUserById(id: string) {
    const result = await this.db.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    return result.rows[0];
  }

  async getUserByGoogleId(googleId: string) {
    const result = await this.db.query(
      `SELECT * FROM users WHERE google_id = $1`,
      [googleId],
    );
    return result.rows[0];
  }

  async deleteUserById(id: string) {
    const result = await this.db.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );
    return result.rows[0];
  }
}