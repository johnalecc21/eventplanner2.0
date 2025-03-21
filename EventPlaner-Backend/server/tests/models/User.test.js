import mongoose from 'mongoose';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

// Variables globales para configuración
const TEST_DB_URI = 'mongodb+srv://Cluster59760:eventplanner@eventplanner.qsfb2.mongodb.net/';

// Configuración de conexión a MongoDB para pruebas
beforeAll(async () => {
  try {
    await mongoose.connect(TEST_DB_URI);
    console.log('Conectado a la base de datos de prueba');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
});

// Limpieza después de todas las pruebas
afterAll(async () => {
  try {
    await User.deleteMany({});
    await mongoose.connection.close();
    console.log('Conexión a la base de datos cerrada');
  } catch (error) {
    console.error('Error al cerrar la conexión:', error);
  }
});

// Limpieza antes de cada prueba
beforeEach(async () => {
  try {
    await User.deleteMany({});
  } catch (error) {
    console.error('Error al limpiar la colección de usuarios:', error);
  }
});

describe('User Model Tests', () => {
  // Test 1: Validación de datos requeridos
  test('debería rechazar un usuario sin datos requeridos', async () => {
    expect.assertions(3);
    
    const userSinNombre = new User({
      email: 'test@example.com',
      password: 'password123'
    });
    
    const userSinEmail = new User({
      name: 'Usuario Test',
      password: 'password123'
    });
    
    const userSinPassword = new User({
      name: 'Usuario Test',
      email: 'test@example.com'
    });
    
    try {
      await userSinNombre.validate();
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    try {
      await userSinEmail.validate();
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    try {
      await userSinPassword.validate();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  
  // Test 2: Validación de valores de rol
  test('debería rechazar roles inválidos', async () => {
    expect.assertions(1);
    
    const userRolInvalido = new User({
      name: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin' // No está en enum
    });
    
    try {
      await userRolInvalido.validate();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  
  // Test 3: Validación de email único
  test('debería rechazar emails duplicados', async () => {
    expect.assertions(1);
    
    const email = 'test@example.com';
    
    // Crear primer usuario
    const user1 = new User({
      name: 'Usuario 1',
      email: email,
      password: 'password123'
    });
    
    await user1.save();
    
    // Intentar crear otro usuario con el mismo email
    const user2 = new User({
      name: 'Usuario 2',
      email: email,
      password: 'diferente123'
    });
    
    try {
      await user2.save();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  
  // Test 4: Verificar que la contraseña se hashea
  test('debería hashear la contraseña antes de guardar', async () => {
    const plainPassword = 'password123';
    const user = new User({
      name: 'Usuario Test',
      email: 'test@example.com',
      password: plainPassword
    });
    
    await user.save();
    
    // Verificar que la contraseña guardada no es igual a la original
    expect(user.password).not.toBe(plainPassword);
    
    // Verificar que el hash funciona con bcrypt.compare
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    expect(isMatch).toBe(true);
  });
  
  // Test 5: Probar el método comparePassword
  test('debería comparar contraseñas correctamente', async () => {
    const plainPassword = 'password123';
    const wrongPassword = 'wrongpassword';
    
    const user = new User({
      name: 'Usuario Test',
      email: 'test@example.com',
      password: plainPassword
    });
    
    await user.save();
    
    // Verificar contraseña correcta
    const isMatchCorrect = await user.comparePassword(plainPassword);
    expect(isMatchCorrect).toBe(true);
    
    // Verificar contraseña incorrecta
    const isMatchWrong = await user.comparePassword(wrongPassword);
    expect(isMatchWrong).toBe(false);
  });
  
  // Test 6: Verificar valores por defecto
  test('debería asignar valores por defecto correctamente', async () => {
    const user = new User({
      name: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await user.save();
    
    // Verificar rol por defecto
    expect(user.role).toBe('user');
    
    // Verificar que la fecha de creación es cercana a la actual
    const now = new Date();
    const creationTime = user.createdAt.getTime();
    const currentTime = now.getTime();
    
    // Verificar que la fecha de creación no difiera en más de 5 segundos
    expect(Math.abs(currentTime - creationTime)).toBeLessThan(5000);
  });
});