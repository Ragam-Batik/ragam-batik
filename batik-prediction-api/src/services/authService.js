const supabase = require('../config/supabase');
const Boom = require('@hapi/boom');

class AuthService {
  async register(email, password, fullName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('already registered')) {
          throw Boom.conflict('Email already registered');
        }
        
        throw Boom.badRequest(error.message);
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return {
        user: data.user,
        session: data.session
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Registration service error:', error);
      throw Boom.internal('Registration failed');
    }
  }

  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          throw Boom.unauthorized('Invalid email or password');
        }
        
        throw Boom.badRequest(error.message);
      }

      return {
        user: data.user,
        session: data.session,
        access_token: data.session.access_token
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Login service error:', error);
      throw Boom.internal('Login failed');
    }
  }

  async logout(token) {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw Boom.internal('Logout failed');
      }

      return { message: 'Logged out successfully' };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Logout service error:', error);
      throw Boom.internal('Logout failed');
    }
  }

  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get profile error:', error);
        throw Boom.notFound('Profile not found');
      }

      return data;
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Get profile service error:', error);
      throw Boom.internal('Failed to get profile');
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update profile error:', error);
        throw Boom.badRequest('Failed to update profile');
      }

      return data;
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Update profile service error:', error);
      throw Boom.internal('Failed to update profile');
    }
  }
}

module.exports = new AuthService();