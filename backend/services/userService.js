const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class UserService {
  // Create new user
  async createUser(userData) {
    const { name, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, carbon_footprint, level, points, avatar_url, created_at
    `;
    
    const values = [name, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Find user by ID
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const { name, avatar_url } = updateData;
    const query = `
      UPDATE users 
      SET name = COALESCE($2, name), 
          avatar_url = COALESCE($3, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email, carbon_footprint, level, points, avatar_url
    `;
    
    const result = await pool.query(query, [userId, name, avatar_url]);
    return result.rows[0];
  }

  // Update user carbon footprint
  async updateCarbonFootprint(userId, carbonAmount) {
    const query = `
      UPDATE users 
      SET carbon_footprint = carbon_footprint + $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING carbon_footprint
    `;
    
    const result = await pool.query(query, [userId, carbonAmount]);
    return result.rows[0];
  }

  // Add points to user
  async addPoints(userId, points) {
    const query = `
      UPDATE users 
      SET points = points + $2,
          level = CASE 
            WHEN points + $2 >= 1000 THEN 2
            WHEN points + $2 >= 2000 THEN 3
            WHEN points + $2 >= 3500 THEN 4
            WHEN points + $2 >= 5000 THEN 5
            ELSE level
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING points, level
    `;
    
    const result = await pool.query(query, [userId, points]);
    return result.rows[0];
  }

  // Get user statistics
  async getUserStats(userId) {
    const query = `
      SELECT 
        u.carbon_footprint,
        u.level,
        u.points,
        COUNT(ce.id) as total_activities,
        COUNT(uc.id) as challenges_joined,
        COUNT(CASE WHEN uc.completed = true THEN 1 END) as challenges_completed,
        COALESCE(SUM(ce.carbon_amount), 0) as total_carbon_logged
      FROM users u
      LEFT JOIN carbon_entries ce ON u.id = ce.user_id
      LEFT JOIN user_challenges uc ON u.id = uc.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.carbon_footprint, u.level, u.points
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  // Get user's carbon footprint history
  async getCarbonHistory(userId, period = 'week') {
    let dateFilter;
    switch (period) {
      case 'week':
        dateFilter = 'date >= CURRENT_DATE - INTERVAL \'7 days\'';
        break;
      case 'month':
        dateFilter = 'date >= CURRENT_DATE - INTERVAL \'30 days\'';
        break;
      case 'year':
        dateFilter = 'date >= CURRENT_DATE - INTERVAL \'1 year\'';
        break;
      default:
        dateFilter = 'date >= CURRENT_DATE - INTERVAL \'7 days\'';
    }

    const query = `
      SELECT 
        date,
        SUM(carbon_amount) as daily_total,
        COUNT(*) as activity_count
      FROM carbon_entries 
      WHERE user_id = $1 AND ${dateFilter}
      GROUP BY date 
      ORDER BY date ASC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get user's activity breakdown
  async getActivityBreakdown(userId) {
    const query = `
      SELECT 
        activity_type,
        SUM(carbon_amount) as total_carbon,
        COUNT(*) as activity_count,
        ROUND(
          (SUM(carbon_amount) / (SELECT SUM(carbon_amount) FROM carbon_entries WHERE user_id = $1)) * 100, 
          2
        ) as percentage
      FROM carbon_entries 
      WHERE user_id = $1
      GROUP BY activity_type
      ORDER BY total_carbon DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = new UserService(); 